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
paths=['/','/posts/','/projects/','/podcast/','/about.html','/projects/shuge/','/projects/shuge-exhibition-v1.0/','/projects/shuge-exhibition-v1.0/rooms/room2/','/projects/shuge-exhibition-v1.0/cases/case2/','/projects/shuge/research/water-classic/yishui/article/','/posts/chinese-ai-silicon-valley-power.html','/research-terminal/','/site-map/','/site-guide/','/podcast/education-broligarchy/','/projects/wbw-spacex-mars-cn/']
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
    if path in ('/','/projects/','/posts/','/about.html','/site-map/'):
     assert metrics['scroll']<=width+5,(path,width,'horizontal overflow',metrics)
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
      print('MARS_MOBILE_OVERFLOW_DIAG='+json.dumps(offenders,ensure_ascii=False),flush=True)
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
    if path=='/site-map/':
     page.locator('details.archive').first.locator('summary').click()
     assert page.locator('details.archive').first.get_attribute('open') is not None
     assert page.locator('main a[href^="/src/"]').count()==0
     interaction='directory section -> expand reader links'
    d=page.locator('details.site-local').first
    if d.count():
     d.locator('summary').click();assert d.get_attribute('open') is not None
     d.locator('summary').click()
    assert not errors,(path,width,'script errors',errors)
    if path in ('/','/about.html','/projects/','/projects/shuge-exhibition-v1.0/rooms/room2/'):
     page.screenshot(path=str(out/f'{i}-{width}.png'),full_page=False)
    results.append({'path':path,'viewport':width,'http':response.status,'title':page.title(),'metrics':metrics,'interaction':interaction,'script_errors':errors})
    page.close()
  browser.close()
finally:server.terminate()
report={'checked':len(results),'checks':'PASS','browser':'Chromium / Playwright','external_requests':'blocked for local render checks','remote_account_actions':0,'results':results}
(out/'checks.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps(report,ensure_ascii=False))
print('SCREENSHOTS_AND_REPORT='+str(out))
