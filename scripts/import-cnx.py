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


def attribute(tag: str, name: str) -> str | None:
    """Return an HTML attribute value from a tag, if it has one."""
    match = re.search(rf'\b{re.escape(name)}\s*=\s*"([^"]*)"', tag, re.IGNORECASE)
    return html.unescape(match.group(1)) if match else None


def convert_figures(body: str) -> str:
    """Turn retained HTML figures into MyST-recognized images.

    CNX can nest ``<figure>`` elements, while MyST's figure directive accepts
    only one image. Convert each image independently and retain captions as
    ordinary text; this guarantees that every asset is copied into HTML.
    """
    body = re.sub(
        r"<figcaption\b[^>]*>(?P<caption>.*?)</figcaption>",
        lambda match: f"\n\n{match.group('caption').strip()}\n\n",
        body,
        flags=re.IGNORECASE | re.DOTALL,
    )
    body = re.sub(r"</?figure\b[^>]*>", "", body, flags=re.IGNORECASE)

    def image_replacement(match: re.Match[str]) -> str:
        source = attribute(match.group(0), "src")
        if not source:
            return match.group(0)
        return f"![{attribute(match.group(0), 'alt') or ''}]({source})"

    return re.sub(r"<img\b[^>]*>", image_replacement, body, flags=re.IGNORECASE)


def convert_callouts(body: str) -> str:
    """Convert Pandoc CommonMark divs to MyST admonitions.

    Pandoc writes CNX callouts as ``::: {#id .class}``, which MyST displays as
    literal text. Section wrappers add no useful HTML semantics, while the
    remaining callouts become nested MyST admonitions with their original CSS
    classes.
    """
    titles = {
        "example": "Example",
        "exercise": "Practice",
        "note": "Note",
        "problem": "Question",
        "solution": "Solution",
    }
    opening = re.compile(r"^::: \{#(?P<id>[A-Za-z0-9_.:-]+) \.(?P<class>[A-Za-z0-9_-]+)\}$")
    stack: list[tuple[str, int]] = []
    lines: list[str] = []
    skip_label = False

    for line in body.splitlines():
        match = opening.match(line)
        if match:
            kind = match.group("class")
            if kind == "section":
                stack.append((kind, 0))
                continue
            if kind in titles:
                fence = 3 + sum(1 for _, depth in stack if depth)
                stack.append((kind, fence))
                lines.extend([
                    f"{':' * fence}{{admonition}} {titles[kind]}",
                    f":name: {match.group('id')}",
                    f":class: {kind}",
                    "",
                ])
                skip_label = True
                continue

        if line == ":::" and stack:
            _, fence = stack.pop()
            if fence:
                lines.append(":" * fence)
            continue

        if skip_label:
            if line in {"**Practice**", "**Example**", "**Note**", "**Question**", "**Solution**"}:
                skip_label = False
                continue
            skip_label = False
        lines.append(line)

    if stack:
        raise RuntimeError("Unclosed Pandoc div in imported content")
    return "\n".join(lines)


def remove_id_containers(body: str) -> str:
    """Remove remaining ID-only Pandoc containers without disturbing MyST fences."""
    directive = re.compile(r"^(?P<fence>:{3,})\{admonition\}")
    identifier = re.compile(r"^:{3,} \{#[A-Za-z0-9_.:-]+\}$")
    closing = re.compile(r"^:{3,}$")
    stack: list[tuple[str, int]] = []
    lines: list[str] = []

    for line in body.splitlines():
        directive_match = directive.match(line)
        if directive_match:
            fence = len(directive_match.group("fence"))
            stack.append(("directive", fence))
            lines.append(line)
            continue

        if identifier.match(line):
            # Adjacent ID-only divs are siblings, even when Pandoc omitted the
            # first closing fence. A nested div closes at its parent directive's
            # fence length in the CommonMark emitted by Pandoc.
            if stack and stack[-1][0] == "container":
                stack.pop()
            parent_fence = next((fence for kind, fence in reversed(stack) if kind == "directive"), 3)
            stack.append(("container", parent_fence))
            continue

        if closing.match(line):
            fence = len(line)
            if stack and stack[-1] == ("container", fence):
                stack.pop()
                continue
            if stack and stack[-1] == ("directive", fence):
                stack.pop()
                lines.append(line)
                continue
        lines.append(line)

    return "\n".join(lines)


def normalize_admonition_fences(body: str) -> str:
    """Balance MyST admonition fences after removing Pandoc-only containers."""
    opening = re.compile(r"^(?P<fence>:{3,})\{admonition\}")
    closing = re.compile(r"^:{3,}$")
    stack: list[int] = []
    lines: list[str] = []

    for line in body.splitlines():
        match = opening.match(line)
        if match:
            fence = len(match.group("fence"))
            # A new fence at this depth starts a sibling, not a child.
            while stack and stack[-1] >= fence:
                lines.append(":" * stack.pop())
            stack.append(fence)
            lines.append(line)
            continue
        if closing.match(line):
            if stack:
                lines.append(":" * stack.pop())
            continue
        lines.append(line)

    while stack:
        lines.append(":" * stack.pop())
    return "\n".join(lines)


def normalize_existing_pages() -> None:
    """Apply the current post-import normalization without requiring the EPUB.

    This is useful for a checkout that contains the generated book but not the
    large, vendored EPUB export.
    """
    pages = [ROOT / "front" / "introduction.md", *sorted((ROOT / "chapters").glob("*.md"))]
    for page in pages:
        body = page.read_text(encoding="utf-8")
        # Existing imports put a Pandoc anchor immediately before each figure.
        # Preserve its useful figure name before discarding all standalone
        # anchors, which MyST otherwise prints literally.
        body = re.sub(
            r'^\[\]\{#([A-Za-z0-9_.:-]+)\}\n(?=<figure\b)',
            r'<figure id="\1">',
            body,
            flags=re.MULTILINE,
        )
        body = re.sub(r'^\[\]\{#[A-Za-z0-9_.:-]+\}\n?', '', body, flags=re.MULTILINE)
        body = convert_figures(body)
        body = convert_callouts(body)
        body = remove_id_containers(body)
        body = normalize_admonition_fences(body)
        body = re.sub(r"\n{3,}", "\n\n", body).strip() + "\n"
        page.write_text(body, encoding="utf-8")
    print(f"Normalized {len(pages)} existing MyST pages.")


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
            prepared_page.write_text(source_page.read_text(encoding="utf-8"), encoding="utf-8")

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

            # Fragment-only links cannot survive reliably after the pages are
            # separated into MyST documents. Keep their text readable and send
            # cross-page links to the relevant lesson.
            body = re.sub(r"\[([^\]]+)\]\(#[^)]+\)", r"\1", body)
            body = re.sub(r'<a href="#[^"]+">([^<]*)</a>', r"\1", body)
            body = re.sub(r'(ch-[^\s)#"]+\.md)#[A-Za-z0-9_.:-]+', r"\1", body)
            body = re.sub(r'id="([A-Za-z0-9_.:-]+)"', rf'id="{module.module_id}-\1"', body)
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
            body = convert_figures(body)
            body = convert_callouts(body)
            body = remove_id_containers(body)
            body = normalize_admonition_fences(body)
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
    if "--normalize-existing" in __import__("sys").argv[1:]:
        normalize_existing_pages()
    else:
        convert()
