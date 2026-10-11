#!/usr/bin/env python3
"""Build a small public discovery index from themed HTML, never from draft data.

Runs only inside the generated .site-build/ after build_site.py. The Git source,
historical article lists, SHUGE data snapshots and original page HTML remain
untouched. The output is a deterministic static HTML page plus JSON metadata.
"""
from __future__ import annotations

from html import escape
from html.parser import HTMLParser
import json
from pathlib import Path
import re

KINDS = (
    ("article", "文章"),
    ("project", "项目"),
    ("exhibition", "展览"),
    ("reference", "文献"),
)
KIND_LABELS = dict(KINDS)
MARKED_KIND = "site-index-kind"


class MetaReader(HTMLParser):
    def __init__(self, source: str):
        super().__init__(convert_charrefs=True)
        self.meta = {}
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        if tag != "meta":
            return
        attrs = dict(attrs)
        name = (attrs.get("name") or "").lower()
        if name in ("description", "robots", MARKED_KIND):
            self.meta[name] = attrs.get("content") or ""


def inferred_kind(path: str) -> str | None:
    """Include top-level published articles/projects, not nested research assets."""
    if re.fullmatch(r"posts/[^/]+\.html", path) and path != "posts/index.html":
        return "article"
    if re.fullmatch(r"projects/[^/]+/index\.html", path):
        slug = path.split("/")[1]
        if slug.startswith("shuge-exhibition-v0."):
            return None  # Keep historical snapshots in /site-map/, not the curated index.
        return "project"
    return None


def is_catalog_safe_path(path: str) -> bool:
    """Do not promote work copies, drafts or historical snapshots via metadata."""
    parts = Path(path).parts
    if not parts:
        return False
    if parts[0] in {"drafts", "future", "src", "connections", "research-terminal"}:
        return False
    if any(part in {"source", "sources", "work", "works", "reports",
                    "backups", "tests", "scripts", "templates"} for part in parts[:-1]):
        return False
    if path.startswith("projects/shuge-exhibition-v0."):
        return False
    return True


def collect_items(root: Path, manifest: dict) -> list[dict]:
    # Imported inside the function to avoid circular imports with personalize_site.
    from personalize_site import public_route, normalize_text
    from build_site import route

    indexed: dict[str, dict] = {}
    for record in manifest["pages"]:
        path = record["path"]
        if record.get("status") != "themed" or not public_route(path) or not is_catalog_safe_path(path):
            continue
        file = root / path
        if not file.is_file():
            continue
        meta = MetaReader(file.read_text(encoding="utf-8")).meta
        if "noindex" in meta.get("robots", "").lower():
            continue
        explicit = meta.get(MARKED_KIND, "").strip().lower()
        kind = explicit if explicit in KIND_LABELS else inferred_kind(path)
        if kind not in KIND_LABELS:
            continue
        url = route(path)
        if url in indexed:
            raise ValueError(f"Duplicate public content index URL: {url}")
        title = normalize_text(record.get("title") or Path(path).stem).strip()
        # A 160-character synopsis is metadata, not a provenance or academic claim.
        description = normalize_text(meta.get("description", "")).strip()[:160]
        indexed[url] = {"url": url, "title": title, "description": description,
                        "kind": kind, "source_path": path}
    return sorted(indexed.values(), key=lambda x: (list(KIND_LABELS).index(x["kind"]),
                                                    x["title"].casefold(), x["url"]))


def render_catalog(items: list[dict]) -> str:
    counts = {kind: sum(x["kind"] == kind for x in items) for kind, _ in KINDS}
    chunks = ['<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8">',
        '<meta name="viewport" content="width=device-width,initial-scale=1">',
        '<meta name="description" content="从已发布文章与项目自动生成的内容索引；可按研究类型筛选，历史原文不改写。">',
        '<title>内容索引 · Conan Xin</title>',
        '<style>',
        '.content-index .index-controls{display:flex;flex-wrap:wrap;gap:12px;margin:20px 0 14px}',
        '.content-index .index-controls input{flex:2 1 260px;min-width:0}',
        '.content-index .index-controls select{flex:1 1 150px;min-width:0}',
        '.content-index .index-group{margin:36px 0 45px}',
        '.content-index .index-list{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:minmax(0,1fr);gap:12px}',
        '.content-index .index-list li{background:var(--site-paper);border:1px solid var(--site-line);border-radius:4px;padding:15px 19px;min-width:0}',
        '.content-index .index-list a{font:600 18px/1.6 var(--site-serif);overflow-wrap:anywhere;word-break:break-word}',
        '.content-index .index-list p{margin:5px 0 0;color:var(--site-muted);font:14px/1.75 var(--site-sans);overflow-wrap:anywhere;word-break:break-word}',
        '.content-index .index-status{color:var(--site-muted);font:13px/1.8 var(--site-sans)}',
        '.content-index .index-summary{display:flex;flex-wrap:wrap;gap:12px 22px;color:var(--site-muted)}',
        '.content-index [hidden]{display:none!important}',
        '</style></head><body><main class="site-home content-index">',
        '<section class="home-hero"><h1>内容索引</h1>',
        '<p>从已发布的文章、项目及经标记的展览和文献导览自动生成。仅收录公开页面，不检索私人文档或 SHUGE 原始数据库；标题排序不代表发表日期。</p>',
        '<p><a class="site-link" href="/site-map/">查看完整站点目录 →</a></p>',
        '</section><section aria-label="内容搜索与筛选">',
        '<div class="index-summary">']
    for kind, label in KINDS:
        chunks.append(f'<span>{escape(label)} {counts[kind]}</span>')
    chunks.extend(['</div><form id="index-filter" role="search" class="index-controls">',
        '<label for="index-search" class="visually-hidden">搜索标题和简介</label>',
        '<input id="index-search" type="search" placeholder="搜索标题与简介" autocomplete="off">',
        '<label for="index-kind" class="visually-hidden">按内容类型筛选</label>',
        '<select id="index-kind" aria-label="内容类型"><option value="">全部类型</option>'])
    for kind, label in KINDS:
        chunks.append(f'<option value="{kind}">{escape(label)}</option>')
    chunks.extend(['</select></form>',
        '<p id="index-count" role="status" aria-live="polite" class="index-status">',
        f'当前显示 {len(items)} 条内容</p></section>'])
    for kind, label in KINDS:
        entries = [x for x in items if x["kind"] == kind]
        chunks.append(f'<section class="index-group" data-group="{kind}" aria-label="{escape(label)}">'
                      f'<h2>{escape(label)} <small>({len(entries)})</small></h2>'
                      f'<ul class="index-list">')
        for entry in entries:
            text = escape(entry["title"] + " " + entry["description"], quote=True).lower()
            url = escape(entry["url"], quote=True)
            title = escape(entry["title"])
            desc = escape(entry["description"])
            chunks.append(f'<li data-index-card data-kind="{kind}" data-query="{text}">'
                          f'<a href="{url}">{title}</a>'
                          f'<p>{desc}</p></li>')
        chunks.append('</ul></section>')
    chunks.extend(['<p id="index-empty" hidden>没有符合当前条件的内容。可清空搜索或切换类型。</p>',
        '</main><script>',
        '(function(){',
        'const form=document.getElementById("index-filter"),',
        'input=document.getElementById("index-search"),',
        'kind=document.getElementById("index-kind"),',
        'cards=Array.from(document.querySelectorAll("[data-index-card]")),',
        'groups=Array.from(document.querySelectorAll("[data-group]")),',
        'output=document.getElementById("index-count"),',
        'empty=document.getElementById("index-empty");',
        'function refresh(){const q=input.value.trim().toLocaleLowerCase();let shown=0;',
        'cards.forEach(c=>{const match=(!kind.value||c.dataset.kind===kind.value)&&',
        '(!q||c.dataset.query.includes(q));c.hidden=!match;if(match)shown++;});',
        'groups.forEach(g=>g.hidden=!g.querySelector("[data-index-card]:not([hidden])"));',
        'output.textContent="当前显示 "+shown+" 条内容";empty.hidden=shown!==0;}',
        'form.addEventListener("submit",e=>e.preventDefault());',
        'input.addEventListener("input",refresh);kind.addEventListener("change",refresh);refresh();',
        '})();',
        '</script></body></html>'])
    return "".join(chunks)


def publish_index(root: Path, manifest: dict) -> dict:
    """Write /content-index/ + assets/site/content-index.json only in build output."""
    from build_site import transform
    from personalize_site import personalize_html

    items = collect_items(root, manifest)
    if not items:
        raise AssertionError("Content index would be empty; inspect the published manifest.")
    counts = {kind: sum(x["kind"] == kind for x in items) for kind, _ in KINDS}
    raw = render_catalog(items)
    built, status = transform(raw, "content-index/index.html")
    if status["status"] != "themed":
        raise AssertionError("Generated index failed shared chrome injection.")
    target = root / "content-index/index.html"
    target.parent.mkdir(exist_ok=True)
    target.write_text(personalize_html(built, "content-index/index.html"), encoding="utf-8")
    meta = root / "assets/site/content-index.json"
    meta.write_text(json.dumps({"version": "stage2d-v1", "counts": counts,
                                "total": len(items), "items": items},
                               ensure_ascii=False, indent=2), encoding="utf-8")
    return {"counts": counts, "total": len(items), "url": "/content-index/"}
