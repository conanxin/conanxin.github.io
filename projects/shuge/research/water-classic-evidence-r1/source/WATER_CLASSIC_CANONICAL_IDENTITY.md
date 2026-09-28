# WATER_CLASSIC_CANONICAL_IDENTITY

> 重建《水经注》的 canonical work identity。  
> 来源: v0.7 冻结的 `data/water_classic_pages.json` + `data/works.json` (frozen at SHA `a370721e50f29339...`)。  
> v1.0 frozen baseline = `3a51ef5` (NOT modified).  
> 生成时间: 2026-09-28 11:57 CST。

---

## 1. Canonical Identity Table

| Field | Value | Source / Evidence |
|---|---|---|
| `work_id` | `p124575` | `data/water_classic_pages.json` · 60/60 pages carry `work_id: "p124575"` |
| `post_id` | `124575` | `data/works.json` featured list entry: `post_id=124575, title="水经注"` |
| `edition_id` | 漢書門 内閣文庫 | scan header on page previews (`漢書門`, `内閣文庫`, `番號漢 2355`) |
| `institution` | 国立公文書館 / 内閣文庫 | scan header text (`国立公文書館 Nat`, `内閣文庫`); Japan's National Archives of Japan / Cabinet Library |
| `digital_object` | Kodak 2007 TM calibration scan | scan header markers (`Kodak Gray Scale`, `Kodak.2007 TM:Koda`, `COLORCheCkeR`, `xrite`) |
| `page_objects` | 60 pages (p0001-p0010, 10 unique page_labels) | `data/water_classic_pages.json.pages[]` |

---

## 2. Identity Mismatch With v1.0 Article (Critical Finding)

**v1.0 article 错误地把 `work-shuge-168491` 当作《水经注》canonical work_id.**

| | v1.0 Article Said | Reality (per `data/works.json`) |
|---|---|---|
| `work_id` / `post_id` | `work-shuge-168491` / `168491` | **`168491` = 《园冶》** (Ming dynasty garden design treatise by 计成, 1635) |
| 《水经注》 real post_id | (not used in article) | **`124575`** (Northern Wei era hydrological commentary) |
| Citations used in v1.0 article | `SHUGE:p168491:1`, `:30`, `:68` | These point to **《园冶》** page 1/30/68, NOT 《水经注》 |
| Citations used in v1.0 article | `SHUGE:p211203:*` (天工开物) | Different work (Song 宋应星 1637, technological encyclopedia) |
| Citations used in v1.0 article | `SHUGE:p44159:*` (工程做法) | Different work (Qing 工部, ~1734) |

**Real 《水经注》Citation IDs** (computed from canonical identity):  
- `SHUGE:p124575:1` … `SHUGE:p124575:10` (10 unique page_seq from the 60-page manifest)

**None of these `SHUGE:p124575:*` citation IDs appeared in the v1.0 article body.**

---

## 3. v1.0 Reconciliation

The v1.0 Candidate Article (commit `7738275`, cleanup `3a51ef5`) used:
- `work-shuge-168491` (actually 《园冶》) to attribute 《水经注》 content;
- Citation IDs `SHUGE:p168491:*` to back claims about 水系 / 河水 / 江水 etc.

The v1.0 Claim Support Audit (Step 1 of `SHUGE_DH_V1_0_FINALIZATION_R1`, commit `7738275`) narrowed claim *wording* but **did NOT correct the underlying work-id mapping**. Article text was preserved for v1.0 publication (commit `3a51ef5` is FROZEN).

This R1 reconstruction surfaces the work-id mismatch as a research finding, NOT as a v1.0 modification. The fix is informational and lives in this document.

---

## 4. Hard Boundary Compliance

- ✓ v1.0 frozen baseline (commit `3a51ef5`) NOT modified  
- ✓ `data/water_classic_pages.json` NOT re-OCR'd, NOT modified  
- ✓ Citation IDs `SHUGE:p124575:*` newly derived from existing frozen post_id; not present in v1.0 article  
- ✓ Source files reproducible from frozen data only  

---

*End of WATER_CLASSIC_CANONICAL_IDENTITY.md*
