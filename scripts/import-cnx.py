#!/usr/bin/env python3
"""Convert the bundled Schmidt-Jones EPUB/CNXML sources to MyST pages.

Pandoc performs the HTML-to-Markdown conversion; the collection XML remains
the authority for reading order and module identity. Run this script from the
repository root after updating either source submodule or EPUB export.
"""

from __future__ import annotations

import html
import json
import re
import shutil
import subprocess
import tempfile
import unicodedata
import xml.etree.ElementTree as ET
import zipfile
from dataclasses import dataclass
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "schmidt-jones-sources" / "cnxbook-understanding-basic-music-theory"
COLLECTION = SOURCE / "collections" / "understanding-basic-music-theory.collection.xml"
EPUB = ROOT / "schmidt-jones-sources" / "exports" / "understanding-basic-music-theory.epub"
FILTER = ROOT / "scripts" / "cnx-to-myst.lua"
MEDIA_OUT = ROOT / "images" / "cnx"
SUPPLEMENTAL_MEDIA = {
    "fifth.mid": SOURCE / "media" / "fifth-9075.mid",
    "octave.mid": SOURCE / "media" / "octave-3c89.mid",
}


@dataclass(frozen=True)
class Module:
    module_id: str
    title: str
    abstract: str
    uuid: str
    output: Path


def preserve_inline_anchors(source: str) -> str:
    """Add explicit spans for HTML ids that Pandoc otherwise discards."""
    pattern = re.compile(r'<(?P<tag>p|ul|ol|li)\b(?P<attrs>[^>]*\bid="(?P<id>[^"]+)"[^>]*)>')
    return pattern.sub(
        lambda match: f'<span id="{match.group("id")}"></span><{match.group("tag")}{match.group("attrs")}>',
        source,
    )


def local_name(tag: str) -> str:
    return tag.rsplit("}", 1)[-1]


def direct_child(element: ET.Element, name: str) -> ET.Element | None:
    return next((child for child in element if local_name(child.tag) == name), None)


def child_text(element: ET.Element, name: str) -> str:
    child = direct_child(element, name)
    return "" if child is None else " ".join("".join(child.itertext()).split())


def slugify(value: str) -> str:
    value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode()
    value = re.sub(r"[^a-zA-Z0-9]+", "-", value.lower()).strip("-")
    return value or "lesson"


def collection_order() -> list[str]:
    root = ET.parse(COLLECTION).getroot()
    content = direct_child(root, "content")
    if content is None:
        raise RuntimeError(f"No collection content found in {COLLECTION}")
    return [node.attrib["document"] for node in content.iter() if local_name(node.tag) == "module"]


def read_modules() -> list[Module]:
    modules: list[Module] = []
    lesson_number = 0
    for module_id in collection_order():
        source_file = SOURCE / "modules" / module_id / "index.cnxml"
        root = ET.parse(source_file).getroot()
        title = child_text(root, "title")
        metadata = direct_child(root, "metadata")
        if metadata is None:
            raise RuntimeError(f"No metadata found in {source_file}")
        uuid = next(
            ("".join(node.itertext()).strip() for node in metadata if local_name(node.tag) == "uuid"),
            "",
        )
        abstract = next(
            (" ".join("".join(node.itertext()).split()) for node in metadata if local_name(node.tag) == "abstract"),
            "",
        )
        if module_id == "m13685":
            output = ROOT / "front" / "introduction.md"
        else:
            lesson_number += 1
            output = ROOT / "chapters" / f"ch-{lesson_number:02d}-{slugify(title)}.md"
        modules.append(Module(module_id, title, abstract, uuid, output))
    return modules


def frontmatter(module: Module) -> str:
    lines = [
        "---",
        f"title: {json.dumps(module.title, ensure_ascii=False)}",
        f"description: {json.dumps(module.abstract or f'An open lesson on {module.title.lower()}.', ensure_ascii=False)}",
        "authors:",
        "  - name: Catherine Schmidt-Jones",
        "license: CC-BY-2.0",
        "open_access: true",
        "source: " + json.dumps(
            "https://github.com/cnx-user-books/cnxbook-understanding-basic-music-theory/"
            f"blob/d748840fe868c82b529005c2b16748fe1471108c/modules/{module.module_id}/index.cnxml"
        ),
        "---",
        "",
    ]
    if module.abstract:
        lines.extend([f"*{module.abstract}*", ""])
    return "\n".join(lines) + "\n"


def convert() -> None:
    if shutil.which("pandoc") is None:
        raise RuntimeError("Pandoc is required to import the CNX EPUB.")
    if not EPUB.exists() or not COLLECTION.exists():
        raise RuntimeError("The Schmidt-Jones source submodules and EPUB export are required.")

    modules = read_modules()
    module_targets = {module.uuid: (module.output.name, module.module_id) for module in modules}
    referenced_media: set[str] = set()

    with tempfile.TemporaryDirectory(prefix="cnx-myst-") as temporary:
        extracted = Path(temporary) / "epub"
        with zipfile.ZipFile(EPUB) as archive:
            archive.extractall(extracted)
        contents = extracted / "contents"
        pages = list(contents.glob("*.xhtml"))

        for module in modules:
            matches = [page for page in pages if module.uuid in page.name]
            if len(matches) != 1:
                raise RuntimeError(f"Expected one EPUB page for {module.module_id} ({module.uuid}); found {len(matches)}")

            source_page = matches[0]
            prepared_page = source_page.with_name(f"prepared-{module.uuid}.xhtml")
            prepared_page.write_text(preserve_inline_anchors(source_page.read_text(encoding="utf-8")), encoding="utf-8")

            result = subprocess.run(
                [
                    "pandoc",
                    str(prepared_page),
                    "--from=html",
                    "--to=commonmark_x",
                    "--wrap=none",
                    f"--lua-filter={FILTER}",
                ],
                check=True,
                capture_output=True,
                text=True,
            )
            body = result.stdout

            for uuid, (target, target_module) in module_targets.items():
                source_target = rf"(?:\./)?[^()\s\"']*:{re.escape(uuid)}\.xhtml"
                body = re.sub(
                    rf'href="{source_target}(?:#([A-Za-z0-9_.:-]+))?"',
                    f'href="{target}"',
                    body,
                )
                body = re.sub(
                    rf"\({source_target}(?:#([A-Za-z0-9_.:-]+))?\)",
                    f"({target})",
                    body,
                )

            # MyST does not register anchors inside retained raw-HTML figures.
            # Keep same-page references readable as text and direct cross-page
            # references to the relevant lesson rather than a missing fragment.
            body = re.sub(r"\[([^\]]+)\]\(#[^)]+\)", r"\1", body)
            body = re.sub(r'<a href="#[^"]+">([^<]*)</a>', r"\1", body)
            body = re.sub(r'(ch-[^\s)#"]+\.md)#[A-Za-z0-9_.:-]+', r"\1", body)
            body = re.sub(r"\{#([A-Za-z0-9_.:-]+)", rf"{{#{module.module_id}-\1", body)
            body = re.sub(r'id="([A-Za-z0-9_.:-]+)"', rf'id="{module.module_id}-\1"', body)
            body = re.sub(
                rf'<figure id="({module.module_id}-[^"]+)"([^>]*)>',
                r'[]{#\1}\n<figure\2>',
                body,
            )
            body = body.replace("(resources/", "(../images/cnx/")
            body = body.replace('src="resources/', 'src="../images/cnx/')
            body = body.replace('href="resources/', 'href="../images/cnx/')
            body = body.replace("[\\[link\\]]", "[the referenced item]")
            body = body.replace(
                "\\[missing_resource: fifth.mid\\]",
                "[perfect fifth](../images/cnx/fifth.mid), ",
            )
            body = body.replace(
                "\\[missing_resource: octave.mid\\]",
                "[octave](../images/cnx/octave.mid)",
            )
            body = re.sub(r"\[([^\]]+)\]\(#[^)]+\)", r"\1", body)
            body = re.sub(r"\[([^\]]+)\]\(\)", r"\1", body)
            body = re.sub(r"\n{3,}", "\n\n", body).strip() + "\n"

            module.output.parent.mkdir(parents=True, exist_ok=True)
            module.output.write_text(frontmatter(module) + body, encoding="utf-8")
            referenced_media.update(re.findall(r"\.\./images/cnx/([^\s)\"'>]+)", body))

        MEDIA_OUT.mkdir(parents=True, exist_ok=True)
        resources = contents / "resources"
        for name in sorted(referenced_media):
            if name in SUPPLEMENTAL_MEDIA:
                continue
            source_file = resources / html.unescape(name)
            if not source_file.is_file():
                raise RuntimeError(f"Referenced EPUB resource is missing: {name}")
            shutil.copy2(source_file, MEDIA_OUT / source_file.name)

        for name, source_file in SUPPLEMENTAL_MEDIA.items():
            if not source_file.is_file():
                raise RuntimeError(f"Supplemental CNX resource is missing: {source_file}")
            shutil.copy2(source_file, MEDIA_OUT / name)

    media_count = len(referenced_media | set(SUPPLEMENTAL_MEDIA))
    print(f"Imported {len(modules)} CNX modules and {media_count} media files.")
    for module in modules:
        print(module.output.relative_to(ROOT))


if __name__ == "__main__":
    convert()
