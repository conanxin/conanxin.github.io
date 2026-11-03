"""Check evidence consistency only; these tests do not certify ancient glyphs."""
import hashlib
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
PATH = ROOT / 'projects/site-design-lab/shuge-source-crosswalk/page380-p5c-transcription.json'

class P5CArtifactPresence(unittest.TestCase):
    def test_artifact_exists(self):
        self.assertTrue(PATH.is_file(), 'P5C transcription artifact is missing')

@unittest.skipUnless(PATH.is_file(), 'Artifact not created yet')
class P5CTranscriptionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = json.loads(PATH.read_text(encoding='utf-8'))

    def test_original_layout_bytes_reconstruct_exactly(self):
        e = self.data['layout_evidence']
        raw = json.dumps(e['snapshot'], ensure_ascii=False, indent=1).encode()
        self.assertEqual(len(raw), 4242)
        self.assertEqual(hashlib.sha256(raw).hexdigest(),
                         '30c7076a7c5586f8291d37e761a2e2461707363d3541406cf8446db40600a6b7')
        self.assertEqual(e['raw_file_sha256'], hashlib.sha256(raw).hexdigest())

    def test_raw_blocks_reproduce_exact_database_text(self):
        d = self.data
        text = '\n'.join(x['text'] for x in d['layout_evidence']['snapshot']['lines'])
        self.assertEqual(text, d['raw_ocr']['text'])
        self.assertEqual(hashlib.sha256(text.encode()).hexdigest(), d['source']['ocr_sha256'])
        self.assertEqual(len(text), 202)
        self.assertEqual(len(text.replace('\n','').replace(' ','')), 188)
        self.assertEqual(len(text.splitlines()), 15)

    def test_coordinates_have_explicit_resizing_frame(self):
        d = self.data
        resize = d['layout_evidence']['original_to_input_resize']
        w,h = d['source']['image_dimensions']
        r = resize['max_side'] / max(w,h)
        self.assertEqual([int(w*r),int(h*r)], [1245,2000])
        self.assertEqual(resize['input_dimensions'], [1245,2000])
        self.assertEqual(resize['back_projection_scale'], [1600/1245,2570/2000])
        for block in d['layout_evidence']['snapshot']['lines']:
            for x,y in block['bbox']:
                self.assertTrue(0<=x<=1245 and 0<=y<=2000)
        for col in d['columns']:
            x0,y0,x1,y1 = col['region_original_xyxy']
            self.assertTrue(0<=x0<x1<=w and 0<=y0<y1<=h)

    def test_nine_columns_are_ordered_right_to_left(self):
        cols = self.data['columns']
        self.assertEqual([c['id'] for c in cols], [f'C{i:02d}' for i in range(1,10)])
        self.assertEqual([c['reading_order'] for c in cols], list(range(1,10)))
        centers = [(c['region_original_xyxy'][0]+c['region_original_xyxy'][2])/2 for c in cols]
        self.assertEqual(centers,sorted(centers,reverse=True))
        self.assertEqual([c['primary_layout_block_index'] for c in cols], [8,7,6,10,11,4,3,2,1])
        for col in cols:
            self.assertTrue(col['text_draft'])
            self.assertEqual(col['status'],'AI_TRANSCRIPTION_DRAFT')

    def test_every_old_ocr_block_is_accounted_for(self):
        groups = self.data['layout_block_classification']
        indices = [i for group in groups.values() for i in group]
        self.assertEqual(sorted(indices),list(range(15)))
        self.assertEqual(len(indices),len(set(indices)))
        self.assertEqual(groups['cross_column_mixed_indices'],[5])
        self.assertEqual(self.data['columns'][3]['cross_column_fragment']['restored_initial_character'],'日')

    def test_notes_and_book_labels_are_not_silently_body_text(self):
        d = self.data
        self.assertEqual(len(d['inline_notes']),1)
        note=d['inline_notes'][0]
        self.assertEqual(note['after_column'],'C04')
        self.assertEqual(note['layout_block_indices'],[5,9,14])
        self.assertEqual(note['status'],'JOIN_DRAFT_REQUIRES_REVIEW')
        self.assertEqual([x['text'] for x in d['non_body']],['天工開物','卷下','五十'])
        body=''.join(c['text_draft'] for c in d['columns'])
        self.assertNotIn('卷下',body)
        self.assertNotIn('必用山河',body)

    def test_all_uncertain_readings_are_explicit(self):
        d=self.data
        regions={c['id']:c['text_draft'] for c in d['columns']}
        regions.update({n['id']:n['text_draft'] for n in d['inline_notes']})
        self.assertEqual(len(d['uncertain_readings']),4)
        for u in d['uncertain_readings']:
            self.assertIn(u['reading'],regions[u['region']])
            self.assertTrue(u['reason'])
        self.assertTrue(d['columns'][5]['text_draft'].endswith('出離'))
        self.assertIn('出甑',d['uncertain_readings'][2]['alternatives'])

    def test_draft_is_not_promoted_to_human_review_or_deployment(self):
        d=self.data;s=d['summary']
        self.assertEqual(s['complete_page_drafts'],1)
        self.assertEqual(s['human_approved_pages'],0)
        self.assertEqual(s['final_scholarly_claims_verified'],0)
        for k in ('source_database_modified','source_ocr_modified','source_image_modified','merged','deployed'):
            self.assertIs(s[k],False)
        self.assertEqual(d['edition_scope']['same_physical_copy'],'UNVERIFIED')
        self.assertEqual(d['edition_scope']['same_digitization'],'UNVERIFIED')
        self.assertIs(d['edition_scope']['new_cross_ark_mapping_created'],False)

    def test_identifiers_are_distinct_and_source_pinned(self):
        s=self.data['source']
        self.assertEqual(s['citation_id'],'SHUGE:p211203:1338')
        self.assertEqual(s['page_object_id'],1338)
        self.assertEqual(s['page_index'],380)
        self.assertEqual(s['printed_leaf'],'卷下 五十')
        self.assertEqual(s['ocr_row_id'],1018)
        self.assertEqual(s['image_sha256'],'db7422280e2a051ea2beea3cff0f5fb46d74163ee8a107b4c0dc60941cbcf838')

if __name__=='__main__':
    unittest.main()
