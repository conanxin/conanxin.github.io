#!/usr/bin/env python3
"""build_handbook.py -- Du Fu Route Travel Handbook Generator"""
import json, html as htmlmod, os, sys
from datetime import datetime
from pathlib import Path

try:
    import weasyprint; WEASY = True
except ImportError:
    WEASY = False

BASE    = Path(__file__).resolve().parent
PROOT   = BASE.parent
DDIR    = PROOT / 'data'
EDIR    = PROOT / 'exports'
EDIR.mkdir(exist_ok=True)
MDFILE  = EDIR / 'dufu_route_handbook.md'
HTMLFILE= EDIR / 'dufu_route_handbook.html'
PDFFILE = EDIR / 'dufu_route_handbook.pdf'

# Unicode escapes for strings containing curly quotes
TITLE   = '\u4e71\u79bb\u9014\u4e2d\uff0c\u675c\u752b\u4f55\u4ee5\u6210\u4e3a\u201c\u675c\u752b\u201d\uff1f'
SUBTITLE= '\u675c\u752b\u8bd7\u8def\u4e0e\u6587\u65c5\u8def\u7ebf\u624b\u518c'
SRC     = '\u300a\u4e09\u8054\u751f\u6d3b\u5468\u520a\u300b2025\u5e74\u7b2c40\u671f'

def load_json(name):
    with open(DDIR / name, encoding='utf-8') as f:
        return json.load(f)

LOCs    = load_json('locations.json')
POEMS   = load_json('poems.json')
TIMELINE= load_json('timeline.json')
ROUTES  = load_json('routes.json')

META  = ROUTES.get('meta', {})
ROUTE = ROUTES.get('routes', {})

STAGE_ORDER = [
    '\u957f\u5b89\u5949\u5148','\u5b89\u53f2\u9003\u4ea1','\u6ca7\u9677\u957f\u5b89','\u51e4\u7fd4\u7f8c\u6751',
    '\u4e09\u5408\u4e09\u522b','\u79e6\u5dde\u540c\u8c37','\u9647\u5c4b\u5165\u5c4b','\u6210\u90fd\u8349\u5802'
]

STAGE_DESC = {
    '\u957f\u5b89\u5949\u5148':'\u4ece\u957f\u5b89\u56f0\u5b88\u5230\u5949\u5148\u63a2\u5bb6\uff0c\u675c\u752b\u5f00\u59cb\u628a\u4e2a\u4eba\u8d2f\u56f0\u3001\u5bb6\u5ead\u9965\u5bd2\u4e0e\u56fd\u5bb6\u5371\u673a\u5199\u5165\u540c\u4e00\u9996\u8bd7\u3002',
    '\u5b89\u53f2\u9003\u4ea1':'\u5b89\u53f2\u4e4b\u4e71\u7206\u53d1\u540e\uff0c\u675c\u752b\u633d\u5bb6\u9003\u96be\uff0c\u8bd7\u6b4c\u8fdb\u5165\u9965\u997f\u3001\u6ce5\u6d41\u3001\u6050\u60e7\u4e0e\u7236\u4eb2\u7ecf\u9a8c\u3002',
    '\u6ca7\u9677\u957f\u5b89':'\u957f\u5b89\u9677\u843d\u540e\uff0c\u675c\u752b\u5728\u5e9f\u90fd\u4e2d\u4e66\u5199\u56fd\u7834\u3001\u5bab\u82d1\u8352\u51c9\u3001\u6218\u573a\u60e8\u6b8b\u4e0e\u4eb2\u4eba\u79bb\u6563\u3002',
    '\u51e4\u7fd4\u7f8c\u6751':'\u4ece\u51e4\u7fd4\u884c\u5728\u5230\u7f8c\u6751\u63a2\u5bb6\uff0c\u675c\u752b\u77ed\u6682\u8fdb\u5165\u671d\u5ef7\uff0c\u53c8\u5728\u5bb6\u5ead\u91cd\u9023\u4e2d\u611f\u53d7\u4e71\u4e16\u4f59\u9707\u3002',
    '\u4e09\u5408\u4e09\u522b':'\u666e\u901a\u767e\u59d3\u6210\u4e3a\u8bd7\u6b4c\u4e2d\u5fc3\uff0c\u5f81\u5175\u3001\u6293\u4e01\u3001\u65b0\u5a5a\u522b\u79bb\u4e0e\u65e0\u5bb6\u53ef\u5f52\u5171\u540c\u6784\u6210\u675c\u752b\u7684\u8bd7\u53f2\u73b0\u573a\u3002',
    '\u79e6\u5dde\u540c\u8c37':'\u4ece\u534e\u5dde\u5931\u610f\u5230\u79e6\u5dde\u6c42\u5c45\u3001\u540c\u8c37\u56f0\u987e\uff0c\u675c\u752b\u5f00\u59cb\u4ece\u5eb7\u5802\u7406\u60f3\u8d70\u5411\u8349\u5802\u4eba\u751f\u3002',
    '\u9647\u5c4b\u5165\u5c4b':'\u5728\u6728\u76ae\u5c71\u3001\u767d\u6c99\u6e21\u3001\u6c34\u4f1a\u6e21\u3001\u4e94\u76d8\u3001\u5251\u95e8\u4e4b\u95f4\uff0c\u5c71\u6c34\u4e0d\u518d\u53ea\u662f\u98ce\u666f\uff0c\u800c\u662f\u9003\u96be\u4e0e\u6c42\u751f\u4e4b\u8def\u3002',
    '\u6210\u90fd\u8349\u5802':'\u6210\u90fd\u8349\u5802\u5e26\u6765\u9636\u6bb5\u6027\u5b89\u987e\uff0c\u4f46\u675c\u752b\u7684\u5fe7\u56fd\u3001\u8d2f\u75c5\u4e0e\u5e7f\u5c4b\u4e4b\u613f\u4ecd\u5728\u7ee7\u7eed\u3002',
}

STAGE_MAP = {
    'fengxian':'\u957f\u5b89\u5949\u5148','changan':'\u957f\u5b89\u5949\u5148','lianling':'\u957f\u5b89\u5949\u5148',
    'baishui':'\u5b89\u53f2\u9003\u4ea1','pengxia':'\u5b89\u53f2\u9003\u4ea1',
    'lingwu':'\u6ca7\u9677\u957f\u5b89',
    'fengxiang':'\u51e4\u7fd4\u7f8c\u6751','qiangcun':'\u51e4\u7fd4\u7f8c\u6751','fuxian':'\u51e4\u7fd4\u7f8c\u6751',
    'xinan':'\u4e09\u5408\u4e09\u522b','shihao':'\u4e09\u5408\u4e09\u522b','tongguan':'\u4e09\u5408\u4e09\u522b','luoyang':'\u4e09\u5408\u4e09\u522b',
    'huazhou':'\u79e6\u5dde\u540c\u8c37','qinzhou':'\u79e6\u5dde\u540c\u8c37','dongke':'\u79e6\u5dde\u540c\u8c37',
    'guozhi':'\u79e6\u5dde\u540c\u8c37','tonggu':'\u79e6\u5dde\u540c\u8c37',
    'guangyuan':'\u9647\u5c4b\u5165\u5c4b','jianmenguan':'\u9647\u5c4b\u5165\u5c4b',
    'chengdu':'\u6210\u90fd\u8349\u5802',
}

def stage_of(poem):
    return STAGE_MAP.get(poem.get('locationId','') or '', '\u5176\u4ed6')

def he(s):
    if s is None: return ''
    return htmlmod.escape(str(s), quote=True).replace('\n','<br>')

def md_h1(s): return f'# {s}\n\n'
def md_h2(s): return f'## {s}\n\n'
def md_h3(s): return f'### {s}\n\n'
def md_p(s):  return f'{s}\n\n'
def md_field(k,v): return f'**{k}** {v}\n\n'
def md_hr(): return '---\n\n'
def md_li(s): return f'- {s}\n'

def build_md():
    now = datetime.now().strftime('%Y-%m-%d %H:%M')
    out = []; a = out.append
    a(md_h1(TITLE))
    a(f'*{SUBTITLE}*\n\n')
    a(f'*生成时间：{now} \xb7 基于{SRC}*\n\n')
    a(md_hr())
    # 1
    a(md_h2('1. \u8fd9\u672c\u624b\u518c\u662f\u4ec0\u4e48'))
    a(md_p('\u8fd9\u662f\u57fa\u4e8e\u675c\u752b\u8bd7\u8def\u4e92\u52a8\u9875\u9762\u4e0e data/*.json \u6570\u636e\u751f\u6210\u7684\u65c5\u884c\u9605\u8bfb\u624b\u518c\uff0c'
           '\u7ed3\u5408\u6587\u7ae0\u89e3\u8bfb\u3001\u675c\u752b\u8def\u7ebf\u3001\u4eca\u65e5\u5730\u70b9\u3001\u8bd7\u6b4c\u6620\u5c04\u548c\u6587\u65c5\u8def\u7ebf\u3002\u53ef\u6253\u5370\u3001\u53ef\u4fdd\u5b58\uff0c\u4e0d\u4f9d\u8d1f\u7f51\u7edc\u3002'))
    # 2
    a(md_h2('2. \u6587\u7ae0\u4e3b\u65e8\u6458\u8981'))
    a(md_p('\u8fd9\u7bc7\u6587\u7ae0\u8ffd\u95ee\u7684\u4e0d\u662f\u201c\u675c\u752b\u4e3a\u4ec0\u4e48\u4f1f\u5927\u201d\uff0c\u800c\u662f\u201c\u675c\u752b\u5982\u4f55\u5728\u4e71\u79bb\u9014\u4e2d\u4e00\u6b65\u6b65\u6210\u4e3a\u540e\u6765\u610f\u4e49\u4e0a\u7684\u675c\u752b\u201d\u3002'
           '\u5b89\u53f2\u4e4b\u4e71\u4e0d\u662f\u675c\u752b\u8bd7\u6b4c\u7684\u80cc\u666f\uff0c\u800c\u662f\u5851\u9020\u675c\u752b\u8bd7\u6b4c\u7684\u51b3\u5b9a\u6027\u73b0\u573a\u3002'))
    a(md_p('\u675c\u752b\u5728\u9003\u4ea1\u3001\u9677\u8bc3\u3001\u6c42\u5b98\u3001\u88ab\u8d25\u3001\u6d41\u5f90\u3001\u76ee\u7779\u6c11\u95f4\u82e6\u96be\u7684\u8fc7\u7a0b\u4e2d\uff0c'
           '\u628a\u4e2a\u4eba\u751f\u547d\u3001\u5bb6\u5ead\u75db\u82e6\u3001\u56fd\u5bb6\u5d29\u574f\u548c\u666e\u901a\u767e\u59d3\u7684\u547d\u8fd0\u5199\u8fdb\u8bd7\u6b4c\uff0c'
           '\u4ece\u800c\u7a81\u7834\u76ee\u5510\u8bd7\u6b4c\u539f\u6709\u5ba1\u7f8e\u8fb9\u754c\u3002'))
    # 3
    a(md_h2('3. \u675c\u752b\u8def\u7ebf\u603b\u89c8'))
    a(md_p('\u4ee5\u4e0b\u65f6\u95f4\u7ebf\u6d89\u53ca\u675c\u752b\u4ece 755 \u5e74\uff08\u957f\u5b89\uff09\u5230 760 \u5e74\uff08\u6210\u90fd\u8349\u5802\uff09\u7684\u5173\u952e\u8282\u70b9\uff0c\u5171 9 \u4e2a\u9636\u6bb5\u3002\n'))
    for n in TIMELINE:
        a(md_h3(f"{n.get('year','')} \xb7 {n.get('title','')}"))
        a(md_field('\u5386\u53f2\u5730\u70b9', n.get('historicalPlace','')))
        a(md_field('\u4eca\u65e5\u5730\u70b9', n.get('modernPlace','')))
        if n.get('poems'): a(md_field('\u76f8\u5173\u8bd7\u6b4c', n.get('poems','')))
        a(md_field('\u4e3a\u4ec0\u4e48\u91cd\u8981', n.get('whyImportant','')))
    # 4 - 7-day
    m7 = META.get('7day',{})
    a(md_h2('4. 7 \u5929\u7cbe\u534e\u7ebf'))
    a(md_p(f"**{m7.get('routeName','')}**  \xb7  {m7.get('days','')}\n"))
    for k,fl in [('season','\u9002\u5408\u5b63\u8282'),('transport','\u4ea4\u901a\u65b9\u5f0f'),('difficulty','\u8def\u7ebf\u96be\u5ea6'),('crowd','\u63a8\u8350\u4eba\u7fa4'),('nature','\u8def\u7ebf\u6027\u8d28')]:
        if m7.get(k): a(md_field(fl, m7.get(k,'')))
    for d in ROUTE.get('7day',[]):
        a(md_h3(f"Day {d.get('day','')} \xb7 {d.get('title','')}"))
        for fk,fl in [('theme','\u4eca\u65e5\u4e3b\u9898'),('places','\u4eca\u65e5\u5730\u70b9'),('stay','\u63a8\u8350\u505c\u7559'),('transportTip','\u4ea4\u901a\u63d0\u793a'),('poems','\u4eca\u65e5\u8bd7\u6b4c'),('tip','\u65c5\u884c\u63d0\u793a'),('liveQuestion','\u73b0\u573a\u95ee\u9898')]:
            if d.get(fk): a(md_field(fl, d.get(fk,'')))
    # 5 - 12-day
    m12 = META.get('12day',{})
    a(md_h2('5. 12 \u5929\u5b8c\u6574\u7ebf'))
    a(md_p(f"**{m12.get('routeName','')}**  \xb7  {m12.get('days','')}\n"))
    for k,fl in [('season','\u9002\u5408\u5b63\u8282'),('transport','\u4ea4\u901a\u65b9\u5f0f'),('difficulty','\u8def\u7ebf\u96be\u5ea6'),('crowd','\u63a8\u8350\u4eba\u7fa4'),('nature','\u8def\u7ebf\u6027\u8d28')]:
        if m12.get(k): a(md_field(fl, m12.get(k,'')))
    for d in ROUTE.get('12day',[]):
        a(md_h3(f"Day {d.get('day','')} \xb7 {d.get('title','')}"))
        for fk,fl in [('theme','\u4eca\u65e5\u4e3b\u9898'),('places','\u4eca\u65e5\u5730\u70b9'),('stay','\u63a8\u8350\u505c\u7559'),('transportTip','\u4ea4\u901a\u63d0\u793a'),('poems','\u4eca\u65e5\u8bd7\u6b4c'),('tip','\u65c5\u884c\u63d0\u793a'),('liveQuestion','\u73b0\u573a\u95ee\u9898')]:
            if d.get(fk): a(md_field(fl, d.get(fk,'')))
    # 6 - thematic
    thematic_ids = ['thematic-changan','thematic-anshi','thematic-sanli','thematic-qinzhou']
    thematic_by_id = {r['id']:r for r in ROUTE.get('thematic',[])}
    a(md_h2('6. \u4e3b\u9898\u77ed\u7ebf'))
    for tid in thematic_ids:
        tm = META.get(tid,{}); tr = thematic_by_id.get(tid.replace('thematic-',''),{})
        a(md_h3(tm.get('routeName','')))
        for k,fl in [('nature','\u4e3b\u9898'),('days','\u5929\u6570'),('crowd','\u9002\u5408\u4eba\u7fa4'),('season','\u63a8\u8350\u5b63\u8282'),('transport','\u4ea4\u901a\u65b9\u5f0f'),('difficulty','\u8def\u7ebf\u96be\u5ea6'),('note','\u51fa\u884c\u63d0\u9192')]:
            if tm.get(k): a(md_field(fl, tm.get(k,'')))
        if tr:
            a(md_field('\u63a8\u8350\u8def\u7ebf', ' \u2192 '.join(tr.get('route',[]))))
            a(md_field('\u8bfb\u8bd7', tr.get('poems','')))
            a(md_field('\u65c5\u884c\u770b\u70b9', tr.get('tip','')))
    # 7 - dual-city
    for dkey in ['dual-city','dualCity','dual_city']:
        dual = META.get(dkey,{}); 
        if dual: break
    if dual:
        a(md_h2('7. \u897f\u5b89 + \u6210\u90fd\u53cc\u57ce\u8bfb\u8bd7\u7ebf'))
        for k,fl in [('routeName','\u8def\u7ebf\u540d\u79f0'),('days','\u63a8\u8350\u5929\u6570'),('crowd','\u9002\u5408\u4eba\u7fa4'),('season','\u63a8\u8350\u5b63\u8282'),('transport','\u4ea4\u901a\u65b9\u5f0f'),('difficulty','\u8def\u7ebf\u96be\u5ea6'),('nature','\u8def\u7ebf\u6027\u8d28'),('note','\u7279\u522b\u8bf4\u660e')]:
            if dual.get(k): a(md_field(fl, dual.get(k,'')))
        a(md_p('\u300a\u897f\u5b89\u770b\u70b9\uff1a\u300b\u5927\u660e\u5bab\u9057\u5740\u516c\u56ed\u3001\u534e\u6e05\u5bab\u3001\u9a91\u5c71\u3001\u9655\u897f\u5386\u53f2\u535a\u7269\u9662\u3002\u53ef\u7ed3\u5408\u300a\u5175\u8f66\u884c\u300b\u300a\u4e3d\u4eba\u884c\u300b\u300a\u81ea\u4eac\u8d74\u5949\u5148\u53bf\u8bf5\u6000\u4e94\u767e\u5b57\u300b\u9605\u8bfb\u3002'))
        a(md_p('\u300a\u6210\u90fd\u770b\u70b9\uff1a\u300b\u675c\u752b\u8349\u5802\u3001\u9526\u6c5f\u3001\u897f\u5cd9\u96ea\u5c71\u3002\u53ef\u7ed3\u5408\u300a\u6625\u591c\u559c\u96e8\u300b\u300a\u8305\u5c4b\u4e3a\u79cb\u98ce\u6240\u7834\u6b4c\u300b\u300a\u7edd\u53e5\u300b\u9605\u8bfb\u3002'))
    # 8 - by location
    a(md_h2('8. \u6309\u5730\u70b9\u8bfb\u8bd7'))
    for loc in LOCs:
        a(md_h3(f"{loc.get('name','')}（{loc.get('modern','')}）"))
        a(md_field('\u5730\u70b9\u7c7b\u578b', loc.get('siteType','')))
        a(md_field('\u4eca\u65e5\u5730\u70b9', loc.get('modern','')))
        if loc.get('theme'): a(md_field('\u5730\u70b9\u4e3b\u9898', loc.get('theme','')))
        a(md_field('\u6587\u7ae0\u610f\u4e49', loc.get('articleMeaning','')))
        if loc.get('poems'): a(md_field('\u76f8\u5173\u8bd7\u6b4c', loc.get('poems','')))
        if loc.get('quote'): a(md_p('> ' + (loc.get('quote') or '')))
        if loc.get('travelTip'): a(md_field('\u65c5\u884c\u63d0\u793a', loc.get('travelTip','')))
    # 9 - by stage
    a(md_h2('9. \u6309\u9636\u6bb5\u8bfb\u8bd7'))
    by_stage = {s:[] for s in STAGE_ORDER}
    for p in POEMS:
        s = stage_of(p)
        if s in by_stage: by_stage[s].append(p)
    for stage in STAGE_ORDER:
        ps = by_stage[stage]
        if not ps: continue
        desc = STAGE_DESC.get(stage,'')
        a(md_h3(f'{stage}（{len(ps)} \u9996\uff09'))
        if desc: a(md_p(desc))
        for p in ps:
            a(f"**{p.get('title','')}**\n\n")
            a(f"\U0001f4dd {p.get('locationName','')}  |  {p.get('period','')}  |  {p.get('theme','')}\n\n")
            if p.get('quote'): a(md_p('> ' + (p.get('quote') or '')))
            if p.get('note'): a(md_p(p.get('note','')))
    # 10 - tips
    a(md_h2('10. \u65c5\u884c\u5b9e\u7528\u63d0\u9192'))
    tips = [
        ('\u4ea4\u901a','\u5b8c\u6574\u7ebf\u8de8\u9655\u897f\u3001\u6cb3\u5357\u3001\u7518\u8083\u3001\u56db\u5ddd\uff0c\u5efa\u8bae\u5206\u6bb5\u6216\u81ea\u9a7e/\u5305\u8f66\u7ed3\u5408\u9ad8\u94c1\u3002'),
        ('\u5b63\u8282','\u6625\u79cb\u4f18\u5148\uff1b\u590f\u5b63\u6ce8\u610f\u9ad8\u6e29\uff1b\u51ac\u5b63\u6ce8\u610f\u5c71\u533a\u5929\u6c14\u4e0e\u4f53\u529b\u3002'),
        ('\u4f53\u529b','\u79e6\u5dde\u2014\u540c\u8c37\u2014\u5251\u95e8\u6bb5\u5730\u5f62\u590d\u6742\uff0c\u5efa\u8bae\u7559\u5f39\u6027\u65f6\u95f4\u3002'),
        ('\u9605\u8bfb','\u6bcf\u9a7c\u7cbe\u8bfb\u4e00\u4e24\u9996\u8bd7\u5373\u53ef\uff0c\u4e0d\u5fc5\u628a\u65c5\u884c\u53d8\u6210\u80cc\u8bf5\u6e05\u5355\u3002'),
        ('\u73b0\u573a','\u5f88\u591a\u5730\u70b9\u4e0d\u662f\u6807\u51c6\u666f\u533a\uff0c\u91cd\u8981\u7684\u662f\u628a\u8bd7\u53e5\u3001\u5730\u5f62\u3001\u5386\u53f2\u4e8b\u4ef6\u53e0\u5728\u4e00\u8d77\u7406\u89e3\u3002'),
        ('\u6839\u5b9e','\u5f00\u653e\u65f6\u95f4\u3001\u4ea4\u901a\u3001\u4f4f\u5bbf\u3001\u666f\u533a\u653f\u7b56\u3001\u9053\u8def\u60c5\u51b5\u51fa\u53d1\u524d\u9700\u91cd\u65b0\u786e\u8ba4\u3002'),
    ]
    for k,v in tips: a(md_li(f"**{k}\uff1a**{v}"))
    a('\n')
    # 11 - disclaimer
    a(md_h2('11. \u6765\u6e90\u4e0e\u8fb9\u754c\u8bf4\u660e'))
    a(md_p(f'\u672c\u624b\u518c\u57fa\u4e8e{SRC}\u5c01\u9762\u6545\u4e8b\u300a\u4e71\u79bb\u9014\u4e2d\uff0c\u675c\u752b\u4f55\u4ee5\u6210\u4e3a\u201c\u675c\u752b\u201d\uff1f\u300b\u7684\u9605\u8bfb\u68c0\u7406\u3001\u8def\u7ebf\u91cd\u6784\u4e0e\u6587\u65c5\u8def\u7ebf\u8bbe\u8ba1\uff0c\u4e0d\u8f6c\u8f7d\u539f\u6587\u3002'))
    a(md_p('\u9875\u9762\u4e0e\u624b\u518c\u5f15\u7528\u675c\u752b\u8bd7\u53e5\u4ec5\u4f5c\u5bfc\u89c8\u3001\u8d4f\u6790\u4e0e\u5730\u70b9\u5173\u8054\u4f7f\u7528\u3002'))
    a(md_p('\u5510\u4ee3\u5730\u540d\u4e0e\u4eca\u65e5\u5730\u70b9\u5b58\u5728\u4e0d\u540c\u7a0b\u5ea6\u7684\u8003\u8bc1\u5dee\u5f02\u3002'))
    a(md_p('\u6587\u65c5\u8def\u7ebf\u4e3a\u6587\u5316\u65c5\u884c\u89c4\u5212\u5efa\u8bae\uff0c\u4e0d\u5305\u542b\u5b9e\u65f6\u4ea4\u901a\u3001\u7968\u4ef7\u3001\u5f00\u653e\u65f6\u95f4\u6216\u4f4f\u5bbf\u4fe1\u606f\u3002'))
    a(md_p('\u90e8\u5206\u5730\u70b9\u5c5e\u4e8e\u6587\u5b66\u5bfb\u8bbf\u70b9\u6216\u5386\u53f2\u5bf9\u5e94\u70b9\uff0c\u4e0d\u4e00\u5b9a\u662f\u6210\u719f\u666f\u533a\u3002'))
    a(f'\n*生成时间\uff1a{now} \xb7 https://conanxin.github.io/projects/dufu-luanli-route/ *\n')
    return ''.join(out)

CSS = """
*,*::before,*::after{box-sizing:border-box}
body{font-family:-apple-system,"Noto Serif CJK SC","Source Han Serif CN",STSong,SimSun,serif;font-size:16px;line-height:1.8;color:#1a1a1a;background:#fff;max-width:900px;margin:0 auto;padding:2rem 1.5rem 4rem}
h1{font-size:1.9rem;font-weight:700;margin:0 0 .5rem;color:#111}
h2{font-size:1.3rem;font-weight:700;margin:2.5rem 0 .75rem;border-bottom:2px solid #8B4513;padding-bottom:.3rem;color:#111}
h3{font-size:1.05rem;font-weight:700;margin:1.6rem 0 .4rem;color:#333}
.subtitle{font-size:1.05rem;color:#5a3e2b;margin:.3rem 0 1rem}
.meta-line{font-size:.82rem;color:#888;margin-bottom:1.5rem}
hr{border:none;border-top:1px solid #ddd;margin:2rem 0}
p{margin:.5rem 0}
strong{font-weight:700}
blockquote{border-left:3px solid #8B4513;margin:.7rem 0 .7rem 1rem;padding:.15rem .6rem;color:#5a3e2b;font-style:italic}
.day-block{border:1px solid #d5c8b5;border-radius:6px;padding:.9rem 1.1rem;margin:.9rem 0;background:#fdfcfa}
.day-block h3{margin-top:0}
.field{margin:.28rem 0;font-size:.9rem}
.field-label{font-weight:700;color:#5a3e2b;margin-right:.3rem}
.poem-block{background:#faf8f4;border:1px solid #e0d5c5;border-radius:4px;padding:.7rem 1rem;margin:.7rem 0}
.poem-loc{font-size:.83rem;color:#7a5a3a}
.poem-quote{color:#8B4513;font-style:italic}
.poem-note{font-size:.87rem;color:#555}
.route-meta{background:#f4f1eb;border:1px solid #ddd5c5;border-radius:4px;padding:.55rem 1rem;margin:.5rem 0 1rem;font-size:.88rem}
.toc{background:#f5f2ec;border:1px solid #ddd5c5;border-radius:6px;padding:.9rem 1.4rem;margin:1.2rem 0;font-size:.88rem}
.toc-item{margin:.28rem 0}
.toc-item a{color:#8B4513;text-decoration:none}
.toc-item a:hover{text-decoration:underline}
.tips-block{background:#f0ece4;border-radius:4px;padding:.7rem 1rem;margin:.8rem 0}
.tips-block ul{margin:.4rem 0;padding-left:1.3rem}
.tips-block li{font-size:.9rem;margin:.25rem 0}
.print-note{font-size:.73rem;color:#999;margin-top:3rem;border-top:1px solid #eee;padding-top:.5rem}
@media print{body{max-width:100%;padding:1rem}}
"""

def build_html():
    now = datetime.now().strftime('%Y-%m-%d %H:%M')
    B = []; a = B.append
    toc_items = [
        ('sec1','1. \u8fd9\u672c\u624b\u518c\u662f\u4ec0\u4e48'),('sec2','2. \u6587\u7ae0\u4e3b\u65e8\u6458\u8981'),
        ('sec3','3. \u675c\u752b\u8def\u7ebf\u603b\u89c8'),('sec4','4. 7 \u5929\u7cbe\u534e\u7ebf'),
        ('sec5','5. 12 \u5929\u5b8c\u6574\u7ebf'),('sec6','6. \u4e3b\u9898\u77ed\u7ebf'),
        ('sec7','7. \u897f\u5b89+\u6210\u90fd\u53cc\u57ce\u8bfb\u8bd7\u7ebf'),('sec8','8. \u6309\u5730\u70b9\u8bfb\u8bd7'),
        ('sec9','9. \u6309\u9636\u6bb5\u8bfb\u8bd7'),('sec10','10. \u65c5\u884c\u5b9e\u7528\u63d0\u9192'),
        ('sec11','11. \u6765\u6e90\u4e0e\u8fb9\u754c\u8bf4\u660e'),
    ]
    toc_rows = [f'<div class=toc-item><a href=#{sid}>{he(lbl)}</a></div>' for sid,lbl in toc_items]
    toc_html = '<div class=toc><strong>\u76ee\u5f55</strong>'+''.join(toc_rows)+'</div>\n'

    a('<!DOCTYPE html>\n<html lang=zh-CN>\n<head>\n<meta charset=UTF-8>\n<meta name=viewport content="width=device-width,initial-scale=1">\n')
    a(f'<title>{he(TITLE)} \u2014 \u675c\u752b\u8bd7\u8def\u6587\u65c5\u624b\u518c</title>\n')
    a('<style>\n'+CSS+'\n</style>\n</head>\n<body>\n')
    a(toc_html)
    a(f'<h1>{he(TITLE)}</h1>\n<p class=subtitle><em>{he(SUBTITLE)}</em></p>\n')
    a(f'<p class=meta-line>\u751f\u6210\u65f6\u95f4\uff1a{he(now)} \xb7 \u57fa\u4e8e{he(SRC)}</p>\n<hr>\n')

    # sec1
    a('<h2 id=sec1>1. \u8fd9\u672c\u624b\u518c\u662f\u4ec0\u4e48</h2>\n')
    a('<p>\u8fd9\u662f\u57fa\u4e8e\u675c\u752b\u8bd7\u8def\u4e92\u52a8\u9875\u9762\u4e0e data/*.json \u6570\u636e\u751f\u6210\u7684\u65c5\u884c\u9605\u8bfb\u624b\u518c\uff0c'
      '\u7ed3\u5408\u6587\u7ae0\u89e3\u8bfb\u3001\u675c\u752b\u8def\u7ebf\u3001\u4eca\u65e5\u5730\u70b9\u3001\u8bd7\u6b4c\u6620\u5c04\u548c\u6587\u65c5\u8def\u7ebf\u3002\u53ef\u6253\u5370\u3001\u53ef\u4fdd\u5b58\uff0c'
      '\u4e0d\u4f9d\u8d1f\u7f51\u7edc\u3002</p>\n<hr>\n')

    # sec2
    a('<h2 id=sec2>2. \u6587\u7ae0\u4e3b\u65e8\u6458\u8981</h2>\n')
    a('<p>\u8fd9\u7bc7\u6587\u7ae0\u8ffd\u95ee\u7684\u4e0d\u662f\u201c\u675c\u752b\u4e3a\u4ec0\u4e48\u4f1f\u5927\u201d\uff0c\u800c\u662f\u201c\u675c\u752b\u5982\u4f55\u5728\u4e71\u79bb\u9014\u4e2d\u4e00\u6b65\u6b65\u6210\u4e3a\u540e\u6765\u610f\u4e49\u4e0a\u7684\u675c\u752b\u201d\u3002'
      '\u5b89\u53f2\u4e4b\u4e71\u4e0d\u662f\u675c\u752b\u8bd7\u6b4c\u7684\u80cc\u666f\uff0c\u800c\u662f\u5851\u9020\u675c\u752b\u8bd7\u6b4c\u7684\u51b3\u5b9a\u6027\u73b0\u573a\u3002</p>\n')
    a('<p>\u675c\u752b\u5728\u9003\u4ea1\u3001\u9677\u8bc3\u3001\u6c42\u5b98\u3001\u88ab\u8d25\u3001\u6d41\u5f90\u3001\u76ee\u7779\u6c11\u95f4\u82e6\u96be\u7684\u8fc7\u7a0b\u4e2d\uff0c'
      '\u628a\u4e2a\u4eba\u751f\u547d\u3001\u5bb6\u5ead\u75db\u82e6\u3001\u56fd\u5bb6\u5d29\u574f\u548c\u666e\u901a\u767e\u59d3\u7684\u547d\u8fd0\u5199\u8fdb\u8bd7\u6b4c\uff0c'
      '\u4ece\u800c\u7a81\u7834\u76ee\u5510\u8bd7\u6b4c\u539f\u6709\u5ba1\u7f8e\u8fb9\u754c\u3002</p>\n<hr>\n')

    # sec3
    a('<h2 id=sec3>3. \u675c\u752b\u8def\u7ebf\u603b\u89c8</h2>\n'
      '<p>\u4ee5\u4e0b\u65f6\u95f4\u7ebf\u6d89\u53ca\u675c\u752b\u4ece 755 \u5e74\uff08\u957f\u5b89\uff09\u5230 760 \u5e74\uff08\u6210\u90fd\u8349\u5802\uff09\u7684\u5173\u952e\u8282\u70b9\uff0c\u5171 9 \u4e2a\u9636\u6bb5\u3002</p>\n')
    for n in TIMELINE:
        a(f'<h3>{he(n.get("year",""))} \xb7 {he(n.get("title",""))}</h3>\n')
        a(f'<div class=field><span class=field-label>\u5386\u53f2\u5730\u70b9\uff1a</span>{he(n.get("historicalPlace",""))}</div>\n')
        a(f'<div class=field><span class=field-label>\u4eca\u65e5\u5730\u70b9\uff1a</span>{he(n.get("modernPlace",""))}</div>\n')
        if n.get('poems'): a(f'<div class=field><span class=field-label>\u76f8\u5173\u8bd7\u6b4c\uff1a</span>{he(n.get("poems",""))}</div>\n')
        a(f'<div class=field><span class=field-label>\u4e3a\u4ec0\u4e48\u91cd\u8981\uff1a</span>{he(n.get("whyImportant",""))}</div>\n')
    a('<hr>\n')

    # sec4 - 7day
    m7 = META.get('7day',{})
    a('<h2 id=sec4>4. 7 \u5929\u7cbe\u534e\u7ebf</h2>\n<div class=route-meta>\n')
    a(f'<p><strong>{he(m7.get("routeName",""))}</strong> \xb7 {he(m7.get("days",""))}</p>\n')
    for k,fl in [('season','\u9002\u5408\u5b63\u8282'),('transport','\u4ea4\u901a\u65b9\u5f0f'),('difficulty','\u8def\u7ebf\u96be\u5ea6'),('crowd','\u63a8\u8350\u4eba\u7fa4'),('nature','\u8def\u7ebf\u6027\u8d28')]:
        if m7.get(k): a(f'<p><span class=field-label>{fl}\uff1a</span>{he(m7.get(k,""))}</p>\n')
    a('</div>\n')
    for d in ROUTE.get('7day',[]):
        a('<div class=day-block>\n<h3>Day '+he(str(d.get('day','')))+' \xb7 '+he(d.get('title',''))+'</h3>\n')
        for fk,fl in [('theme','\u4eca\u65e5\u4e3b\u9898'),('places','\u4eca\u65e5\u5730\u70b9'),('stay','\u63a8\u8350\u505c\u7559'),('transportTip','\u4ea4\u901a\u63d0\u793a'),('poems','\u4eca\u65e5\u8bd7\u6b4c'),('tip','\u65c5\u884c\u63d0\u793a'),('liveQuestion','\u73b0\u573a\u95ee\u9898')]:
            if d.get(fk): a(f'<div class=field><span class=field-label>{fl}\uff1a</span>{he(d.get(fk,""))}</div>\n')
        a('</div>\n')
    a('<hr>\n')

    # sec5 - 12day
    m12 = META.get('12day',{})
    a('<h2 id=sec5>5. 12 \u5929\u5b8c\u6574\u7ebf</h2>\n<div class=route-meta>\n')
    a(f'<p><strong>{he(m12.get("routeName",""))}</strong> \xb7 {he(m12.get("days",""))}</p>\n')
    for k,fl in [('season','\u9002\u5408\u5b63\u8282'),('transport','\u4ea4\u901a\u65b9\u5f0f'),('difficulty','\u8def\u7ebf\u96be\u5ea6'),('crowd','\u63a8\u8350\u4eba\u7fa4'),('nature','\u8def\u7ebf\u6027\u8d28')]:
        if m12.get(k): a(f'<p><span class=field-label>{fl}\uff1a</span>{he(m12.get(k,""))}</p>\n')
    a('</div>\n')
    for d in ROUTE.get('12day',[]):
        a('<div class=day-block>\n<h3>Day '+he(str(d.get('day','')))+' \xb7 '+he(d.get('title',''))+'</h3>\n')
        for fk,fl in [('theme','\u4eca\u65e5\u4e3b\u9898'),('places','\u4eca\u65e5\u5730\u70b9'),('stay','\u63a8\u8350\u505c\u7559'),('transportTip','\u4ea4\u901a\u63d0\u793a'),('poems','\u4eca\u65e5\u8bd7\u6b4c'),('tip','\u65c5\u884c\u63d0\u793a'),('liveQuestion','\u73b0\u573a\u95ee\u9898')]:
            if d.get(fk): a(f'<div class=field><span class=field-label>{fl}\uff1a</span>{he(d.get(fk,""))}</div>\n')
        a('</div>\n')
    a('<hr>\n')

    # sec6 - thematic
    thematic_ids = ['thematic-changan','thematic-anshi','thematic-sanli','thematic-qinzhou']
    thematic_by_id = {r['id']:r for r in ROUTE.get('thematic',[])}
    a('<h2 id=sec6>6. \u4e3b\u9898\u77ed\u7ebf</h2>\n')
    for tid in thematic_ids:
        tm = META.get(tid,{}); tr = thematic_by_id.get(tid.replace('thematic-',''),{})
        a('<div class=day-block>\n<h3>'+he(tm.get('routeName',''))+'</h3>\n')
        for k,fl in [('nature','\u4e3b\u9898'),('days','\u5929\u6570'),('crowd','\u9002\u5408\u4eba\u7fa4'),('season','\u63a8\u8350\u5b63\u8282'),('transport','\u4ea4\u901a\u65b9\u5f0f'),('difficulty','\u8def\u7ebf\u96be\u5ea6'),('note','\u51fa\u884c\u63d0\u9192')]:
            if tm.get(k): a(f'<div class=field><span class=field-label>{fl}\uff1a</span>{he(tm.get(k,""))}</div>\n')
        if tr:
            a('<div class=field><span class=field-label>\u63a8\u8350\u8def\u7ebf\uff1a</span>' + he(" \u2192 ".join(tr.get("route",[]))) + '</div>\n')
            a(f'<div class=field><span class=field-label>\u8bfb\u8bd7\uff1a</span>{he(tr.get("poems",""))}</div>\n')
            a(f'<div class=field><span class=field-label>\u65c5\u884c\u770b\u70b9\uff1a</span>{he(tr.get("tip",""))}</div>\n')
        a('</div>\n')
    a('<hr>\n')

    # sec7 - dual-city
    for dkey in ['dual-city','dualCity','dual_city']:
        dual = META.get(dkey,{}); 
        if dual: break
    if dual:
        a('<h2 id=sec7>7. \u897f\u5b89 + \u6210\u90fd\u53cc\u57ce\u8bfb\u8bd7\u7ebf</h2>\n<div class=route-meta>\n')
        for k,fl in [('routeName','\u8def\u7ebf\u540d\u79f0'),('days','\u63a8\u8350\u5929\u6570'),('crowd','\u9002\u5408\u4eba\u7fa4'),('season','\u63a8\u8350\u5b63\u8282'),('transport','\u4ea4\u901a\u65b9\u5f0f'),('difficulty','\u8def\u7ebf\u96be\u5ea6'),('nature','\u8def\u7ebf\u6027\u8d28'),('note','\u7279\u522b\u8bf4\u660e')]:
            if dual.get(k): a(f'<p><span class=field-label>{fl}\uff1a</span>{he(dual.get(k,""))}</p>\n')
        a('</div>\n')
        a('<p><strong>\u897f\u5b89\u770b\u70b9\uff1a</strong>\u5927\u660e\u5bab\u9057\u5740\u516c\u56ed\u3001\u534e\u6e05\u5bab\u3001\u9a91\u5c71\u3001\u9655\u897f\u5386\u53f2\u535a\u7269\u9662\u3002\u53ef\u7ed3\u5408\u300a\u5175\u8f66\u884c\u300b\u300a\u4e3d\u4eba\u884c\u300b\u300a\u81ea\u4eac\u8d74\u5949\u5148\u53bf\u8bf5\u6000\u4e94\u767e\u5b57\u300b\u9605\u8bfb\u3002</p>\n')
        a('<p><strong>\u6210\u90fd\u770b\u70b9\uff1a</strong>\u675c\u752b\u8349\u5802\u3001\u9526\u6c5f\u3001\u897f\u5cd9\u96ea\u5c71\u3002\u53ef\u7ed3\u5408\u300a\u6625\u591c\u559c\u96e8\u300b\u300a\u8305\u5c4b\u4e3a\u79cb\u98ce\u6240\u7834\u6b4c\u300b\u300a\u7edd\u53e5\u300b\u9605\u8bfb\u3002</p>\n<hr>\n')

    # sec8 - by location
    a('<h2 id=sec8>8. \u6309\u5730\u70b9\u8bfb\u8bd7</h2>\n')
    for loc in LOCs:
        a('<div class=day-block>\n<h3>'+he(loc.get('name',''))+'（'+he(loc.get('modern',''))+'）</h3>\n')
        a(f'<div class=field><span class=field-label>\u5730\u70b9\u7c7b\u578b\uff1a</span>{he(loc.get("siteType",""))}</div>\n')
        a(f'<div class=field><span class=field-label>\u4eca\u65e5\u5730\u70b9\uff1a</span>{he(loc.get("modern",""))}</div>\n')
        if loc.get('theme'): a(f'<div class=field><span class=field-label>\u5730\u70b9\u4e3b\u9898\uff1a</span>{he(loc.get("theme",""))}</div>\n')
        a(f'<div class=field><span class=field-label>\u6587\u7ae0\u610f\u4e49\uff1a</span>{he(loc.get("articleMeaning",""))}</div>\n')
        if loc.get('poems'): a(f'<div class=field><span class=field-label>\u76f8\u5173\u8bd7\u6b4c\uff1a</span>{he(loc.get("poems",""))}</div>\n')
        if loc.get('quote'): a(f'<blockquote>{he(loc.get("quote",""))}</blockquote>\n')
        if loc.get('travelTip'): a(f'<div class=field><span class=field-label>\u65c5\u884c\u63d0\u793a\uff1a</span>{he(loc.get("travelTip",""))}</div>\n')
        a('</div>\n')
    a('<hr>\n')

    # sec9 - by stage
    a('<h2 id=sec9>9. \u6309\u9636\u6bb5\u8bfb\u8bd7</h2>\n')
    by_stage = {s:[] for s in STAGE_ORDER}
    for p in POEMS:
        s = stage_of(p)
        if s in by_stage: by_stage[s].append(p)
    for stage in STAGE_ORDER:
        ps = by_stage[stage]
        if not ps: continue
        desc = STAGE_DESC.get(stage,'')
        a(f'<h3>{he(stage)}（{len(ps)} \u9996\uff09</h3>\n')
        if desc: a(f'<p>{he(desc)}</p>\n')
        for p in ps:
            a('<div class=poem-block>\n')
            a(f'<p><strong>{he(p.get("title",""))}</strong></p>\n')
            a(f'<p class=poem-loc>\U0001f4dd {he(p.get("locationName",""))}  |  {he(p.get("period",""))}  |  {he(p.get("theme",""))}</p>\n')
            if p.get('quote'): a(f'<p class=poem-quote><em>{he(p.get("quote",""))}</em></p>\n')
            if p.get('note'): a(f'<p class=poem-note>{he(p.get("note",""))}</p>\n')
            a('</div>\n')
    a('<hr>\n')

    # sec10 - tips
    a('<h2 id=sec10>10. \u65c5\u884c\u5b9e\u7528\u63d0\u9192</h2>\n<div class=tips-block>\n<ul>\n')
    tips = [
        ('\u4ea4\u901a','\u5b8c\u6574\u7ebf\u8de8\u9655\u897f\u3001\u6cb3\u5357\u3001\u7518\u8083\u3001\u56db\u5ddd\uff0c\u5efa\u8bae\u5206\u6bb5\u6216\u81ea\u9a7e/\u5305\u8f66\u7ed3\u5408\u9ad8\u94c1\u3002'),
        ('\u5b63\u8282','\u6625\u79cb\u4f18\u5148\uff1b\u590f\u5b63\u6ce8\u610f\u9ad8\u6e29\uff1b\u51ac\u5b63\u6ce8\u610f\u5c71\u533a\u5929\u6c14\u4e0e\u4f53\u529b\u3002'),
        ('\u4f53\u529b','\u79e6\u5dde\u2014\u540c\u8c37\u2014\u5251\u95e8\u6bb5\u5730\u5f62\u590d\u6742\uff0c\u5efa\u8bae\u7559\u5f39\u6027\u65f6\u95f4\u3002'),
        ('\u9605\u8bfb','\u6bcf\u9a7c\u7cbe\u8bfb\u4e00\u4e24\u9996\u8bd7\u5373\u53ef\uff0c\u4e0d\u5fc5\u628a\u65c5\u884c\u53d8\u6210\u80cc\u8bf5\u6e05\u5355\u3002'),
        ('\u73b0\u573a','\u5f88\u591a\u5730\u70b9\u4e0d\u662f\u6807\u51c6\u666f\u533a\uff0c\u91cd\u8981\u7684\u662f\u628a\u8bd7\u53e5\u3001\u5730\u5f62\u3001\u5386\u53f2\u4e8b\u4ef6\u53e0\u5728\u4e00\u8d77\u7406\u89e3\u3002'),
        ('\u6839\u5b9e','\u5f00\u653e\u65f6\u95f4\u3001\u4ea4\u901a\u3001\u4f4f\u5bbf\u3001\u666f\u533a\u653f\u7b56\u3001\u9053\u8def\u60c5\u51b5\u51fa\u53d1\u524d\u9700\u91cd\u65b0\u786e\u8ba4\u3002'),
    ]
    for k,v in tips: a(f'<li><strong>{he(k)}\uff1a</strong>{he(v)}</li>\n')
    a('</ul>\n</div>\n<hr>\n')

    # sec11 - disclaimer
    a('<h2 id=sec11>11. \u6765\u6e90\u4e0e\u8fb9\u754c\u8bf4\u660e</h2>\n')
    a(f'<p>\u672c\u624b\u518c\u57fa\u4e8e{he(SRC)}\u5c01\u9762\u6545\u4e8b\u300a\u4e71\u79bb\u9014\u4e2d\uff0c\u675c\u752b\u4f55\u4ee5\u6210\u4e3a\u201c\u675c\u752b\u201d\uff1f\u300b\u7684\u9605\u8bfb\u68c0\u7406\u3001\u8def\u7ebf\u91cd\u6784\u4e0e\u6587\u65c5\u8def\u7ebf\u8bbe\u8ba1\uff0c\u4e0d\u8f6c\u8f7d\u539f\u6587\u3002</p>\n')
    a('<p>\u9875\u9762\u4e0e\u624b\u518c\u5f15\u7528\u675c\u752b\u8bd7\u53e5\u4ec5\u4f5c\u5bfc\u89c8\u3001\u8d4f\u6790\u4e0e\u5730\u70b9\u5173\u8054\u4f7f\u7528\u3002</p>\n')
    a('<p>\u5510\u4ee3\u5730\u540d\u4e0e\u4eca\u65e5\u5730\u70b9\u5b58\u5728\u4e0d\u540c\u7a0b\u5ea6\u7684\u8003\u8bc1\u5dee\u5f02\u3002</p>\n')
    a('<p>\u6587\u65c5\u8def\u7ebf\u4e3a\u6587\u5316\u65c5\u884c\u89c4\u5212\u5efa\u8bae\uff0c\u4e0d\u5305\u542b\u5b9e\u65f6\u4ea4\u901a\u3001\u7968\u4ef7\u3001\u5f00\u653e\u65f6\u95f4\u6216\u4f4f\u5bbf\u4fe1\u606f\u3002</p>\n')
    a('<p>\u90e8\u5206\u5730\u70b9\u5c5e\u4e8e\u6587\u5b66\u5bfb\u8bbf\u70b9\u6216\u5386\u53f2\u5bf9\u5e94\u70b9\uff0c\u4e0d\u4e00\u5b9a\u662f\u6210\u719f\u666f\u533a\u3002</p>\n')
    a(f'<div class=print-note>\u672c\u624b\u518c\u7531\u675c\u752b\u8bd7\u8def\u4e92\u52a8\u9875\u9762 {now} \u81ea\u52a8\u751f\u6210 \xb7 '
      f'<a href="https://conanxin.github.io/projects/dufu-luanli-route/">\u675c\u752b\u8bd7\u8def\u4e92\u52a8\u9875\u9762</a></div>\n')
    a('</body>\n</html>\n')
    return ''.join(B)

def main():
    md = build_md()
    with open(MDFILE, 'w', encoding='utf-8', newline='\n') as f:
        f.write(md)
    print(f'  MD {len(md)} chars -> {MDFILE}')
    html = build_html()
    with open(HTMLFILE, 'w', encoding='utf-8', newline='\n') as f:
        f.write(html)
    print(f'  HTML {len(html)} chars -> {HTMLFILE}')
    if WEASY:
        try:
            weasyprint.HTML(filename=str(HTMLFILE)).write_pdf(str(PDFFILE))
            sz = os.path.getsize(PDFFILE)
            print(f'  PDF {sz} bytes -> {PDFFILE}')
        except Exception as e:
            print(f'  PDF warning: {e}', file=sys.stderr)
    else:
        print('  PDF: weasyprint not available')
    print('Done.')

if __name__ == '__main__':
    main()
