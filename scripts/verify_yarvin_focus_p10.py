"""P10 browser regression: keyboard dialogs, destination focus and native history."""
from pathlib import Path
import json
ROUTE='/projects/yarvin-moldbug-cn/'

def check_reader_focus(browser,base,width,out=None,collect_failures=False):
    results=[]
    def run(name,action,fragment='',**options):
        page=browser.new_page(viewport={'width':width,'height':900},**options)
        page.set_default_timeout(3000)
        errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
        page.route('**/*',lambda r:r.continue_() if r.request.url.startswith(base) else r.abort())
        try:
            response=page.goto(base+ROUTE+fragment,wait_until='networkidle',timeout=15000)
            assert response and response.status==200,'page did not load'
            if options.get('java_script_enabled',True):
                page.wait_for_function("!!window.__yarvinApp && document.querySelector('#contextGrid')?.children.length > 0")
            action(page)
            assert not errors,f'page errors: {errors}'
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+5'),'horizontal overflow'
            results.append({'case':name,'status':'PASS'})
        except Exception as error:
            results.append({'case':name,'status':'FAIL','detail':str(error)[:450]})
            if not collect_failures:raise AssertionError((width,name,str(error))) from error
        finally:page.close()
    def focused(p,anchor):
        p.wait_for_timeout(120)
        assert p.evaluate('document.activeElement.dataset.readerFocusAnchor')==anchor,p.evaluate("({tag:document.activeElement.tagName,id:document.activeElement.id,hash:location.hash})")
        assert not p.evaluate("!!document.activeElement.closest('[hidden],[inert]')"),'focus hidden or inert'
    def has_focus(locator):return locator.evaluate('el=>el===document.activeElement')
    def search_tabs(p):
        p.locator('#btnSearch').click();p.locator('#searchInput').focus();p.keyboard.press('Shift+Tab')
        assert p.evaluate("document.getElementById('searchOverlay').contains(document.activeElement)"),'Shift+Tab escaped search'
        p.keyboard.press('Tab')
        assert p.evaluate("document.getElementById('searchOverlay').contains(document.activeElement)"),'Tab escaped search'
        p.locator('#searchInput').fill('Patchwork');p.wait_for_function("document.querySelectorAll('#searchResults .search-result').length>0")
        p.locator('#searchResults .search-result').last.focus();p.keyboard.press('Tab')
        assert p.evaluate("document.getElementById('searchOverlay').contains(document.activeElement)"),'last-result Tab escaped search'
    run('search_tab_cycle_with_and_without_results',search_tabs)
    def origin(p):
        link=p.locator('#article p a').first;href=link.get_attribute('href');link.focus();p.keyboard.press('Control+k')
        assert p.locator('#searchOverlay').is_visible();p.keyboard.press('Escape')
        assert p.evaluate('document.activeElement.getAttribute("href")')==href,'Escape did not restore keyboard invoker'
    run('shortcut_escape_returns_to_actual_invoker',origin)
    def isolation(p):
        p.locator('#btnSearch').click()
        assert p.locator('#main').evaluate("el=>!!el.closest('[inert]')"),'background still interactive'
        assert has_focus(p.locator('#searchInput'))
        p.locator('#btnSearchClose').click();assert p.locator('#searchOverlay').is_hidden()
        assert not p.locator('#main').evaluate("el=>!!el.closest('[inert]')")
        assert has_focus(p.locator('#btnSearch'))
    run('modal_background_isolation_and_visible_close',isolation)
    def drawer_loop(p):
        p.locator('#btnToc').click();assert has_focus(p.locator('#btnTocClose'))
        p.keyboard.press('Shift+Tab');assert has_focus(p.locator('#tocListDrawer a').last)
        p.keyboard.press('Tab');assert has_focus(p.locator('#btnTocClose'))
        p.keyboard.press('Escape');assert has_focus(p.locator('#btnToc'))
    run('drawer_tab_cycle_and_cancel',drawer_loop)
    def drawer_target(p):
        p.locator('#btnToc').click();p.locator('#tocListDrawer a[href="#source-ledger-section"]').focus();p.keyboard.press('Enter')
        assert p.locator('#tocDrawer').is_hidden();focused(p,'source-ledger-section')
        assert p.evaluate('location.hash')=='#source-ledger-section'
        p.keyboard.press('Tab');assert p.locator('#source-ledger-section').evaluate('el=>el.contains(document.activeElement)'),'Tab did not continue in target'
    run('drawer_enter_moves_focus_to_destination',drawer_target)
    def search_target(p):
        for attempt in range(2):
            p.locator('#btnSearch').click();p.locator('#searchInput').fill('Patchwork')
            p.wait_for_function("document.querySelectorAll('#searchResults .search-result').length>0")
            target=p.locator('#searchResults .search-result').first.get_attribute('data-href')
            p.locator('#searchInput').press('ArrowDown');p.keyboard.press('Enter')
            assert p.locator('#searchOverlay').is_hidden();focused(p,target)
    run('search_enter_and_repeated_same_fragment',search_target)
    def reload_target(p):
        focused(p,'tri-layer-section');p.reload(wait_until='networkidle');focused(p,'tri-layer-section')
        assert p.evaluate('location.hash')=='#tri-layer-section'
        assert p.locator('#tri-layer-section').evaluate('el=>Math.abs(el.getBoundingClientRect().top)')<300
    run('direct_fragment_and_refresh',reload_target,'#tri-layer-section')
    def history(p):
        p.locator('.reader-transition a[href="#glossary-section"]').first.focus();p.keyboard.press('Enter');focused(p,'glossary-section')
        p.go_back(wait_until='domcontentloaded');focused(p,'mencius-moldbug')
        p.go_forward(wait_until='domcontentloaded');focused(p,'glossary-section')
    run('native_history_back_and_forward',history,'#mencius-moldbug')
    def stacked(p):
        p.locator('#btnToc').click();p.keyboard.press('Control+k')
        count=p.locator('[role="dialog"]:visible').count();assert count==1,f'{count} simultaneous dialogs'
        p.keyboard.press('Escape');assert p.locator('[role="dialog"]:visible').count()==0
        assert not p.locator('#main').evaluate("el=>!!el.closest('[inert]')")
    run('shortcut_cannot_stack_two_modals',stacked)
    def unknown(p):
        assert p.locator('#article .article-h2').count()==9
        assert p.evaluate('location.hash') in ('#%E0%A4%A','#no-such-reader-target')
    run('malformed_fragment_ignored_without_errors',unknown,'#%E0%A4%A')
    run('unknown_fragment_does_not_invent_target',unknown,'#no-such-reader-target')
    def reduced(p):
        assert p.evaluate('getComputedStyle(document.documentElement).scrollBehavior')=='auto','reduced motion still smooth'
    run('reduced_motion_uses_native_instant_scroll',reduced,reduced_motion='reduce')
    def proof(p):
        p.locator('.hero__cta .btn--primary').focus();p.keyboard.press('Enter');focused(p,'mencius-moldbug')
        style=p.evaluate("({width:getComputedStyle(document.activeElement).outlineWidth,style:getComputedStyle(document.activeElement).outlineStyle})")
        assert style['style']!='none' and float(style['width'].replace('px',''))>=2,style
        if out:
            dest=Path(out);dest.mkdir(parents=True,exist_ok=True)
            p.screenshot(path=str(dest/f'yarvin-p10-keyboard-focus-{width}.png'))
            p.keyboard.press('Control+k');p.screenshot(path=str(dest/f'yarvin-p10-search-modal-{width}.png'))
    run('keyboard_destination_has_visible_focus',proof)
    def no_js(p):
        assert p.locator('#article .article-h2').count()==9
        assert p.locator('#tocList a[href^="#"]').count()==21
        p.locator('.hero__cta .btn--primary').click();assert p.evaluate('location.hash')=='#mencius-moldbug'
    run('no_javascript_reading_survives',no_js,java_script_enabled=False)
    return results

def main():
    import argparse,functools,http.server,threading,shutil
    from playwright.sync_api import sync_playwright
    parser=argparse.ArgumentParser();parser.add_argument('root');parser.add_argument('--out',default='/tmp/p10-focus');parser.add_argument('--collect',action='store_true')
    args=parser.parse_args();server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(http.server.SimpleHTTPRequestHandler,directory=args.root))
    threading.Thread(target=server.serve_forever,daemon=True).start();results=[]
    try:
        with sync_playwright() as p:
            exe=shutil.which('google-chrome') or shutil.which('chromium')
            browser=p.chromium.launch(executable_path=exe,headless=True,args=['--no-sandbox']) if exe else p.chromium.launch(headless=True)
            for width in [1440,390]:results.append({'width':width,'cases':check_reader_focus(browser,f'http://127.0.0.1:{server.server_port}',width,Path(args.out),args.collect)})
            browser.close()
    finally:server.shutdown()
    dest=Path(args.out);dest.mkdir(parents=True,exist_ok=True);(dest/'checks.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
    print(json.dumps(results,ensure_ascii=False))
    raise SystemExit(1 if any(c['status']!='PASS' for r in results for c in r['cases']) else 0)
if __name__=='__main__':main()
