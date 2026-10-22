"""P10 testing scope and original-text preservation."""
import hashlib,json,re,unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
PROJECT=ROOT/'projects/yarvin-moldbug-cn'
class FocusP10Tests(unittest.TestCase):
 def test_original_article_unchanged(self):
  s=(PROJECT/'index.html').read_text();a=re.search(r'<article class="article" id="article">[\s\S]*?</article>',s).group(0)
  self.assertEqual(hashlib.sha256(a.encode()).hexdigest(), '69654406210aa92b8adb1ac2a23a78173ff6df6d51833fa0a381310faaad34bd')
 def test_pending_drafts_unchanged(self):
  p=json.loads((PROJECT/'content/preface-draft-p7.json').read_text())
  self.assertEqual(p['audit']['editorial_decisions_approved'],0)
  self.assertEqual(p['audit']['frozen_article_edits_applied'],0)
 def test_browser_focus_suite_is_in_real_ci_path(self):
  s=(ROOT/'scripts/verify_site_browser.py').read_text()
  self.assertIn('from verify_yarvin_focus_p10 import check_reader_focus',s)
  self.assertIn('focus_checks=check_reader_focus(browser,base,width,out,collect_failures=True)',s)
 def test_focus_suite_contains_history_and_nojs_cases(self):
  s=(ROOT/'scripts/verify_yarvin_focus_p10.py').read_text()
  for name in ['native_history_back_and_forward','no_javascript_reading_survives','shortcut_cannot_stack_two_modals','search_enter_and_repeated_same_fragment']:
   self.assertIn(name,s)
if __name__=='__main__':unittest.main()
