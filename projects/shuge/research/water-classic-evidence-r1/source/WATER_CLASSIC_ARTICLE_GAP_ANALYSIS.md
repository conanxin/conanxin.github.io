# WATER_CLASSIC_ARTICLE_GAP_ANALYSIS

> Comparing v1.0 Candidate Article's 10 claims (commit `3a51ef5`, frozen) against new R1 evidence from `data/water_classic_pages.json` (v0.7 frozen, post_id=124575).
> v1.0 frozen baseline = `3a51ef5` (NOT modified).

---

## 1. v1.0 Article's 10 Claims

Source: `data/article_water_classic_dossier.json` (sha256=da4fd267...; frozen at 3a51ef5).

| v1.0 claim | Topic | v1.0 citation | Post-narrowing support_status (v1.0 audit) |
|---|---|---|---|
| cl-1.1 | Northern Wei hydrological work profile | (post_id-keyed) | SUPPORTED (dynasty only, with explicit limitation) |
| cl-2.1 | physical-history chain | (none) | METADATA_ONLY (now a methodological limitation, not a factual claim) |
| cl-3.1 | water name comparisons | SHUGE:p168491:30 | SUPPORTED (with explicit limitation) |
| cl-3.2 | name-equivalence 河水=黄河 | (research gap) | METADATA_ONLY (research gap, not factual claim) |
| cl-4.1 | visual contrast observation | SHUGE:p44159:552 | SUPPORTED (observation part) + EXPLICIT_LIMITATION (comparison part) |
| cl-4.2 | continuity observation | SHUGE:p44159 (工程做法) | SUPPORTED (observation part) + EXPLICIT_LIMITATION (continuity part) |
| cl-5.1 | research workflow claim | (none) | METADATA_ONLY |
| cl-6.1 | research framework claim | (none) | METADATA_ONLY |
| cl-7.1 | v1.0 boundary claim | (none) | METADATA_ONLY |
| cl-8.1 | article status claim | (none) | METADATA_ONLY |

---

## 2. Mapping v1.0 Claims → Real 《水经注》 Evidence

| v1.0 claim | Real 《水经注》 evidence (post_id=124575) | New Evidence Status |
|---|---|---|
| **cl-1.1** Northern Wei hydrological work profile | Real canonical 《水经注》 = `post_id=124575` (per `data/works.json`); **v1.0 cited wrong work_id 168491** (which is 《园冶》). | **WORK-ID MISMATCH**. Real 《水经注》 exists, but v1.0 did not cite it. cl-1.1's claim *content* (Northern Wei era, hydrological focus) is supported by `post_id=124575` metadata, but the **citation_id chain** v1.0 used (`SHUGE:p168491:*`) does NOT point to it. |
| **cl-2.1** physical-history chain | The "chain" framing — which claims that water systems described in 《水经注》 historically map onto modern rivers — is a historiographical / methodological assertion that **cannot be supported by river-region OCR alone**. River-region OCR claims (cl-001, cl-006, cl-010, cl-013, cl-014) describe what 《水经注》 says about individual rivers at specific times; they do NOT establish the "chain" thesis. | **UNRESOLVED METADATA / HISTORIOGRAPHICAL GAP**. cl-2.1 remains a methodological framing, not a page-evidenced factual claim. **River-region OCR claims are NOT considered support for cl-2.1.** |
| **cl-3.1** water name comparisons | v1.0 cited `SHUGE:p168491:30` (《园冶》, garden treatise). No real 《水经注》 page in current 60-page corpus covers name-comparison claims. | **PARTIAL — page evidence not available.** Real 《水经注》 would have name-equivalence content, but not in current corpus scope. |
| **cl-3.2** name-equivalence 河水=黄河 | Not in current OCR scope; no page covers this specific equivalence. | **GAP REMAINS** (per v1.0 audit). |
| **cl-4.1** visual contrast observation | v1.0 cited `SHUGE:p44159:552` (《工程做法》, Qing dynasty architecture). Not 《水经注》 at all. | **WRONG WORK**. Re-source from `SHUGE:p124575:*` if claim retains in future v2.0. |
| **cl-4.2** continuity observation | Same as cl-4.1. | **WRONG WORK**. |
| **cl-5.1** research workflow | n/a (methodological). | unchanged |
| **cl-6.1** research framework | n/a (methodological). | unchanged |
| **cl-7.1** v1.0 boundary | n/a (project boundary). | unchanged |
| **cl-8.1** article status | n/a (status statement). | unchanged |

---

## 3. Work-ID Mismatch Detail

The single largest gap between v1.0 article and real 《水经注》 evidence is the **work-id misattribution**:

- v1.0 article used **`work-shuge-168491`** to attribute 《水经注》 content.
- `data/works.json` (featured list) confirms:
  - `post_id=124575` → title="水经注" (Northern Wei hydrological commentary by 郦道元)
  - `post_id=168491` → title="园冶" (Ming dynasty garden design by 计成, 1635)
- The `SHUGE:p168491:1`, `:30`, `:68` citations used in v1.0 article point to **《园冶》 pages**, not 《水经注》 pages.
- Real 《水经注》 citations should be `SHUGE:p124575:<seq>`.

This was NOT a v1.0 audit oversight — the v1.0 audit (`SHUGE_DH_V1_0_FINALIZATION_R1`, commit `7738275`) narrowed claim *wording* but treated `work-shuge-168491` as given. The work-id mapping error surfaces here for the first time.

---

## 4. cl-2.1 — Preserved As Gap (NOT supported by river-region OCR claims)

cl-2.1 in v1.0 article reads (post-narrowing):
> "physical-history chain" — converted to **methodological limitation**, not asserting chain as factual.

The new R1 evidence provides **18 evidence-first claims** (14 SUPPORTED, 3 PARTIAL, 1 NOT_SUPPORTED) on:
- 江水 / 公安 / 华容 (cl-001 to cl-005)
- 河水 / 野王 / 修武 (cl-006 to cl-009)
- 易水 / 范陽 / 容城 (cl-010 to cl-012)
- 汾水 / 代城 (cl-013)
- 汝水 / 霍陽 / 梁 (cl-014, cl-015)
- 漢獻帝 / 山陽 / 吴陂 (cl-016, cl-017)
- structural counts (cl-018, NOT_SUPPORTED)

**None of these claims support cl-2.1's "physical-history chain" thesis.** They describe individual river-system geographic content. Whether 《水经注》's descriptions *historically map* onto modern rivers is a separate historiographical question that requires:
- Full-page OCR (currently QUEUED, not done)
- Cross-reference with modern hydrological data
- Historical periodization analysis

**Conclusion:** cl-2.1 remains **unresolved metadata / historiographical gap**, NOT closed by R1 evidence.

---

## 5. New Evidence That Does NOT Close v1.0 Gaps

| v1.0 gap | New R1 evidence | Closes gap? |
|---|---|---|
| Real 《水经注》 canonical identity unknown to v1 | cl-1.1 corrected via canonical identity doc (post_id=124575) | ✓ YES (identity correction; v1.0 wording unchanged because baseline frozen) |
| cl-2.1 chain thesis unresolved | 18 evidence-first claims; none support chain thesis | ✗ NO (gap preserved) |
| cl-3.1, cl-4.1, cl-4.2 wrong-work citations | Real 《水经注》 claims with correct `SHUGE:p124575:*` IDs available for future v2.0 | partial — re-sourcing required |
| cl-3.2 河水=黄河 equivalence | Not in current OCR scope | ✗ NO |

---

## 6. Forward-Looking Notes (NOT applied to v1.0)

If a future v2.0 article were to re-source its 《水经注》 claims:
- Replace `SHUGE:p168491:*` → `SHUGE:p124575:*` (18 evidence-first claims available)
- Treat cl-2.1 as **historiographical framework**, not factual claim — keep as limitation
- Expand OCR coverage from 60 → more pages (currently QUEUED) to close remaining gaps

These are forward-looking and NOT applied to v1.0 (which is FROZEN).

---

## 7. Hard Boundaries

- ✓ v1.0 frozen baseline (commit `3a51ef5`) NOT modified
- ✓ No new research claims added to v1.0 article
- ✓ No OCR run
- ✓ No resource downloads

---

*End of WATER_CLASSIC_ARTICLE_GAP_ANALYSIS.md*
