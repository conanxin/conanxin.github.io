#!/usr/bin/env python3
"""Apply one reader shell at publish time, without rewriting source articles or data.
Run: python3 scripts/build_site.py --output .site-build
No third-party dependencies. Original inline scripts, IDs, URLs and non-HTML
assets are preserved. Historical source snapshots stay in Git history.
"""
from __future__ import annotations
import argparse
from collections import Counter, defaultdict
from dataclasses import dataclass, field
from hashlib import sha256
from html import escape
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import shutil
import subprocess
from urllib.parse import urljoin, urlsplit

VOID = set('area base br col embed hr img input link meta param source track wbr'.split())
BRAND = 'Xin Conan'
NAV = [('/', '首页'), ('/posts/', '文章'), ('/projects/', '项目'), ('/projects/shuge/', '文献研究'), ('/podcast/', '播客'), ('/about.html', '关于')]
LABELS = {'HOME':'首页','POSTS':'文章','PROJECTS':'项目','PODCAST':'播客','ABOUT':'关于',
 'RSS':'RSS 订阅','Introduction':'导读','Objects':'展品','Evidence':'证据',
 'Further Reading':'延伸阅读','Question':'研究问题','Source':'文献来源','Citation':'引用出处',
 'Interpretation Boundary':'解释边界','Further Research':'后续研究',
 'Research Portfolio':'研究档案','Peer Review Records':'模拟评审记录',
 'Projects':'项目','Workspaces':'工作区','Drafts':'草稿','Bibliography':'文献',
 'Articles':'文章','Publications':'发表流程','Portfolio':'成果档案','Review':'模拟评审',
 'Export':'导出','Field Notes':'田野笔记','Timeline':'时间线','Evidence Explorer':'证据浏览',
 'Places':'地点','Fieldwork':'田野','Research Writing':'写作','Archive':'档案'}
SPECIAL_PROJECT_PATH = 'projects/wbw-spacex-mars-cn/index.html'

CHROME_CLASSES = {'terminal-header','terminal-nav','masthead','topnav','reader-global',
 'reader-site-header','reader-footer','reader-site-nav','site-header','site-nav',
 'terminal-footer','site-footer','top','site-header-bar','header-inner','nav-inner','top-inner'}

@dataclass
class Node:
    tag: str
    attrs: dict
    start: int
    open_end: int
    parent: int | None
    raw: str
    close_start: int | None = None
    end: int | None = None
    text: list[str] = field(default_factory=list)

class Structure(HTMLParser):
    def __init__(self, html: str):
        super().__init__(convert_charrefs=False)
        self.html = html
        self.lines = [0]
        for m in re.finditer('\n', html): self.lines.append(m.end())
        self.nodes: list[Node] = []
        self.stack: list[int] = []
        self.feed(html)
        self.close()
    def at(self):
        line, col = self.getpos()
        return self.lines[line-1] + col
    def start(self, tag, attrs, closed=False):
        raw = self.get_starttag_text()
        i = len(self.nodes)
        node = Node(tag.lower(), dict(attrs), self.at(), self.at()+len(raw), self.stack[-1] if self.stack else None, raw)
        self.nodes.append(node)
        if closed or tag in VOID: node.end=node.open_end
        else: self.stack.append(i)
    def handle_starttag(self, tag, attrs): self.start(tag, attrs)
    def handle_startendtag(self, tag, attrs): self.start(tag, attrs, True)
    def handle_endtag(self, tag):
        for j in range(len(self.stack)-1, -1, -1):
            if self.nodes[self.stack[j]].tag == tag:
                n=self.nodes[self.stack[j]]
                n.close_start=self.at()
                e=self.html.find('>',self.at())
                n.end=(e+1) if e>=0 else len(self.html)
                del self.stack[j:]
                break
    def handle_data(self, value):
        for i in self.stack:
            if self.nodes[i].tag not in {'script','style'}: self.nodes[i].text.append(value)
    def handle_entityref(self,name): self.handle_data('&'+name+';')
    def handle_charref(self,name): self.handle_data('&#'+name+';')
    def ancestors(self, node):
        i=node.parent
        while i is not None:
            yield self.nodes[i]
            i=self.nodes[i].parent

def classes(n): return set((n.attrs.get('class') or '').split())
def text(n): return re.sub(r'\s+',' ',''.join(n.text)).strip()
def digest(s): return sha256(s.encode()).hexdigest()
def inline_scripts(s): return re.findall(r'<script\b[^>]*>[\s\S]*?</script\s*>',s,re.I)
def raw_controls(s): return re.findall(r'<(?:input|button|select|textarea|audio|video)\b[^>]*>',s,re.I)
def attribute(raw, name, value):
    pattern=re.compile(r'(?<![-\w])'+re.escape(name)+r'\s*=\s*(?:"[^"]*"|\x27[^\x27]*\x27|[^\s>]+)',re.I)
    new=name+'="'+escape(value,quote=True)+'"'
    if pattern.search(raw): return pattern.sub(lambda _:new,raw,count=1)
    return raw[:-1]+' '+new+'>'

def classify(path):
    if path == SPECIAL_PROJECT_PATH: return 'special'
    if '/oauth/' in '/'+path or path.startswith('connections/'): return 'utility'
    if path=='index.html': return 'home'
    if path in {'posts/index.html','projects/index.html','podcast/index.html','about.html'}: return 'listing'
    if path.startswith('posts/') or path.startswith('articles/') or '/article/' in path or '/publications/' in path: return 'article'
    return 'content'

def route(path):
    p='/' + path
    return p[:-10] if p.endswith('index.html') else p

def section_for(path):
    if path.startswith('posts/'): return ('文章', '/posts/')
    if path.startswith('podcast/'): return ('播客', '/podcast/')
    if path.startswith('projects/shuge-exhibition-'): return ('数字人文展览', '/projects/shuge-exhibition-v1.0/')
    if path.startswith('projects/shuge/'): return ('文献研究', '/projects/shuge/')
    if path.startswith('research-terminal/'): return ('研究终端', '/research-terminal/')
    if path.startswith('projects/'): return ('项目', '/projects/')
    if path=='about.html': return ('关于', '/about.html')
    return ('网站', '/')

def clean_title(title):
    title=re.sub(r'\s*[|｜]\s*(?:Xin Conan|SHUGE).*$','',title)
    return re.sub(r'\s*·\s*(?:Public Article Page|SHUGE DH|v\d).*$', '', title).strip()

def nav_header(path):
    items=[]
    for href,label in NAV:
        active=(path=='index.html' and href=='/') or (href!='/') and (
            (path=='about.html' and href=='/about.html') or
            ('/'+path).startswith(href) and not (href=='/projects/' and path.startswith('projects/shuge/')))
        items.append('<a href="'+href+'"'+(' aria-current="page"' if active else '')+'>'+label+'</a>')
    skip_target = '#main' if path == SPECIAL_PROJECT_PATH else '#site-main-start'
    return '<a class="site-skip" href="'+skip_target+'">跳到正文</a><header class="site-header"><div class="site-header__inner"><a class="site-brand" href="/">'+BRAND+'<small>研究 · 文章 · 技术实践</small></a><nav class="site-nav" aria-label="全站导航">'+''.join(items)+'</nav></div></header>'

def transform(html, path):
    parser=Structure(html)
    body=next((n for n in parser.nodes if n.tag=='body'),None)
    head=next((n for n in parser.nodes if n.tag=='head'),None)
    # Already-themed check: only the REAL body element's data-site-theme
    # attribute counts. A raw substring scan would falsely match the literal
    # text inside a <pre><code> code example (site-guide/index.html contains
    # exactly such an example, which is why a previous version of this check
    # silently skipped /site-guide/ for three consecutive CI runs).
    if body is not None and 'data-site-theme' in body.attrs:
        titles=[text(n) for n in parser.nodes if n.tag=='title']
        title=clean_title(titles[0] if titles else Path(path).stem)
        return html, {'path':path,'status':'already','title':title}
    if body is None or head is None or head.close_start is None:
        return html, {'path':path,'status':'fragment-unmodified'}
    kind=classify(path)
    titles=[text(n) for n in parser.nodes if n.tag=='title']
    title=clean_title(titles[0] if titles else Path(path).stem)
    bodyend=body.close_start if body.close_start is not None else len(html)
    main_start=next((n.start for n in parser.nodes if n.tag in {'main','article'} and n.start>body.open_end), bodyend)
    hidden=[]
    terminal=any('terminal-container' in classes(n) for n in parser.nodes)
    for n in parser.nodes:
        if n.start<body.open_end or n.end is None or n.tag in {'script','style'}: continue
        c=classes(n)
        match=(n.tag in {'header','nav','footer','div'} and bool(c & CHROME_CLASSES))
        if terminal and ('status-bar' in c or 'terminal-footer' in c): match=True
        if match and (n.end<=main_start or n.tag=='footer') and not re.search(r'<(?:button|input|select|form)\b',html[n.open_end:n.end],re.I):
            if not any(old.start<=n.start<old.end for old in hidden): hidden.append(n)
    patched: dict[int,str]={}
    for n in hidden: patched[n.start]=attribute(n.raw,'data-site-chrome','legacy')
    def is_hidden(n): return any(a.start<=n.start<a.end for a in hidden)
    h1s=[n for n in parser.nodes if n.tag=='h1' and not is_hidden(n)]
    seen=set()
    for n in h1s:
        value=text(n)
        if value and value in seen: patched[n.start]=attribute(n.raw,'data-site-chrome','duplicate-title')
        seen.add(value)
    label_by_parent={'intro-section':'简介','featured-section':'精选内容','posts-section':'文章','about-section':'关于本站','contact-section':'联系'}
    additions=[]
    for n in parser.nodes:
        if terminal and 'section-header' in classes(n):
            ancestor_classes=set().union(*(classes(a) for a in parser.ancestors(n)))
            if 'post-content' in ancestor_classes:
                patched[n.start]=attribute(n.raw,'data-site-chrome','command');continue
            label=next((v for k,v in label_by_parent.items() if k in ancestor_classes),'内容导览')
            if path=='projects/index.html': label='项目目录' if 'featured-section' in ancestor_classes else '项目简介'
            patched[n.start]=attribute(n.raw,'data-site-chrome','command')
            additions.append((n.start,'<h2 class="site-section-label">'+label+'</h2>'))
    local=[];known=set(href for href,_ in NAV)
    for n in parser.nodes:
        if n.tag!='a' or not is_hidden(n):continue
        href=n.attrs.get('href') or ''
        if not href or href.startswith(('javascript:','data:')):continue
        dest=urljoin('https://conanxin.github.io'+route(path),href)
        if dest.startswith('https://conanxin.github.io/'):
            u=urlsplit(dest);dest=u.path+('?' +u.query if u.query else '')+('#'+u.fragment if u.fragment else '')
        if dest in known:continue
        known.add(dest)
        label=text(n)
        if not label:continue
        label=LABELS.get(label,label)
        local.append('<a href="'+escape(dest,quote=True)+'">'+escape(label)+'</a>')
    family,parent=section_for(path)
    crumbs='' if kind=='home' else '<div class="site-breadcrumb"><span><a href="/">首页</a> / <a href="'+parent+'">'+family+'</a></span>'+('<details class="site-local"><summary>本页相关导航</summary><nav class="site-local__links" aria-label="本页相关导航">'+''.join(local)+'</nav></details>' if local else '')+'</div>'
    heading=''
    if kind not in {'home','utility'} and not h1s:
        friendly={'posts/index.html':'文章与阅读','projects/index.html':'项目与实践','podcast/index.html':'播客与声音','about.html':'关于 Xin Conan'}
        heading='<div class="site-heading"><h1>'+escape(friendly.get(path,title))+'</h1></div>'
    history=''
    if re.match(r'projects/shuge-exhibition-v0\.',path):
        history='<p class="site-snapshot-note">历史展览版本：保留原阶段内容与数据。<a href="/projects/shuge-exhibition-v1.0/">查看当前展览</a></p>'
    anchor='' if kind=='special' else '<div id="site-main-start" tabindex="-1"></div>'
    top=nav_header(path)+crumbs+anchor+heading+history
    if kind=='utility':top+='<div class="site-utility-body">'
    footer=('<div class="site-footer"><div class="site-footer__inner"><span>Xin Conan · 记录思考与实验</span><div class="site-footer__links">'
      '<a href="/site-map/">站点目录</a><a href="/feed.xml">RSS 订阅</a><a href="mailto:hello@xin-conan.me">联系</a><a href="https://github.com/conanxin/conanxin.github.io">GitHub</a></div></div></div>')
    if kind=='utility':footer='</div>'+footer
    # The SpaceX long-form reader owns its theme, layout and reading modes.
    # Keep the shared brand chrome and identity, but avoid site-unified's
    # !important overrides of the project's dark/light CSS variables.
    raw=body.raw
    if kind!='special':
        raw=attribute(raw,'class',((body.attrs.get('class') or '')+' site-unified').strip())
    raw=attribute(raw,'data-site-kind',kind)
    raw=attribute(raw,'data-site-theme','project-native' if kind=='special' else 'unified-v1')
    patched[body.start]=raw
    extras='<link rel="stylesheet" href="/assets/site/design.css">'
    if not any(n.tag=='meta' and n.attrs.get('name')=='viewport' for n in parser.nodes):extras+='<meta name="viewport" content="width=device-width,initial-scale=1">'
    additions.extend([(head.close_start,extras),(body.open_end,top),(bodyend,footer)])
    for n in parser.nodes:
        if kind=='special' or n.tag!='table' or n.end is None:continue
        if any(a.tag=='table' for a in parser.ancestors(n)):continue
        ancestors=list(parser.ancestors(n))
        if any('overflow' in (a.attrs.get('style') or '') or classes(a)&{'table-wrap','tablebox','data-table-wrapper','site-table-scroll'} for a in ancestors):continue
        additions.extend([(n.start,'<div class="site-table-scroll" role="region" aria-label="可横向滚动的数据表" tabindex="0">'),(n.end,'</div>')])
    edits=[(n.start,n.open_end,patched[n.start]) for n in parser.nodes if n.start in patched]
    edits.extend((p,p,s) for p,s in additions)
    out=html
    for start,end,part in sorted(edits,key=lambda e:(e[0],e[1]),reverse=True):out=out[:start]+part+out[end:]
    assert inline_scripts(out)==inline_scripts(html),f'Inline script modified: {path}'
    assert raw_controls(out)==raw_controls(html),f'Functional control modified: {path}'
    before=Counter(n.attrs['id'] for n in parser.nodes if n.attrs.get('id'))
    after=Counter(n.attrs['id'] for n in Structure(out).nodes if n.attrs.get('id'))
    assert all(after[i]>=v for i,v in before.items()),f'An original ID was lost: {path}'
    return out,{'path':path,'title':title,'kind':kind,'status':'themed','old_script_count':len(inline_scripts(html)),'scripts_unchanged':True,'controls_unchanged':True,'original_id_count':sum(before.values()),'hidden_chrome':len(hidden)}

def get_files(root):
    try:
        listed=subprocess.check_output(['git','ls-files','-z'],cwd=root,stderr=subprocess.DEVNULL).decode().split('\0')
        return [root/p for p in listed if p and (root/p).is_file()]
    except (subprocess.SubprocessError,FileNotFoundError):return [p for p in root.rglob('*') if p.is_file()]

def build(root,output):
    root=root.resolve();output=output.resolve()
    if output==root or root not in output.parents:raise ValueError('Output must be a child directory of source')
    if output.exists():raise FileExistsError('Use a new output directory; source files are never overwritten')
    files=get_files(root);output.mkdir(parents=True)
    records=[];assets=0
    for p in files:
        rel=p.relative_to(root)
        if p.is_symlink() or any(x in {'.git','.github','.cursor','.site-build','node_modules','__pycache__','templates'} for x in rel.parts) or output in p.parents:continue
        if rel.as_posix() in {'scripts/build_site.py','scripts/verify_site_browser.py'}:continue
        dest=output/rel
        if not output.exists(): output.mkdir(parents=True, exist_ok=True)
        dest.parent.mkdir(parents=True, exist_ok=True)
        if p.suffix.lower() in {'.html','.htm'} and not any(x.startswith('_') for x in rel.parts):
            html=p.read_text(encoding='utf-8')
            content,record=transform(html,rel.as_posix())
            dest.write_text(content,encoding='utf-8');records.append(record)
        else:shutil.copyfile(p,dest);assets+=1
    groups=defaultdict(list)
    for r in records:
        if r['status']=='themed':groups[section_for(r['path'])[0]].append(r)
    sitemap='<html lang="zh-CN"><head><meta charset="utf-8"><title>站点目录 | Xin Conan</title></head><body><main class="site-home"><section class="home-hero"><h1>站点目录</h1><p>按栏目查找文章、项目、播客与历史研究资料。历史展览版本保留在各自路径中。</p></section>'
    for g,rs in sorted(groups.items()):
        sitemap+='<details class="archive"><summary>'+escape(g)+' · '+str(len(rs))+' 个页面</summary><div class="site-local__links">'
        for r in sorted(rs,key=lambda r:r['path']):sitemap+='<a href="'+escape(route(r['path']),quote=True)+'">'+escape(r['title'] or r['path'])+'</a>'
        sitemap+='</div></details>'
    sitemap+='</main></body></html>'
    (output/'site-map').mkdir(exist_ok=True)
    site_map,_=transform(sitemap,'site-map/index.html');(output/'site-map/index.html').write_text(site_map,encoding='utf-8')
    counts=Counter(r['status'] for r in records)
    report={'theme':'unified-v1','html_scanned':len(records),'html_themed':counts['themed'],'fragments_unchanged':counts['fragment-unmodified'],'assets_copied_unchanged':assets,'by_section':dict(Counter(section_for(r['path'])[0] for r in records if r['status']=='themed')),'script_preservation':'PASS','control_preservation':'PASS','source_content_rewritten':False,'pages':records}
    m=output/'assets/site/style-manifest.json';m.parent.mkdir(parents=True,exist_ok=True)
    m.write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps({k:v for k,v in report.items() if k!='pages'},ensure_ascii=False))
    return report

if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('--source',default='.');ap.add_argument('--output',default='.site-build')
    args=ap.parse_args();build(Path(args.source),Path(args.output))
