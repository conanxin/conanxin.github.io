#!/usr/bin/env python3
"""Finish the existing reader build with Conan Xin's public identity.
Only presentation text and owned profile links change. Scripts, code, form
values, source articles in Git, and research JSON remain untouched.
"""
from __future__ import annotations
from collections import defaultdict
from html import escape
from html.parser import HTMLParser
import argparse
import json
from pathlib import Path
import re
from urllib.parse import unquote, urlsplit

NAME = 'Conan Xin'
EMAIL = 'conanxin@gmail.com'
IDENTITY = 'conan-xin-v1'
PROTECTED = {'script', 'style', 'pre', 'code', 'textarea', 'kbd', 'samp'}
VOID = set('area base br col embed hr img input link meta param source track wbr'.split())
PROFILE = {'@context': 'https://schema.org', '@type': 'Person', 'name': NAME,
    'url': 'https://conanxin.github.io/about.html', 'email': 'mailto:' + EMAIL,
    'description': '工程师、独立研究者与数字工具实践者，关注历史文献、数字档案、文化田野与人工智能。',
    'sameAs': ['https://github.com/conanxin', 'https://x.com/porco7161', 'https://ai.conanxin.com/']}

def normalize_text(value: str) -> str:
    value = re.sub(r'\bXin\s+Conan\b', NAME, value)
    value = value.replace('XIN_CONAN', 'CONAN_XIN').replace('hello@xin-conan.me', EMAIL)
    value = value.replace('@xin-conan', '@conanxin')
    if value.strip() == 'xin-conan': value = value.replace('xin-conan', NAME)
    return value

def public_route(path: str) -> bool:
    parts = Path(path).parts
    if not parts or parts[0] == 'src': return False
    if any(p in {'work', 'source', 'sources', 'reports', 'backups', 'tests', 'scripts', 'oauth'} for p in parts[:-1]):
        # sources/index.html is a reader-facing source list, not a captured original.
        return parts[-2:] == ('sources', 'index.html') and 'source' not in parts and 'work' not in parts
    return not any('.bak.' in p or p.startswith('_') for p in parts)

class IdentityEditor(HTMLParser):
    def __init__(self, source: str):
        super().__init__(convert_charrefs=False)
        self.source = source
        self.lines = [0] + [m.end() for m in re.finditer('\n', source)]
        self.stack: list[str] = []
        self.edits: list[tuple[int, int, str]] = []
        self.feed(source)
        self.close()
    def pos(self):
        line, col = self.getpos()
        return self.lines[line-1] + col
    def handle_starttag(self, tag, attrs):
        raw = self.get_starttag_text()
        if not any(t in PROTECTED for t in self.stack) and tag not in PROTECTED:
            patched = raw
            if tag in {'a', 'meta', 'img', 'link'}:
                for key, val in attrs:
                    if val is None or key not in {'content', 'title', 'alt', 'href', 'aria-label'}: continue
                    new = normalize_text(val)
                    if key == 'href' and val.rstrip('/') == 'https://github.com/xin-conan':
                        new = 'https://github.com/conanxin'
                    if new != val:
                        pattern = r'(?<![-\w])' + re.escape(key) + r'\s*=\s*(?:"[^"]*"|\x27[^\x27]*\x27|[^\s>]+)'
                        patched = re.sub(pattern, lambda _: key + '="' + escape(new, quote=True) + '"', patched, count=1, flags=re.I)
            if tag == 'body' and 'data-site-identity' not in dict(attrs):
                patched = patched[:-1] + ' data-site-identity="' + IDENTITY + '">'
            if patched != raw: self.edits.append((self.pos(), self.pos()+len(raw), patched))
        if tag not in VOID: self.stack.append(tag)
    def handle_startendtag(self, tag, attrs):
        depth = len(self.stack)
        self.handle_starttag(tag, attrs)
        del self.stack[depth:]
    def handle_endtag(self, tag):
        if tag in self.stack:
            del self.stack[len(self.stack)-1-self.stack[::-1].index(tag):]
    def handle_data(self, value):
        if any(t in PROTECTED for t in self.stack): return
        new = normalize_text(value)
        if new != value: self.edits.append((self.pos(), self.pos()+len(value), new))
    def result(self):
        out = self.source
        for start, end, value in sorted(self.edits, reverse=True): out = out[:start]+value+out[end:]
        return out

def personalize_html(source: str, path: str) -> str:
    out = IdentityEditor(source).result()
    if path in {'index.html', 'about.html', 'src/index.html', 'src/about.html'} and 'id="site-person"' not in out:
        schema = '<script type="application/ld+json" id="site-person">' + json.dumps(PROFILE, ensure_ascii=False).replace('<', '\\u003c') + '</script>'
        out = re.sub(r'</head\s*>', lambda m: schema+m.group(), out, count=1, flags=re.I)
    return out

class Links(HTMLParser):
    def __init__(self, source):
        super().__init__(); self.links=[]; self.feed(source)
    def handle_starttag(self, tag, attrs):
        if tag == 'a':
            href = dict(attrs).get('href')
            if href: self.links.append(href)

def apply(root: Path) -> dict:
    root = root.resolve()
    if not (root/'assets/site/style-manifest.json').is_file():
        raise ValueError('Run build_site.py first; this command requires its generated output.')
    changed = 0
    for p in root.rglob('*.html'):
        before = p.read_text(encoding='utf-8'); after = personalize_html(before, p.relative_to(root).as_posix())
        if after != before: p.write_text(after, encoding='utf-8'); changed += 1
    for rel in ('feed.xml', 'src/feed.xml'):
        p = root/rel
        if p.is_file(): p.write_text(IdentityEditor(p.read_text(encoding='utf-8')).result(), encoding='utf-8')
    manifest_path = root/'assets/site/style-manifest.json'
    manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
    groups = defaultdict(list)
    for row in manifest['pages']:
        if 'title' in row: row['title'] = normalize_text(row['title'])
        path = row['path']
        if row['status'] != 'themed' or not public_route(path): continue
        if re.match(r'projects/shuge-exhibition-v0\.', path):
            if len(Path(path).parts) == 3: groups['历史展览版本'].append(row)
            continue
        from build_site import section_for
        group = '预览与创作档案' if path.startswith('drafts/') else section_for(path)[0]
        groups[group].append(row)
    from build_site import transform, route
    sitemap = '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8"><title>站点目录 | Conan Xin</title></head><body><main class="site-home"><section class="home-hero"><h1>站点目录</h1><p>从文章、项目与研究专题进入。旧展览集中保留版本入口；源代码副本、构建报告和中间文件不再混入阅读目录。</p></section>'
    for group, rows in sorted(groups.items()):
        sitemap += '<details class="archive"><summary>'+escape(group)+' · '+str(len(rows))+' 个入口</summary><div class="site-local__links">'
        for row in sorted(rows, key=lambda r:r['path']):
            sitemap += '<a href="'+escape(route(row['path']), quote=True)+'">'+escape(row.get('title') or row['path'])+'</a>'
        sitemap += '</div></details>'
    sitemap += '</main></body></html>'
    sitemap, _ = transform(sitemap, 'site-map/index.html')
    (root/'site-map/index.html').write_text(personalize_html(sitemap, 'site-map/index.html'), encoding='utf-8')
    # Inspect homepage, about and global navigation targets, not source citations.
    missing = set(); checked = set()
    for rel in ('index.html', 'about.html', 'site-map/index.html'):
        for href in Links((root/rel).read_text(encoding='utf-8')).links:
            url = urlsplit(href)
            if url.scheme or url.netloc or not url.path: continue
            target = unquote(url.path).lstrip('/')
            if url.path.endswith('/'): target += 'index.html'
            if not target: target = 'index.html'
            checked.add(target)
            if not (root/target).is_file(): missing.add(target)
    manifest['identity'] = IDENTITY
    manifest['profile'] = {'name': NAME, 'email': EMAIL}
    manifest['reader_directory_entries'] = sum(map(len, groups.values()))
    manifest['identity_html_changed'] = changed
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
    summary = {'identity': IDENTITY, 'html_updated': changed, 'directory_entries': manifest['reader_directory_entries'], 'internal_targets_checked': len(checked), 'missing_internal_targets': sorted(missing), 'research_data_rewritten': False}
    print(json.dumps(summary, ensure_ascii=False), flush=True)
    if missing: raise AssertionError('Broken reader navigation: '+', '.join(sorted(missing)))
    return summary

if __name__ == '__main__':
    ap = argparse.ArgumentParser(); ap.add_argument('output', nargs='?', default='.site-build')
    apply(Path(ap.parse_args().output))
