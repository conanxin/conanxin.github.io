"""
Gate validation for yarvin-moldbug-cn project.
Verifies the generated index.html + content files are production-ready.

Gate A: file size + content count
Gate B: ID uniqueness
Gate C: positive grep (required sections, anchors, key terms)
Gate D: negative grep (stale text, markdown residue, missing-JS placeholders)
Gate E: TOC anchor wiring (TOC has entries for every article H2)
Gate F: HTML <-> JS <-> CSS wiring (no missing references)
"""
import re
import sys
import json
import html
from pathlib import Path

ROOT = Path('/home/ubuntu/conanxin.github.io/projects/yarvin-moldbug-cn')

passed = []
failed = []

def check(name, ok, detail=''):
    if ok:
        passed.append(name)
        print(f"  PASS  {name}  {detail}")
    else:
        failed.append(name)
        print(f"  FAIL  {name}  {detail}")

# Load files
with open(ROOT / 'index.html') as f:
    INDEX = f.read()
with open(ROOT / 'styles.css') as f:
    STYLES = f.read()
with open(ROOT / 'app.js') as f:
    APPJS = f.read()
with open(ROOT / 'content' / 'translation.zh.md') as f:
    MD = f.read()
with open(ROOT / 'content' / 'background.json') as f:
    BG = json.load(f)
with open(ROOT / 'content' / 'translation.sections.json') as f:
    SECTIONS = json.load(f)

print("=" * 60)
print("Gate A — size & content")
print("=" * 60)

# Visible text from <main> only
m = re.search(r'<main[^>]*>(.*?)</main>', INDEX, re.S | re.I)
if m:
    main_text = m.group(1)
else:
    main_text = INDEX
# Strip script/style/template
text = re.sub(r'<script\b[^>]*>.*?</script>', '', main_text, flags=re.S|re.I)
text = re.sub(r'<style\b[^>]*>.*?</style>', '', text, flags=re.S|re.I)
text = re.sub(r'<template\b[^>]*>.*?</template>', '', text, flags=re.S|re.I)
text = re.sub(r'<[^>]+>', '', text)
text = html.unescape(text)
zh_chars = len(re.findall(r'[\u4e00-\u9fff]', text))

# Counts
h2_in_article = re.findall(r'<h2 id="([^"]+)"', INDEX)
h3_in_article = re.findall(r'<h3>', INDEX)
blockquote_in_article = re.findall(r'<blockquote class="article-quote">', INDEX)
p_in_article = re.findall(r'<p>', INDEX)
links_in_article = re.findall(r'<a [^>]*href="[^"]+"', INDEX)

check("A1: index.html >= 30KB", len(INDEX) >= 30000, f"({len(INDEX)} chars)")
check("A2: visible Chinese chars >= 10000", zh_chars >= 10000, f"({zh_chars} chars)")
check("A3: 9 article H2 sections", len(h2_in_article) == 9, f"({len(h2_in_article)})")
check("A4: >= 60 paragraphs in article", len(p_in_article) >= 60, f"({len(p_in_article)})")
check("A5: >= 14 blockquotes in article", len(blockquote_in_article) >= 14, f"({len(blockquote_in_article)})")
check("A6: >= 50 links in article", len(links_in_article) >= 50, f"({len(links_in_article)})")

# Translation file
md_zh = len(re.findall(r'[\u4e00-\u9fff]', MD))
check("A7: translation.zh.md >= 10000 Chinese chars", md_zh >= 10000, f"({md_zh} chars)")

# Background
check("A8: background.json has >= 20 glossary items", len(BG.get('glossary', [])) >= 20, f"({len(BG.get('glossary', []))} items)")
check("A9: background.json has >= 10 timeline events", len(BG.get('timeline', [])) >= 10, f"({len(BG.get('timeline', []))} events)")
check("A10: background.json has 4 reading paths", len(BG.get('reading_paths', {})) == 4, f"({len(BG.get('reading_paths', {}))} paths)")

print()
print("=" * 60)
print("Gate B — ID uniqueness")
print("=" * 60)

ids = re.findall(r'\bid="([^"]+)"', INDEX)
ids_dup = [i for i in set(ids) if ids.count(i) > 1]
check("B1: zero duplicate ids in index.html", len(ids_dup) == 0, f"({len(ids)} unique, dupes: {ids_dup[:5]})")

print()
print("=" * 60)
print("Gate C — positive grep")
print("=" * 60)

REQUIRED_IDS = [
    "hero", "progressBar", "searchOverlay", "searchInput",
    "tocList", "article", "context-section", "cathedral-section",
    "neocameralism-section", "patchwork-section", "glossary-section",
    "timeline-section", "sources-section", "reading-paths", "backToTop",
    "heroStars", "cathedralDiagram", "patchworkViz"
]
for rid in REQUIRED_IDS:
    check(f"C-id {rid}", f'id="{rid}"' in INDEX)

# Article H2 anchors (9)
REQUIRED_H2 = [
    "mencius-moldbug", "blogger-from-cradle-to-grave", "land-sloterdijk-yarvin",
    "yarvin-for-beginners", "a-gentle-introduction", "american-history-whig",
    "patchwork-final-solution", "cathedral-overuse", "closing-remarks"
]
for hid in REQUIRED_H2:
    check(f"C-h2 {hid}", f'id="{hid}"' in INDEX)

# Key terms (accept EN or CN variants)
KEY_TERMS = [
    ("Curtis Yarvin", ["Curtis Yarvin"]),
    ("Mencius Moldbug", ["Mencius Moldbug"]),
    ("红丸", ["红丸", "Red Pill"]),
    ("大教堂", ["大教堂", "Cathedral"]),
    ("Patchwork", ["Patchwork"]),
    ("新议事主义", ["新议事主义", "Neocameralism"]),
    ("新反动主义", ["新反动主义", "Neoreaction"]),
    ("Juan Ruocco", ["Juan Ruocco"]),
    ("421.news", ["421.news"]),
    ("斯图亚特", ["斯图亚特", "Stuart"]),
    ("克苏鲁", ["克苏鲁", "Cthulhu"]),
    ("辉格", ["辉格", "Whig"]),
    ("葛兰西/Gramsci", ["葛兰西", "Gramsci"]),
    ("伯恩汉姆/Burnham", ["伯恩汉姆", "Burnham", "詹姆斯·伯恩汉姆"]),
    ("施米特/Schmitt", ["施米特", "Schmitt", "卡尔·施米特"]),
    ("蒂尔/Thiel", ["蒂尔", "Thiel"]),
    ("雅各布/Jacob", ["雅各布", "Jacob"]),
    ("Urbit", ["Urbit"]),
    ("比特币", ["比特币", "Bitcoin"]),
    ("J.D. Vance", ["J.D. Vance", "Vance"]),
    ("MAGA", ["MAGA"]),
    ("Yarvin 入门", ["Yarvin 入门"]),
    ("写在最后", ["写在最后"])
]
for term_label, variants in KEY_TERMS:
    found = any(v in INDEX for v in variants)
    check(f"C-term {term_label}", found, f"(variants: {variants})")

# Script + CSS + json references
check("C: index.html references styles.css", 'href="styles.css?v=20260625-v1"' in INDEX)
check("C: index.html references app.js", 'src="app.js?v=20260625-v1"' in INDEX)
check("C: app.js fetches content/background.json", "content/background.json" in APPJS)

print()
print("=" * 60)
print("Gate D — negative grep")
print("=" * 60)

NEGATIVE_PATTERNS = [
    ("D1: no '![' Markdown residue in article body", r'!\['),
    ("D2: no '](../assets/' raw paths", r'\]\(\.\./assets/'),
    ("D3: no standalone '[' lines", r'^\s*\[\s*$'),
    ("D4: no loading placeholder for glossary (lazy attribute OK)", r'正在加载术语|加载中…|class="loading"'),
    ("D5: no disclaimer text", r'粉丝/学术翻译|版权归原作者|不担保准确性|免责声明'),
    ("D6: no leftover WBW SpaceX content (URL slugs OK)", r'>\s*WBW\s*<|>\s*SpaceX\s*<|>\s*Mars Colonial\s*<|>Starship\s*<|>Falcon\s*<'),
    ("D7: no broken H2 id 'mencius-moldbug-' (no trailing dash)", r'id="mencius-moldbug-"'),
    ("D8: no TODO/FIXME/XXX (placeholder= attr OK)", r'\bTODO\b|\bFIXME\b|\bXXX\b|>\s*placeholder\s*<'),
]
for name, pat in NEGATIVE_PATTERNS:
    found = re.search(pat, INDEX, re.I)
    check(name, not found, f"({pat!r} found)" if found else "")

# Translation file negative
NEG_MD = [
    ("D9: no TODO in translation", r'TODO|FIXME|placeholder|TBD', MD),
    ("D10: no skipped/omitted in translation", r'skipped|omitted|省略|未完成|此处略', MD),
]
for name, pat, target in NEG_MD:
    found = re.search(pat, target, re.I)
    check(name, not found, f"({pat!r} found)" if found else "")

print()
print("=" * 60)
print("Gate E — TOC wiring")
print("=" * 60)

# TOC must include all 9 article anchors
toc_html_match = re.search(r'<ul class="toc-list" id="tocList">(.*?)</ul>', INDEX, re.S)
if toc_html_match:
    toc_html = toc_html_match.group(1)
    toc_hrefs = re.findall(r'href="#([^"]+)"', toc_html)
    missing_toc = [h for h in REQUIRED_H2 if h not in toc_hrefs]
    check("E1: TOC has all 9 article anchors", len(missing_toc) == 0, f"(missing: {missing_toc})")
    # TOC should also have the 4 module anchors
    REQUIRED_TOC_MOD = ["context-section", "glossary-section", "timeline-section", "sources-section", "reading-paths"]
    missing_mod = [h for h in REQUIRED_TOC_MOD if h not in toc_hrefs]
    check("E2: TOC has all module anchors", len(missing_mod) == 0, f"(missing: {missing_mod})")
else:
    check("E1: TOC list found", False)
    check("E2: TOC has all module anchors", False)

print()
print("=" * 60)
print("Gate F — HTML <-> JS <-> CSS wiring")
print("=" * 60)

# Get all id=... in HTML
html_ids = set(re.findall(r'\bid="([^"]+)"', INDEX))

# Check that JS uses these ids
JS_GETELEMENT = re.findall(r"getElementById\(['\"]([^'\"]+)['\"]\)", APPJS)
JS_QUERYSELECTOR = re.findall(r"querySelector(?:All)?\(['\"]#?([\w-]+)", APPJS)
JS_REFS = set(JS_GETELEMENT + JS_QUERYSELECTOR)
# strip # from querySelector matches
JS_REFS_RAW = set(JS_GETELEMENT) | set(re.findall(r"querySelector(?:All)?\(['\"]#([\w-]+)", APPJS))

missing_in_html = JS_REFS_RAW - html_ids
check("F1: all JS getElementById ids exist in HTML", len(missing_in_html) == 0, f"(missing: {missing_in_html})")

# Check that styles.css has classes used in HTML
# Take 5 sample class names from HTML and verify CSS has them
HTML_CLASSES = set(re.findall(r'class="([^"]+)"', INDEX))
# Take just the first class of each (most specific)
sample_classes = set()
for c in HTML_CLASSES:
    first = c.split()[0]
    sample_classes.add(first)
# Verify 5+ sample classes have CSS rules
css_has = sum(1 for c in sample_classes if f".{c}" in STYLES or f" {c} " in STYLES or f".{c}{{" in STYLES)
check("F2: CSS covers most HTML classes (heuristic)", css_has > 0.5 * len(sample_classes), f"({css_has}/{len(sample_classes)})")

# Cache bust
check("F3: cache-bust ?v= present in HTML references", "?v=20260625-v1" in INDEX)

# Theme attribute on <html>
check("F4: data-theme attr on html tag", 'data-theme' in INDEX[:500])
check("F5: data-reading-mode attr on html tag", 'data-reading-mode' in INDEX[:500])

print()
print("=" * 60)
print("SUMMARY")
print("=" * 60)
print(f"PASSED: {len(passed)}")
print(f"FAILED: {len(failed)}")
if failed:
    print()
    print("Failed checks:")
    for f in failed:
        print(f"  - {f}")
    sys.exit(1)
else:
    print("ALL GATES PASSED ✓")
    sys.exit(0)