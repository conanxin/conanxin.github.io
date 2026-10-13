#!/usr/bin/env python3
"""Check the reader interface and public profile without submitting account forms."""
import json, os, shutil, subprocess, sys, tempfile, time
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(sys.argv[1] if len(sys.argv)>1 else '.site-build').resolve()
out=Path(os.environ.get('RUNNER_TEMP',tempfile.gettempdir()))/'site-ui-check'
out.mkdir(parents=True,exist_ok=True)
server=subprocess.Popen([sys.executable,'-m','http.server','8765','--directory',str(root)],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
base='http://127.0.0.1:8765'
paths=['/','/posts/','/projects/','/podcast/','/about.html','/projects/shuge/','/projects/shuge-exhibition-v1.0/','/projects/shuge-exhibition-v1.0/rooms/room2/','/projects/shuge-exhibition-v1.0/cases/case2/','/projects/shuge/research/water-classic/yishui/article/','/posts/chinese-ai-silicon-valley-power.html','/research-terminal/','/site-map/','/site-guide/','/podcast/education-broligarchy/','/projects/wbw-spacex-mars-cn/','/posts/site-design-evidence-layers.html','/projects/site-design-lab/','/content-index/','/projects/site-design-lab/shuge-evidence-exhibition/','/projects/site-design-lab/shuge-source-register/','/projects/site-design-lab/shuge-source-crosswalk/','/projects/site-design-lab/shuge-source-crosswalk/primary-catalog/','/projects/site-design-lab/shuge-source-crosswalk/scan-locator/','/projects/yarvin-moldbug-cn/']
results=[]
try:
 time.sleep(.6)
 with sync_playwright() as p:
  chrome=shutil.which('google-chrome') or shutil.which('chromium')
  browser=p.chromium.launch(executable_path=chrome,headless=True,args=['--no-sandbox']) if chrome else p.chromium.launch(headless=True)
  for width in (1440,390):
   for i,path in enumerate(paths):
    page=browser.new_page(viewport={'width':width,'height':900},device_scale_factor=1)
    errors=[]
    page.on('pageerror',lambda e,errs=errors:errs.append(str(e)))
    page.route('**/*',lambda r:r.continue_() if r.request.url.startswith(base) else r.abort())
    response=page.goto(base+path,wait_until='domcontentloaded',timeout=25000)
    page.wait_for_timeout(650)
    metrics=page.evaluate('''() => ({width:innerWidth,scroll:document.documentElement.scrollWidth,
    headers:Array.from(document.querySelectorAll('.site-header')).filter(n=>n.getClientRects().length>0).length,
    bg:getComputedStyle(document.body).backgroundColor,themed:document.body.dataset.siteTheme,
    identity:document.body.dataset.siteIdentity,text:document.body.innerText.length,
    brand:document.querySelector('.site-brand')?.innerText,
    visibleNav:Array.from(document.querySelectorAll('.site-nav a')).filter(n=>n.offsetWidth>0).length})''')
    assert response and response.status==200,(path,'HTTP',response.status if response else None)
    assert metrics['themed']==('project-native' if path=='/projects/wbw-spacex-mars-cn/' else 'unified-v1'),(path,'wrong theme',metrics)
    assert metrics['identity']=='conan-xin-v1',(path,'old identity')
    assert metrics['brand'].startswith('Conan Xin'),(path,'wrong brand',metrics)
    assert metrics['headers']==1,(path,'header count',metrics['headers'])
    assert metrics['text']>100,(path,'empty content')
    assert 'hello@xin-conan.me' not in page.locator('body').inner_text(),(path,'old contact')
    assert page.locator('.site-footer a[href="mailto:conanxin@gmail.com"]').count()==1,(path,'footer contact')
    if path in ('/','/projects/','/posts/','/about.html','/site-map/','/posts/site-design-evidence-layers.html','/projects/site-design-lab/','/content-index/','/projects/site-design-lab/shuge-evidence-exhibition/','/projects/site-design-lab/shuge-source-register/','/projects/site-design-lab/shuge-source-crosswalk/','/projects/site-design-lab/shuge-source-crosswalk/primary-catalog/','/projects/site-design-lab/shuge-source-crosswalk/scan-locator/','/projects/yarvin-moldbug-cn/'):
     if metrics['scroll']>width+5:
      offenders=page.evaluate("""() => Array.from(document.querySelectorAll('body *'))
       .map(el=>({el,rect:el.getBoundingClientRect()}))
       .filter(({rect})=>rect.width>0 && rect.right>innerWidth+5 && rect.left>=-5)
       .sort((a,b)=>b.rect.right-a.rect.right).slice(0,18)
       .map(({el,rect})=>({tag:el.tagName,cls:typeof el.className==='string'?el.className.slice(0,60):'svg',
         right:Math.round(rect.right),width:Math.round(rect.width),
         text:(el.innerText||'').slice(0,65)}))""")
      raise AssertionError((path,width,'horizontal overflow',metrics,offenders))
    interaction=None
    if path=='/':
     nav_link=page.locator('.site-nav a[href="/about.html"]').first
     nav_link.scroll_into_view_if_needed(timeout=10000)
     try:
      nav_link.click(timeout=15000,force=True)
     except Exception:
      nav_link.click(timeout=15000,no_wait_after=True)
     assert page.url.endswith('/about.html'),('home -> about failed',page.url)
     assert page.locator('h1').inner_text()=='关于 Conan Xin'
     assert page.locator('#contact a[href="mailto:conanxin@gmail.com"]').count()==1
     interaction='home -> about -> real contact link'
     page.goto(base+path,wait_until='domcontentloaded')
    if path=='/about.html':
     profile=json.loads(page.locator('#site-person').inner_text())
     assert profile['name']=='Conan Xin'
     assert profile['email']=='mailto:conanxin@gmail.com'
     body=page.locator('main').inner_text()
     for old in ('Windows 10','8GB','coming soon','Xin Conan','hello@xin-conan.me'):
      assert old not in body,(path,'stale profile',old)
    if path=='/projects/' and page.locator('.project-card').count()>0:
     before=page.locator('.project-card').count()
     page.locator('#project-search').fill('此关键词不应命中任何项目XYZ098')
     page.wait_for_timeout(350)
     assert page.locator('.project-card').count()==0
     page.locator('#project-search').fill('');page.wait_for_timeout(350)
     assert page.locator('.project-card').count()==before
     interaction='search -> no results -> restored'
    if path=='/projects/wbw-spacex-mars-cn/':
     native=page.evaluate("""() => ({
       rootTheme:document.documentElement.dataset.theme,
       readingMode:document.documentElement.dataset.readingMode,
       background:getComputedStyle(document.body).backgroundImage,
       textColor:getComputedStyle(document.body).color
     })""")
     assert native['rootTheme']=='deep-space',(path,'default theme',native)
     assert native['readingMode']=='immersive',(path,'default reading mode',native)
     assert 'rgb(10, 14, 26)' in native['background'],(path,'native dark gradient overridden',native)
     assert native['textColor']=='rgb(230, 237, 243)',(path,'native light text overridden',native)
     assert page.locator('header.hero').count()==1,(path,'hero missing')
     assert page.locator('#starfield').count()==1,(path,'starfield missing')
     assert page.locator('body.site-unified').count()==0,(path,'global overrides leaked')
     if width==390 and metrics['scroll']>width+5:
      offenders=page.evaluate("""() => Array.from(document.querySelectorAll('body *'))
        .map(el => ({el, rect:el.getBoundingClientRect()}))
        .filter(({rect}) => rect.width>0 && rect.right>innerWidth+8 && rect.left>=-5)
        .sort((a,b) => b.rect.right-a.rect.right)
        .slice(0,24)
        .map(({el,rect}) => ({tag:el.tagName, cls:String(el.className).slice(0,70),
          id:el.id, left:Math.round(rect.left), right:Math.round(rect.right),
          width:Math.round(rect.width), scroll:el.scrollWidth,
          text:(el.innerText||'').slice(0,40)}))""")
      raise AssertionError((path,'mobile horizontal overflow',width,metrics['scroll'],offenders))
     page.screenshot(path=str(out/f'{i}-{width}.png'),full_page=False)
     page.locator('button.tool-btn[data-theme="mars-sand"]').click()
     assert page.evaluate("document.documentElement.dataset.theme")=='mars-sand'
     assert 'rgb(244, 232, 212)' in page.evaluate("getComputedStyle(document.body).backgroundImage"),(path,'sand palette broken')
     page.locator('button.tool-btn[data-theme="deep-space"]').click()
     assert page.evaluate("document.documentElement.dataset.theme")=='deep-space'
     page.locator('button.tool-btn[data-reading-mode="annotated"]').click()
     assert page.evaluate("document.documentElement.dataset.readingMode")=='annotated'
     page.locator('button.tool-btn[data-reading-mode="immersive"]').click()
     assert page.evaluate("document.documentElement.dataset.readingMode")=='immersive'
     interaction='native deep-space -> mars-sand -> deep-space; immersive -> annotated -> immersive'
    if path in ('/posts/site-design-evidence-layers.html','/projects/site-design-lab/'):
     klass='template-article' if path.startswith('/posts/') else 'template-project'
     assert page.locator(f'article.{klass}').count()==1,(path,'missing real template article')
     for section in ('intro','evidence','citation'):
      assert page.locator(f'#{section}').count()==1,(path,'missing evidence section',section)
     details=page.locator('details.evidence-list' if klass=='template-article' else 'details.work-log').first
     details.locator('summary').click()
     assert details.get_attribute('open') is not None,(path,'details interaction failed')
     interaction='template article -> real citations -> expandable evidence'
    if path=='/content-index/':
     count=page.locator('[data-index-card]').count()
     assert count>15,(path,'too few discovered records',count)
     for href in ('/posts/site-design-evidence-layers.html',
                  '/projects/site-design-lab/shuge-evidence-exhibition/',
                  '/projects/site-design-lab/shuge-source-register/',
                  '/projects/site-design-lab/shuge-source-crosswalk/','/projects/site-design-lab/shuge-source-crosswalk/primary-catalog/','/projects/site-design-lab/shuge-source-crosswalk/scan-locator/'):
      assert page.locator(f'[data-index-card] a[href="{href}"]').count()==1,(path,'missing indexed URL',href)
     page.locator('#index-kind').select_option('exhibition')
     assert page.locator('[data-index-card]:not([hidden])').count()>=1
     assert page.locator('[data-index-card][data-kind="reference"]:not([hidden])').count()==0
     page.locator('#index-kind').select_option('reference')
     assert page.locator('[data-index-card][data-kind="reference"]:not([hidden])').count()>=1
     page.locator('#index-kind').select_option('')
     page.locator('#index-search').fill('此关键词不应命中任何文章ABC123')
     assert page.locator('[data-index-card]:not([hidden])').count()==0
     assert page.locator('#index-empty').is_visible()
     page.locator('#index-search').fill('')
     assert page.locator('[data-index-card]:not([hidden])').count()==count
     interaction='auto-index kinds -> search zero -> restored'
    if path in ('/projects/site-design-lab/shuge-evidence-exhibition/',
                '/projects/site-design-lab/shuge-source-register/',
                '/projects/site-design-lab/shuge-source-crosswalk/','/projects/site-design-lab/shuge-source-crosswalk/primary-catalog/','/projects/site-design-lab/shuge-source-crosswalk/scan-locator/'):
     kind='exhibition' if 'exhibition' in path else 'reference'
     assert page.locator(f'article.template-{kind}').count()==1,(path,'missing real template')
     sections=('intro','evidence','citation') if kind=='exhibition' else ('intro','source','citation')
     for section in sections:
      assert page.locator('#'+section).count()==1,(path,'missing research section',section)
     assert 'TEMPLATE_' not in page.locator('article').inner_text(),(path,'placeholder published')
     assert page.locator('a[href*="CLAIM_SUPPORT_AUDIT.md"]').count()>=1
     details=page.locator('article details').first
     details.locator('summary').click()
     assert details.get_attribute('open') is not None,(path,'evidence disclosure')
     interaction='real SHUGE template -> source link -> detail expanded'
    if path=='/projects/site-design-lab/shuge-source-crosswalk/':
     assert page.locator('main .work-card').count()==3,(path,'source cards missing')
     assert page.locator('main a[href^="https://www.shuge.org/view/"]').count()==3
     assert page.locator('main .status-line').count()==3
     assert 'UNVERIFIED' in page.locator('main .status-line').first.inner_text()
     assert page.locator('main .work-card details').first.get_attribute('open') is not None,(path,'standard template detail interaction did not open')
     response_json=page.request.get(base+path+'crosswalk.json')
     assert response_json.status==200,(path,'crosswalk json unreachable')
     crosswalk=response_json.json()
     assert len(crosswalk['rows'])==3
     assert all(r['archived_post_record']['status']=='VERIFIED' for r in crosswalk['rows'])
     assert all(r['external_page_observation']['status']=='VERIFIED' for r in crosswalk['rows'])
     assert all(r['institution_catalog_item']['status']=='UNVERIFIED' for r in crosswalk['rows'])
     assert crosswalk['corrected_prior_inference']['related_post_id']==124575
     interaction='three archived ID-to-URL matches -> archive holder unverified -> evidence expanded'
    if path=='/projects/site-design-lab/shuge-source-crosswalk/primary-catalog/':
     assert page.locator('article.template-reference').count()==1,(path,'standard reference template missing')
     assert page.locator('[data-audit-work]').count()==3,(path,'primary catalog work rows missing')
     assert page.locator('[data-citation-id]').count()==6,(path,'six citations missing')
     body_text=page.locator('article').inner_text()
     for key in ('子076-0004','Chinois 5563','史112-0007','297-0020','UNVERIFIED'):
      assert key in body_text,(path,'shelfmark or evidence boundary missing',key)
     audit_response=page.request.get(base+'/projects/site-design-lab/shuge-source-crosswalk/primary-catalog-audit.json')
     assert audit_response.status==200,(path,'audit JSON missing')
     audit=audit_response.json()
     assert audit['summary']['primary_repository_catalog_candidate_count']==4
     assert audit['summary']['citation_ids_occurring_in_citations_json_runs']==1
     assert audit['summary']['matching_shuge_to_exact_holder_scans_verified']==0
     assert all(row['claim_semantics']['status']=='UNVERIFIED' for row in audit['citation_audit'])
     interaction='four original catalog records -> six citation IDs -> original page mapping pending'
    if path=='/projects/site-design-lab/shuge-source-crosswalk/scan-locator/':
     assert page.locator('article.template-reference').count()==1,(path,'missing shared reference template')
     assert page.locator('[data-scan-work]').count()==3,(path,'scan holdings not rendered')
     assert page.locator('[data-scan-citation]').count()==6,(path,'citation hypotheses incomplete')
     assert page.locator('[data-scan-citation="SHUGE:p211203:1338"]').count()==1
     body_text=page.locator('article').inner_text()
     for word in ('C103160581800','C103160611900','f274','0 张','UNVERIFIED'):
      assert word in body_text,(path,'missing image locator or caveat',word)
     probe=page.request.get(base+'/projects/site-design-lab/shuge-source-crosswalk/scan-locator-audit.json')
     assert probe.status==200,(path,'sidecar JSON missing')
     ledger=probe.json()
     assert ledger['summary']['downloaded_original_image_binaries']==0
     assert ledger['summary']['verified_citation_claim_semantics']==0
     assert ledger['summary']['candidate_citation_ids']==6
     assert ledger['locator_hypothesis']['projection_is_forbidden']
     interaction='official viewer locators -> numeric offset hypothesis -> scan mapping remains unverified'
    if path=='/projects/yarvin-moldbug-cn/':
     # Content and interactive controls must coexist with the shared paper theme.
     page.wait_for_function("document.querySelector('#contextGrid')?.children.length > 0",timeout=10000)
     # Same source must drive the hero summary and rendered glossary.
     shown=int(page.locator('#statGlossary').inner_text().strip())
     glossary_count=page.locator('#glossaryGrid .glossary-card').count()
     assert shown==glossary_count and shown>0,(path,'glossary count drift',shown,glossary_count)
     # P4: a source page/anchor is not equivalent to a verified translation or claim.
     ledger_res=page.request.get(base+path+'content/source-ledger.json')
     assert ledger_res.status==200,(path,'source ledger JSON not served')
     ledger=ledger_res.json()
     assert ledger['audit']['chapter_total']==9
     assert ledger['audit']['located_source_pages']==10
     assert ledger['audit']['translation_paragraphs_verified']==0
     assert ledger['audit']['historical_political_claims_independently_verified']==0
     # P6: Spanish editorial original recovered, English publisher translation remains unavailable.
     p6_response=page.request.get(base+path+'content/three-layer-review.json')
     assert p6_response.status==200,(path,'P6 tri-layer sidecar not served')
     p6=p6_response.json()
     assert p6['audit']['spanish_original_article_retrieved'],(path,'P6 Spanish source not marked')
     assert not p6['audit']['english_421_version_retrieved'],(path,'P6 English edition asserted')
     assert p6['audit']['chinese_headings_mapped']==9,(path,'P6 9 title pairs missing')
     assert p6['audit']['three_layer_clause_cases']==3,(path,'P6 three quote paths missing')
     assert p6['audit']['human_approved_cases']==0,(path,'P6 human approval prematurely marked')
     assert p6['audit']['full_zh_translation_paragraphs_verified']==0
     assert p6['audit']['spanish_preface_present']
     assert not p6['audit']['chinese_preface_present_in_article']
     assert page.locator('#triLayerCases .tri-layer__case').count()==3,(path,'P6 no-JS cards missing')
     assert page.locator('#triLayerCases .tri-layer__case[data-human-approval="PENDING"]').count()==3
     for language in ('en','es','zh-CN'):
      assert page.locator(f'#triLayerCases .tri-layer__excerpt[lang="{language}"]').count()==3,(path,'P6 language lane missing',language)
     page.locator('#triLayerHeadings summary').click()
     assert page.locator('#triLayerHeadings').get_attribute('open') is not None,(path,'P6 chapter crosswalk not expandable')
     assert page.locator('#triLayerHeadings tbody tr').count()==9,(path,'P6 all heading rows missing')
     page.locator('#triLayerHeadings summary').click()
     assert page.locator('#sourceLedgerGrid .source-ledger__card').count()==9,(path,'missing no-JS provenance cards')
     # P5: source-quote excerpts are AI-preliminary, never a finished translation/claim verification.
     p5_res=page.request.get(base+path+'content/passage-alignments.json')
     assert p5_res.status==200,(path,'P5 passage sidecar missing')
     p5=p5_res.json()
     assert p5['audit']['candidate_pairs']==3,(path,'P5 pair count')
     assert p5['audit']['human_approved_pairs']==0,(path,'P5 human gate prematurely passed')
     assert p5['audit']['full_translation_paragraphs_verified']==0
     assert p5['audit']['political_historical_claims_verified']==0
     assert [x['chapter'] for x in p5['pairs']]==[5,7,9],(path,'P5 chapter identities changed')
     assert page.locator('#passageReviewList .passage-review__card').count()==3,(path,'P5 static cards missing')
     assert page.locator('#passage-review-ch9 a[href*="/2008/05/ol5-shortest-way-to-world-peace/"]').count()==1
     assert page.locator('#passage-review-ch7 a[href*="/2008/11/patchwork-positive-vision-part-1/"]').count()==1
     first_pair=page.locator('#passage-review-ch5')
     assert first_pair.locator('blockquote[lang="en"]').is_visible(),(path,'English quote unavailable')
     assert first_pair.locator('blockquote[lang="zh-CN"]').is_visible(),(path,'Chinese quote unavailable')
     first_pair.locator('details summary').click()
     assert first_pair.locator('details').get_attribute('open') is not None,(path,'Chinese full quote not expandable')
     first_pair.locator('details summary').click()
     assert page.locator('#sourceLedgerGrid .source-ledger__card:not([hidden])').count()==9
     page.locator('#ledgerState').select_option('PASSAGE_LOCATED')
     assert page.locator('#sourceLedgerGrid .source-ledger__card:not([hidden])').count()==3,(path,'passage-only filter incorrect')
     page.locator('#ledgerQuery').fill('国际法')
     assert page.locator('#sourceLedgerGrid .source-ledger__card:not([hidden])').count()==1,(path,'chapter keyword filter incorrect')
     page.locator('#ledgerQuery').fill('no-such-item-20261013')
     assert page.locator('#sourceLedgerGrid .source-ledger__card:not([hidden])').count()==0,(path,'empty source filter incorrect')
     page.locator('#ledgerState').select_option('all')
     page.locator('#ledgerQuery').fill('')
     assert page.locator('#sourceLedgerGrid .source-ledger__card:not([hidden])').count()==9,(path,'source filter restore failed')
     assert page.locator('#source-ledger-ch9 [data-source-id="S06"]').count()==1,(path,'world peace source not mapped')
     assert page.locator('#source-ledger-ch7 [data-source-id="S08"]').count()==1,(path,'Patchwork source not mapped')
     assert page.locator('#searchOverlay').is_hidden(),(path,'search overlay visible on load')
     assert page.locator('#tocDrawer').is_hidden(),(path,'TOC drawer visible on load')
     assert page.locator('#heroStars').count()==0,(path,'old starfield survived')
     assert page.locator('.article .article-h2').count()>=9,(path,'article chapters missing')
     assert metrics['bg']=='rgb(248, 247, 244)',(path,'warm site background missing',metrics['bg'])
     assert page.locator('.hero').is_visible(),(path,'hero not rendered')
     assert page.locator('.hero').evaluate("(el)=>el.getBoundingClientRect().height")<650,(path,'hero consumes full viewport')
     assert page.locator('.hero__cta .btn--primary').get_attribute('href')=='#mencius-moldbug',(path,'start reading points to missing section')
     assert page.locator('.reader-transition').count()==1,(path,'translation-to-research boundary missing')
     assert page.locator('.diagram-caption').count()>=3,(path,'diagram caveats missing')
     assert page.locator('.cathedral-diagram__arrows').is_hidden(),(path,'diagram arrows still overlap nodes')
     core_box=page.locator('.cathedral-diagram__core').bounding_box()
     node_box=page.locator('.cathedral-diagram__node--right').bounding_box()
     assert core_box and node_box and core_box['y'] >= node_box['y'] + node_box['height'] - 2,(path,'diagram core overlaps node',core_box,node_box)
     assert page.locator('#sourcesGrid .source-block li em').count()>=4,(path,'source-title italics not rendered')
     chapter_counter=page.locator('.article > h2.article-h2').first.evaluate("(el)=>getComputedStyle(el,'::before').content")
     assert 'CHAPTER ' in chapter_counter and 'counter(yarvin-chapter' in chapter_counter,(path,'chapter hierarchy missing',chapter_counter)
     assert page.locator('.compare-table[tabindex="0"]').count()==1,(path,'comparison horizontal reading region missing')
     assert page.locator('.article-figure:has(img[src=""])').first.is_hidden(),(path,'empty image placeholder showing')
     page.locator('#btnSearch').click()
     assert page.locator('#searchOverlay').is_visible(),(path,'search did not open',page.evaluate("""() => ({
       aria:document.getElementById('btnSearch').getAttribute('aria-expanded'),
       overlayHidden:document.getElementById('searchOverlay').hidden,
       display:getComputedStyle(document.getElementById('searchOverlay')).display,
       context:document.getElementById('contextGrid').textContent.slice(0,180),
       appInitialized:!!window.__yarvinApp, searchButtonListeners:'see aria expansion',
       src:document.querySelector('script[src*="app.js"]')?.src
     })"""),errors)
     assert page.locator('#btnSearch').get_attribute('aria-expanded')=='true'
     page.keyboard.press('Escape')
     assert page.locator('#searchOverlay').is_hidden(),(path,'search did not close')
     assert page.locator('#btnSearch').get_attribute('aria-expanded')=='false'
     # The reader promises arrows and Enter; exercise them as real keyboard actions.
     page.locator('#btnSearch').click()
     page.locator('#searchInput').fill('Patchwork')
     page.wait_for_function("document.querySelectorAll('#searchResults .search-result').length > 0",timeout=6000)
     first_href=page.locator('#searchResults .search-result').first.get_attribute('data-href')
     page.locator('#searchInput').press('ArrowDown')
     assert page.evaluate("document.activeElement.classList.contains('search-result')"),(path,'ArrowDown did not focus search result')
     page.keyboard.press('Enter')
     assert page.locator('#searchOverlay').is_hidden(),(path,'Enter did not close search')
     assert page.evaluate('window.location.hash')=='#'+first_href,(path,'Enter did not navigate to result')
     page.locator('#btnToc').click()
     assert page.locator('#tocDrawer').is_visible(),(path,'TOC did not open')
     page.locator('#btnTocClose').click()
     assert page.locator('#tocDrawer').is_hidden(),(path,'TOC did not close')
     page.locator('button.toolbar__btn[data-reading-mode="compact"]').click()
     assert page.evaluate("document.documentElement.dataset.readingMode")=='compact',(path,'reading mode broken')
     page.locator('button.toolbar__btn[data-theme="patchwork"]').click()
     assert page.evaluate("document.documentElement.dataset.theme")=='patchwork',(path,'theme control broken')
     page.locator('button.toolbar__btn[data-theme="cathedral"]').click()
     page.locator('button.toolbar__btn[data-reading-mode="annotated"]').click()
     if width==390:
      page.evaluate("document.documentElement.style.scrollBehavior='auto'; window.scrollTo(0,document.getElementById('glossary-section').offsetTop)")
      page.wait_for_timeout(170)
      assert page.locator('#floatingToc').is_visible(),(path,'floating mobile TOC missing while reading')
      page.locator('#floatingToc').click()
      assert page.locator('#tocDrawer').is_visible(),(path,'floating TOC did not open drawer')
      assert page.locator('#floatingToc').get_attribute('aria-expanded')=='true'
      page.keyboard.press('Escape')
      assert page.locator('#tocDrawer').is_hidden(),(path,'floating TOC Escape failed')
      assert page.locator('#floatingToc').get_attribute('aria-expanded')=='false'
     else:
      assert page.locator('#floatingToc').is_hidden(),(path,'mobile button exposed on desktop')
     page.locator('.hero__cta .btn--primary').click()
     assert page.evaluate('window.location.hash')=='#mencius-moldbug',(path,'start reading navigation failed')
     interaction='chapter rhythm + citations -> keyboard search -> mobile TOC -> start-reading anchor'
    if path=='/site-map/':
     page.locator('details.archive').first.locator('summary').click()
     assert page.locator('details.archive').first.get_attribute('open') is not None
     assert page.locator('main a[href^="/src/"]').count()==0
     assert page.locator('main a[href="/content-index/"]').count()==1
     interaction='directory section -> expand reader links'
    d=page.locator('details.site-local').first
    if d.count():
     d.locator('summary').click();assert d.get_attribute('open') is not None
     d.locator('summary').click()
    assert not errors,(path,width,'script errors',errors)
    if path=='/projects/yarvin-moldbug-cn/':
     page.evaluate("""offset => {
       document.documentElement.style.scrollBehavior='auto';
       const section=document.getElementById('tri-layer-section');
       window.scrollTo(0, section.getBoundingClientRect().top + window.scrollY - offset);
     }""",95 if width==1440 else 18)
     page.wait_for_timeout(90)
     page.screenshot(path=str(out/f'yarvin-p6-three-layer-{width}.png'),full_page=False)
     page.evaluate("""offset => {
       document.documentElement.style.scrollBehavior='auto';
       const section=document.getElementById('passage-review-section');
       window.scrollTo(0, section.getBoundingClientRect().top + window.scrollY - offset);
     }""",95 if width==1440 else 18)
     page.wait_for_timeout(90)
     page.screenshot(path=str(out/f'yarvin-p5-passage-review-{width}.png'),full_page=False)
     page.evaluate("""offset => {
       document.documentElement.style.scrollBehavior='auto';
       const section=document.getElementById('source-ledger-section');
       window.scrollTo(0, section.getBoundingClientRect().top + window.scrollY - offset);
     }""",100 if width==1440 else 22)
     page.wait_for_timeout(90)
     page.screenshot(path=str(out/f'yarvin-source-ledger-{width}.png'),full_page=False)
     page.locator('#cathedral-section').scroll_into_view_if_needed()
     page.screenshot(path=str(out/f'yarvin-diagram-{width}.png'),full_page=False)
     page.locator('#sources-section').scroll_into_view_if_needed()
     page.screenshot(path=str(out/f'yarvin-sources-{width}.png'),full_page=False)
    if path in ('/posts/site-design-evidence-layers.html','/projects/site-design-lab/','/content-index/','/projects/site-design-lab/shuge-evidence-exhibition/','/projects/site-design-lab/shuge-source-register/','/projects/site-design-lab/shuge-source-crosswalk/','/projects/site-design-lab/shuge-source-crosswalk/primary-catalog/','/projects/site-design-lab/shuge-source-crosswalk/scan-locator/','/projects/yarvin-moldbug-cn/'):
     page.evaluate("document.documentElement.style.scrollBehavior='auto'; window.scrollTo(0,0)")
     page.wait_for_timeout(100)
    if path in ('/','/about.html','/projects/','/projects/shuge-exhibition-v1.0/rooms/room2/','/posts/site-design-evidence-layers.html','/projects/site-design-lab/','/content-index/','/projects/site-design-lab/shuge-evidence-exhibition/','/projects/site-design-lab/shuge-source-register/','/projects/site-design-lab/shuge-source-crosswalk/','/projects/site-design-lab/shuge-source-crosswalk/primary-catalog/','/projects/site-design-lab/shuge-source-crosswalk/scan-locator/','/projects/yarvin-moldbug-cn/'):
     page.screenshot(path=str(out/f'{i}-{width}.png'),full_page=False)
    results.append({'path':path,'viewport':width,'http':response.status,'title':page.title(),'metrics':metrics,'interaction':interaction,'script_errors':errors})
    page.close()
  browser.close()
finally:server.terminate()
report={'checked':len(results),'checks':'PASS','browser':'Chromium / Playwright','external_requests':'blocked for local render checks','remote_account_actions':0,'results':results}
(out/'checks.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps(report,ensure_ascii=False))
print('SCREENSHOTS_AND_REPORT='+str(out))
