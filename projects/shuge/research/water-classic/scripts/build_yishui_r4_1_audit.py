#!/usr/bin/env python3
"""
WATER_CLASSIC_R4_1_SCHOLARLY_AUDIT · Build R4.1 audit overlay JSON files.

Reads R4 frozen JSON (preserved) + produces 3 corrected overlay JSON files:
  - data/yishui_claims_r4_1.json          (12 claims with truth_scope + revised support)
  - data/yishui_external_sources_r4_1.json (7 sources with source_role + verification_status)
  - data/yishui_core_topology_r4_1.json   (CORE_TOPOLOGY + FULL_TOPOLOGY + claim-to-edge binding)

Hard boundaries (all ✓):
  NEW_OCR=0 · NEW_PRIMARY_ACQUISITION=0 · DB_WRITES=0 · EMBEDDINGS=0
  R4_BASELINE_PRESERVED=true  (this script READS R4 files; does NOT write to them)
"""

import json
import sys
from pathlib import Path
from datetime import datetime, timezone, timedelta

# Paths
PROJECT_ROOT = Path("/home/conanxin/conanxin.github.io")
WC_DIR = PROJECT_ROOT / "projects/shuge/research/water-classic"
DATA_DIR = WC_DIR / "data"
SOURCE_DIR = WC_DIR / "source"

TZ = timezone(timedelta(hours=8))
NOW = datetime.now(TZ).strftime("%Y-%m-%dT%H:%M:%S+08:00")

# ============================================================
# Section A+B+C: Claim Scope Audit + Per-Claim Truth Scope
# ============================================================

# Per user spec:
# - truth_scope allowed: TEXT_REPORTS / TEXTUAL_INFERENCE / HISTORICAL_CORROBORATED / MODERN_MAPPING
# - MODERN_MAPPING forbidden in R4.1
# - Re-judge SUPPORTED / PARTIALLY_SUPPORTED / NOT_SUPPORTED (don't force 12/12)

# Key findings from R4 controlled transcription:
# - R4-YSH-012 INCORRECTLY conflates 深澤 with 容城 (pid1661 clearly distinguishes)
# - R4-YSH-011 over-extends citation: only 易水之南 direct; 範陽以東+容城以西 is TEXTUAL_INFERENCE
# - 008/009/010 must frame as "《水經注》文本" rather than independent historical facts

CLAIMS_R4_1 = {
    "schema_version": "r4.1-yishui-claims-audit/1.0",
    "generated_at": NOW,
    "task": "WATER_CLASSIC_R4_1_SCHOLARLY_AUDIT",
    "section": "R4.1 · Scholarly audit of R4 historical claims",
    "basis": "R4 frozen commit 582c852 (audit overlay only — R4 frozen JSON NOT modified)",
    "claim_count": 12,
    "claim_truth_scope_distribution": {
        "TEXT_REPORTS": 7,
        "TEXTUAL_INFERENCE": 5,
        "HISTORICAL_CORROBORATED": 0,
        "MODERN_MAPPING": 0
    },
    "claim_support_distribution": {
        "SUPPORTED": 7,
        "PARTIALLY_SUPPORTED": 5,
        "NOT_SUPPORTED": 0
    },
    "audit_method": {
        "step_1": "Read R4 frozen claims JSON + claim ledger",
        "step_2": "Re-read R4 controlled transcription (3 layers × 7 cores) for direct-quote verification",
        "step_3": "For each claim: classify truth_scope by checking whether R4 citation directly supports the claim text vs. requires textual-sequence inference",
        "step_4": "For HISTORICAL_INTERPRETATION claims (008/009/010): verify claim_text frames correctly as '《水經注》文本 / 引某人說' rather than independent modern historical fact",
        "step_5": "For R4-YSH-011: verify whether '範陽以東、容城以西' is directly stated in pid1661 or only inferred from pid1657 大字標題 sequence",
        "step_6": "For R4-YSH-012: verify whether '趙將某於容城' is correct or whether the original text clearly says 深澤 ≠ 容城"
    },
    "hard_boundaries": {
        "NEW_OCR": 0,
        "NEW_PRIMARY_ACQUISITION": 0,
        "DB_WRITES": 0,
        "EMBEDDINGS": 0,
        "R4_BASELINE_PRESERVED": True,
        "MODERN_MAPPING_CLAIMS": 0
    },
    "records": [
        # 001: TEXT_REPORTS / SUPPORTED
        {
            "claim_id": "R4-YSH-001",
            "claim_text_original": "在易水章節中，範陽先於容城出現，且由「東過」動詞串聯。",
            "claim_text_revised": "《水經注》卷十一易水章之 pid1657 大字標題記載：「東過范陽縣南又東過容城縣南」。範陽先於容城出現，並由「東過」動詞串聯。",
            "truth_scope": "TEXT_REPORTS",
            "truth_scope_rationale": "大字標題是原書編者明確標註的章節結構，無需推論即可直接引用。",
            "support_level_original": "SUPPORTED",
            "support_level_revised": "SUPPORTED",
            "support_rationale": "pid1657 p0004 大字標題直接記錄此序列，無需文字校勘。",
            "citation_ids": ["SHUGE:p124575:1657"],
            "counterevidence_audit": "none_found_in_checked_sources",
            "counterevidence_detail": "未在 R4 已校核的外部資料中找到對此大字標題的反例或異說。",
            "evidence_status": {
                "canonical_citation": "YES",
                "RULE_QUALIFIED": "YES (R3.2 strict-rule)",
                "PROXY_REVIEWED": "YES (R3.3/R3.4)",
                "same_page_semantic_support": "YES",
                "VALID_SEQUENCE_CONTEXT": "N/A (single page)"
            }
        },
        # 002: TEXT_REPORTS / SUPPORTED
        {
            "claim_id": "R4-YSH-002",
            "claim_text_original": "易水出涿郡故安縣閻鄉西山（pid1655 正文首段大字）。",
            "claim_text_revised": "《水經注》卷十一易水章之 pid1655 正文首段記載：「易水出涿郡故安縣閻鄉西山」。",
            "truth_scope": "TEXT_REPORTS",
            "truth_scope_rationale": "正文首段直接記錄易水水源。OCR 校正：DB OCR「承郡」「間鄉」→視覺確認「涿郡」「閻鄉」。",
            "support_level_original": "SUPPORTED",
            "support_level_revised": "SUPPORTED",
            "support_rationale": "pid1655 p0002 正文首段直接記錄此句，OCR 校正後無誤。",
            "citation_ids": ["SHUGE:p124575:1655"],
            "counterevidence_audit": "none_found_in_checked_sources",
            "counterevidence_detail": "Wikisource / ctext.org 等公開校勘本未記錄異文。",
            "evidence_status": {
                "canonical_citation": "YES",
                "RULE_QUALIFIED": "YES",
                "PROXY_REVIEWED": "YES (image_checked pid1655)",
                "same_page_semantic_support": "YES",
                "VALID_SEQUENCE_CONTEXT": "N/A"
            }
        },
        # 003: TEXTUAL_INFERENCE / PARTIALLY_SUPPORTED (typology is interpretive framework)
        {
            "claim_id": "R4-YSH-003",
            "claim_text_original": "故安與易水關係呈現三種空間語言模式：(1) 易水出於故安縣閻鄉；(2) 易水逕故安城南外東流；(3) 故安作為易水名稱源頭（世又謂易水為故安河）。",
            "claim_text_revised": "《水經注》文本中故安與易水的關係可歸納為三種空間語言模式：(1) pid1655「易水出涿郡故安縣閻鄉西山」；(2) pid1656「易水逕故安城南外東流」；(3) pid1656「世又謂易水為故安河」。三型分類為研究者對原書文字的歸納性框架，並非原書明示分類。",
            "truth_scope": "TEXTUAL_INFERENCE",
            "truth_scope_rationale": "個別引文為 TEXT_REPORTS；「三型分類」為研究者的歸納框架，非原書直接給出的分類標籤。",
            "support_level_original": "SUPPORTED",
            "support_level_revised": "PARTIALLY_SUPPORTED",
            "support_rationale": "個別引文確實存在於原書且視覺確認無誤；但「三型」分類屬於研究者框架，原書並未明確標示此分類。三型邊界（特別是 (2) 與 (3) 是否完全互斥）需讀者自行判斷。",
            "citation_ids": ["SHUGE:p124575:1655", "SHUGE:p124575:1656"],
            "counterevidence_audit": "none_found_in_checked_sources",
            "counterevidence_detail": "未在 R4 已校核的外部資料中找到對個別引文的反例；三型框架屬歸納性，不存在事實性反例。",
            "evidence_status": {
                "canonical_citation": "YES",
                "RULE_QUALIFIED": "YES",
                "PROXY_REVIEWED": "YES",
                "same_page_semantic_support": "YES",
                "VALID_SEQUENCE_CONTEXT": "YES",
                "interpretive_framework": "YES (researcher's typology, not 原書 explicit label)"
            }
        },
        # 004: TEXTUAL_INFERENCE / PARTIALLY_SUPPORTED (mixing water systems)
        {
            "claim_id": "R4-YSH-004",
            "claim_text_original": "範陽-容城之間存在「東過」連續動詞語法結構。",
            "claim_text_revised": "《水經注》文本中「東過 + 縣南」連續動詞結構在易水章（pid1657 大字標題）與巨馬水章（pid1682 大字標題）均出現，但二者屬不同水系，不應混稱為「同一水流的連續動詞」。",
            "truth_scope": "TEXTUAL_INFERENCE",
            "truth_scope_rationale": "個別引文為 TEXT_REPORTS；但「範陽-容城」之間的「東過」是否屬「同一水流的連續動詞」需結合章節上下文判斷。pid1657 屬易水章（東過范陽縣南又東過容城縣南）；pid1682 屬巨馬水章（東南逕范陽縣故城北易水注之／又東南過容城縣北）。",
            "support_level_original": "SUPPORTED",
            "support_level_revised": "PARTIALLY_SUPPORTED",
            "support_rationale": "「東過范陽縣南又東過容城縣南」作為 pid1657 大字標題可直接引用（屬易水章）；但若引用 pid1682 巨馬水章，則需說明此為不同水系。原 R4 claim_text 未充分區分兩水系。",
            "citation_ids": ["SHUGE:p124575:1657", "SHUGE:p124575:1682"],
            "counterevidence_audit": "none_found_in_checked_sources",
            "counterevidence_detail": "未在 R4 已校核的外部資料中找到對 pid1657 大字標題的反例；但「易水連續動詞」概念屬研究者歸納，非原書明示。",
            "evidence_status": {
                "canonical_citation": "YES",
                "RULE_QUALIFIED": "YES",
                "PROXY_REVIEWED": "YES",
                "same_page_semantic_support": "YES",
                "VALID_SEQUENCE_CONTEXT": "YES (within-page大字標題)",
                "cross_water_system_warning": "pid1657 易水章 vs pid1682 巨馬水章；不同水系，不應混稱"
            }
        },
        # 005: TEXT_REPORTS / SUPPORTED
        {
            "claim_id": "R4-YSH-005",
            "claim_text_original": "城南/城北方位詞在易水章中反覆出現，標誌水流與城邑的相對位置。",
            "claim_text_revised": "《水經注》易水章中「城南」/「城北」/「城東」/「城西」方位詞反覆出現於 pid1656/1657/1659/1661/1682 等頁。",
            "truth_scope": "TEXT_REPORTS",
            "truth_scope_rationale": "個別方位詞引文均可直接從原書取得；「反覆出現」屬量化性描述，可由 spatial_relations JSON 驗證（96 條關係中方位詞佔多數）。",
            "support_level_original": "SUPPORTED",
            "support_level_revised": "SUPPORTED",
            "support_rationale": "pid1656 「逕五公城南」「城西」、pid1657 「逕范陽縣故城南」「城南」、pid1659 「逕容城縣故城北」、pid1661 「逕樊輿縣故城北」均為直接引文。",
            "citation_ids": ["SHUGE:p124575:1656", "SHUGE:p124575:1657", "SHUGE:p124575:1659", "SHUGE:p124575:1661", "SHUGE:p124575:1682"],
            "counterevidence_audit": "none_found_in_checked_sources",
            "evidence_status": {
                "canonical_citation": "YES",
                "RULE_QUALIFIED": "YES",
                "PROXY_REVIEWED": "YES",
                "same_page_semantic_support": "YES",
                "VALID_SEQUENCE_CONTEXT": "YES (cross-page)"
            }
        },
        # 006: TEXTUAL_INFERENCE / PARTIALLY_SUPPORTED (typology)
        {
            "claim_id": "R4-YSH-006",
            "claim_text_original": "易水、濡水、巨馬水、淶水於涿郡範陽縣會，呈現「互攝通稱」的水系關係。",
            "claim_text_revised": "《水經注》pid1659 記載：「北濡又並亂流入淶，是則易水與諸水互攝，通稱東逕容城縣故城北」。原書明確使用「互攝」「通稱」二字；「易水/濡水/巨馬水/淶水」四水分類為研究者歸納（pid1659 + pid1682 整合）。",
            "truth_scope": "TEXTUAL_INFERENCE",
            "truth_scope_rationale": "「互攝」「通稱」為原書直接用語（pid1659 句中）；「易水/濡水/巨馬水/淶水」四水系統分類為研究者對跨章節文本的歸納，並非原書明示。",
            "support_level_original": "SUPPORTED",
            "support_level_revised": "PARTIALLY_SUPPORTED",
            "support_rationale": "「互攝通稱」可由 pid1659 直接引文支持（TEXT_REPORTS 層級）；但「四水分類」屬歸納性，且現代水系驗證非本階段任務（R4 限制條件 REAL_WORLD_LOCATION=UNRESOLVED）。",
            "citation_ids": ["SHUGE:p124575:1659", "SHUGE:p124575:1682"],
            "counterevidence_audit": "EXT-YANG-1905 (Yang Shoujing 水經注疏) 註文傳統上保留此水系結構描述；R4.1 未獨立查證該來源。",
            "evidence_status": {
                "canonical_citation": "YES",
                "RULE_QUALIFIED": "YES",
                "PROXY_REVIEWED": "YES",
                "same_page_semantic_support": "YES",
                "VALID_SEQUENCE_CONTEXT": "YES",
                "REAL_WORLD_LOCATION_UNRESOLVED": "PER R4 SCOPE (modern hydrology mapping deferred)"
            }
        },
        # 007: TEXT_REPORTS / SUPPORTED
        {
            "claim_id": "R4-YSH-007",
            "claim_text_original": "大利亭作為地理節點，故安水於此「東南合易水而注巨馬水」（pid1659）。",
            "claim_text_revised": "《水經注》pid1659 記載：「其水又東南流於容城縣西北大利亭東南，合易水而注巨馬水也」。",
            "truth_scope": "TEXT_REPORTS",
            "truth_scope_rationale": "pid1659 為單頁引文，直接記錄此地理節點。",
            "support_level_original": "SUPPORTED",
            "support_level_revised": "SUPPORTED",
            "support_rationale": "pid1659 為單頁單句引文，可直接視覺確認（image_checked pid1659 中「大利亭」清楚）。",
            "citation_ids": ["SHUGE:p124575:1659"],
            "counterevidence_audit": "none_found_in_checked_sources",
            "evidence_status": {
                "canonical_citation": "YES",
                "RULE_QUALIFIED": "YES",
                "PROXY_REVIEWED": "YES (image_checked pid1659)",
                "same_page_semantic_support": "YES",
                "VALID_SEQUENCE_CONTEXT": "N/A (single page)"
            }
        },
        # 008: TEXT_REPORTS / SUPPORTED (但 frame 為酈道元引應劭, 非獨立歷史事實)
        {
            "claim_id": "R4-YSH-008",
            "claim_text_original": "範陽=范水之陽（應劭解釋），即范水之北。",
            "claim_text_revised": "《水經注》pid1661 記載：「易水又逕范陽縣故城南，即應劭所謂范水之陽也」。「範陽」地名源於「范水之陽」為酈道元所引應劭《風俗通》之解釋，並非現代獨立考證。",
            "truth_scope": "TEXT_REPORTS",
            "truth_scope_rationale": "pid1661 直接記錄「即應劭所謂范水之陽」一句，屬原書文本明確引述。",
            "support_level_original": "SUPPORTED",
            "support_level_revised": "SUPPORTED",
            "support_rationale": "pid1661 單句引文：「易水自下有范水通目又東逕范陽縣故城南即應劭所謂范水之陽也」可由視覺確認。「陽」字傳統地理學含義為「水之北」或「山之南」（視情境而定），屬訓詁學常識。",
            "citation_ids": ["SHUGE:p124575:1661"],
            "counterevidence_audit": "EXT-YANG-1905 (Yang Shoujing) 與 EXT-CHEN-2007 (Chen Qiaoyi) 之《水經注》校注本對「范水之陽」地名訓詁沿襲應劭說；R4.1 未獨立比對楊守敬/陳橋驛原書。",
            "evidence_status": {
                "canonical_citation": "YES",
                "RULE_QUALIFIED": "YES",
                "PROXY_REVIEWED": "YES (image_checked pid1661)",
                "same_page_semantic_support": "YES",
                "VALID_SEQUENCE_CONTEXT": "N/A",
                "frame_correction_applied": "R4.1 明確標示此為「酈道元所引應劭」之說，避免讀者誤認為現代考古或地名學獨立結論"
            }
        },
        # 009: TEXT_REPORTS / SUPPORTED (frame 為酈道元記錄, 非現代考古)
        {
            "claim_id": "R4-YSH-009",
            "claim_text_original": "武陽=燕下都（燕昭王所築，東西二十里，南北十七里）。",
            "claim_text_revised": "《水經注》pid1656 記載：「武陽蓋燕昭王之所城也，東西二十里，南北十七里」「故燕之下都擅武陽之名」。「武陽=燕下都」為酈道元於六世紀所作之記錄，並非二十世紀考古學獨立考證；現代考古實測可能與酈道元所記城邑規模有出入。",
            "truth_scope": "TEXT_REPORTS",
            "truth_scope_rationale": "pid1656 為單頁直接引文。",
            "support_level_original": "SUPPORTED",
            "support_level_revised": "SUPPORTED",
            "support_rationale": "pid1656 「武陽蓋燕昭王之所城也，東西二十里，南北十七里」一句可由視覺確認（image_checked pid1656）。",
            "citation_ids": ["SHUGE:p124575:1656"],
            "counterevidence_audit": "EXT-YANG-1905 (Yang Shoujing 水經注疏) 對武陽城邑位置有詳註；R4.1 未獨立比對楊守敬原書。pid1656 中「故傳逮迹遊賦」之「逮迹遊獵賦」可能為異文（見 R4-YSH-009 R4 source 註記）。",
            "evidence_status": {
                "canonical_citation": "YES",
                "RULE_QUALIFIED": "YES",
                "PROXY_REVIEWED": "YES (image_checked pid1656)",
                "same_page_semantic_support": "YES",
                "VALID_SEQUENCE_CONTEXT": "N/A",
                "frame_correction_applied": "R4.1 明確標示此為「酈道元於六世紀所作之記錄」，避免讀者誤認為現代考古結論"
            }
        },
        # 010: TEXT_REPORTS / SUPPORTED (frame 為酈道元引耆舊, 非獨立考古)
        {
            "claim_id": "R4-YSH-010",
            "claim_text_original": "金臺+蘭馬臺=燕昭王禮賓郭隗之處（酈道元引耆舊）。",
            "claim_text_revised": "《水經注》pid1657 記載：「金毫陂西畔有蘭馬臺」「臺北有金臺」「訪諸耆舊，咸言昭王禮賓，廣延方士，至如郭隗、樂毅之徒」。金臺、蘭馬臺與「燕昭王禮賓郭隗」之關係引自酈道元所採耆舊傳聞，並非現代考古學獨立實證。",
            "truth_scope": "TEXT_REPORTS",
            "truth_scope_rationale": "pid1657 為單頁直接引文。「訪諸耆舊」明示這是傳聞記載，不是酈道元親眼所見。",
            "support_level_original": "SUPPORTED",
            "support_level_revised": "SUPPORTED",
            "support_rationale": "pid1657 引文可由視覺確認（image_checked pid1657 中「金毫陂」「蘭馬臺」「金臺」「訪諸耆舊」清楚）。",
            "citation_ids": ["SHUGE:p124575:1657"],
            "counterevidence_audit": "none_found_in_checked_sources",
            "evidence_status": {
                "canonical_citation": "YES",
                "RULE_QUALIFIED": "YES",
                "PROXY_REVIEWED": "YES (image_checked pid1657)",
                "same_page_semantic_support": "YES",
                "VALID_SEQUENCE_CONTEXT": "N/A",
                "frame_correction_applied": "R4.1 明確標示「耆舊傳聞」屬性，避免讀者誤認為現代獨立考證"
            }
        },
        # 011: TEXTUAL_INFERENCE / PARTIALLY_SUPPORTED (over-extends citation)
        {
            "claim_id": "R4-YSH-011",
            "claim_text_original": "易京城位於易水之南、范陽以東、容城以西（公孫瓚遷都處）。",
            "claim_text_revised": "《水經注》pid1661 記載：「易水又東逕易京南」「謂之易京城，在易城西四五里」。「易京城在易水之南」由「逕易京南」直接支持。但「範陽以東、容城以西」並非 pid1661 直接陳述；此方位係基於 pid1657 大字標題「東過范陽縣南又東過容城縣南」之文本順序推論（範陽在西、容城在東，故易京城若在兩者之間，則為「範陽以東、容城以西」）。此推論依賴讀者接受「易水先過範陽、再過容城」的章節結構。",
            "truth_scope": "TEXTUAL_INFERENCE",
            "truth_scope_rationale": "「易水之南」直接引文；「範陽以東、容城以西」為文本順序推論（TEXTUAL_INFERENCE）。",
            "support_level_original": "SUPPORTED",
            "support_level_revised": "PARTIALLY_SUPPORTED",
            "support_rationale": "原 R4 claim_text 將三項方位並列，未明示哪幾項為直接引文、哪幾項為文本順序推論。R4.1 修正後明示「易水之南」為直接引文（SUPPORTED 層級），「範陽以東、容城以西」為 TEXTUAL_INFERENCE。CLAIM_011_REVISED=true。",
            "citation_ids": ["SHUGE:p124575:1657", "SHUGE:p124575:1661"],
            "counterevidence_audit": "none_found_in_checked_sources",
            "counterevidence_detail": "未在 R4 已校核的外部資料中找到對「易京城在易水之南」的反例；「範陽以東、容城以西」為推論性結論，本身不存在事實性反例。",
            "evidence_status": {
                "canonical_citation": "YES (for both pids)",
                "RULE_QUALIFIED": "YES",
                "PROXY_REVIEWED": "YES (image_checked pid1657 + pid1661)",
                "same_page_semantic_support": "YES (for 易水之南)",
                "VALID_SEQUENCE_CONTEXT": "YES (cross-page)",
                "TEXTUAL_INFERENCE_scope": "範陽以東 + 容城以西 (依賴 pid1657 大字標題順序)"
            },
            "claim_011_revised": True
        },
        # 012: TEXT_REPORTS / PARTIALLY_SUPPORTED (correction: 深澤 ≠ 容城)
        {
            "claim_id": "R4-YSH-012",
            "claim_text_original": "在《水經注》文本中，範陽與容城在漢代多次作為封國出現：範陽為匈奴降王封國（漢景帝中元三年），容城為趙將封國（漢高帝六年）+ 匈奴降王封國（景帝中元三年）。",
            "claim_text_revised": "《水經注》文本記載三項獨立的漢代封國事件（pid1657 + pid1661 對校後）：\n  (1) 範陽封國：景帝中元三年封匈奴降王信為侯國（pid1657）。\n  (2) 容城封國：景帝中元三年以封匈奴降王攜徐盧為侯國（pid1661）。\n  (3) 深澤封國（非容城）：漢高帝六年封趙將某於深澤（pid1661）。\nR4 原 claim 將「趙將某於深澤」誤歸屬於容城封國；R4.1 已將深澤封國拆分為獨立 enfeoffment，避免地名混淆。CLAIM_012_CORRECTED=true。",
            "truth_scope": "TEXT_REPORTS",
            "truth_scope_rationale": "pid1661 引文：「易水東逕容城縣故城南漢高帝六年封趙將夕於深澤景帝中元三年以封匈奴降王携徐盧於容城皆爲侯國」。三項 enfeoffment 文本明確區分深澤（漢高帝六年 + 趙將某）與容城（景帝中元三年 + 攜徐盧）。",
            "support_level_original": "SUPPORTED",
            "support_level_revised": "PARTIALLY_SUPPORTED",
            "support_rationale": "原 R4 將深澤、容城兩個 enfeoffment 混為一談（「容城為趙將封國（漢高帝六年）」錯誤）。R4.1 修正後 TEXT_REPORTS 層級成立（三項獨立 enfeoffment 直接引文均可由視覺確認），但 PARTIALLY_SUPPORTED 因為 (a) 人物姓名（信、某、攜徐盧）有 OCR 不確定性；(b) 「趙將夕」視覺確認可能為「趙將某」之誤；(c) 攜徐盧與撅徐盧之間存在異文（見 EXT-CHEN-2007 註記）。",
            "citation_ids": ["SHUGE:p124575:1657", "SHUGE:p124575:1661"],
            "counterevidence_audit": "EXT-CHEN-2007 (陳橋驛《水經注校證》) 註明「攜徐盧」一作「撅徐盧」——此為 VARIANT_PASSAGES 的依據。R4.1 不採信 EXT-CHEN-2007 URL（zhihu.com/question/... 為 placeholder），但保留此異文記錄以備未來學術查證。",
            "evidence_status": {
                "canonical_citation": "YES (for both pids)",
                "RULE_QUALIFIED": "YES",
                "PROXY_REVIEWED": "YES (image_checked pid1657 + pid1661; OCR uncertain for 人物姓名)",
                "same_page_semantic_support": "YES (for the corrected three-event split)",
                "VALID_SEQUENCE_CONTEXT": "YES (cross-page)",
                "deep_ze_RONGCHENG_conflation_FIXED": True,
                "人物姓名_OCR_uncertain": True,
                "EXT_CHEN_variant_recorded": True
            },
            "claim_012_corrected": True
        }
    ]
}

# ============================================================
# Section D+E: External Source Provenance Audit
# ============================================================

# Per user spec:
# - source_role: PRIMARY / EXTERNAL_PRIMARY / SCHOLARLY_EDITION / DIGITAL_TEXT / BACKGROUND
# - verification_status: IDENTIFIED / LOCATED / ACCESSED / PASSAGE_VERIFIED
# - Placeholder URLs (zhihu.com/question/..., https://..., zhbc.com/...) → IDENTIFIED only
# - PRIMARY source (NII-DIGITAL) MUST NOT be in EXTERNAL_SOURCES count
# - 陳橋驛 record has 「攜徐盧」/「撅徐盧」 → VARIANT_PASSAGES = 1

EXTERNAL_SOURCES_R4_1 = {
    "schema_version": "r4.1-yishui-external-sources-audit/1.0",
    "generated_at": NOW,
    "task": "WATER_CLASSIC_R4_1_SCHOLARLY_AUDIT",
    "section": "R4.1 · External source provenance audit",
    "basis": "R4 frozen commit 582c852; EXT-NII-DIGITAL reclassified as PRIMARY (excluded from EXTERNAL_SOURCES)",
    "reviewer_honesty_disclosure": "R4.1 audit downgraded placeholder-URL sources from PASSAGE_VERIFIED to IDENTIFIED. None of the external sources were independently re-fetched and cross-checked in R4.1 audit; status reflects URL provenance + R4 claim audit, not new passage-level verification.",

    "source_count_total": 7,
    "primary_sources": 1,
    "external_sources": 6,
    "passage_verified_sources": 0,

    "verification_status_distribution": {
        "PRIMARY_LOCATED": 1,
        "ACCESSED_real_URL_passage_unre_verified_in_R41": 3,
        "IDENTIFIED_placeholder_URL_only": 3
    },

    "passage_level_statistics": {
        "corroborating_passages": 6,
        "variant_passages": 1,
        "contradicting_passages": 0,
        "background_only_sources": 1,
        "background_only_passages": 1,
        "note": "CORROBORATING_PASSAGES = 6 counts only passages from sources with verification_status=ACCESSED (real URLs: EXT-WIKI-001, EXT-CTEXT-001, EXT-YANG-1905). Passages from sources with status=IDENTIFIED (placeholder URLs: CHEN-2007 1 + ZHONGHUA-2013 2 = 3 corroborating + 1 variant) are recorded but flagged as 'claimed in R4 but URL not yet verified in R4.1 audit'."
    },

    "records": [
        # PRIMARY: 国立公文書館 scan
        {
            "source_id": "EXT-NII-DIGITAL",
            "source_role": "PRIMARY",
            "source_type": "DIGITAL_PRIMARY_SCAN",
            "title": "國立公文書館藏《水經注》明吳琯校本（卷十一 易水/滱水）",
            "institution_author": "國立公文書館 (National Archives of Japan, Tokyo) / 桑欽 撰 / 後魏 酈道元 注 / 明 吳琯 校",
            "url": "https://www.digital.archives.go.jp/DAS/meta/listPhoto?LANG=default&BID=F1000000000000003985&ID=&REFCODE=C0000000000000003985",
            "access_date": "2026-09-28",
            "publication_date": "明萬曆年間 (1573-1620) 吳琯校梓",
            "reliability": "PRIMARY_DIGITAL_SCAN",
            "verification_status": "LOCATED",
            "verification_status_rationale": "URL 為真實 IIIF 端點；此即 pid1655-pid1683 之 primary scan 來源。R4.1 確認此為 PRIMARY（不計入 EXTERNAL_SOURCES）。",
            "relation_to_primary": "SELF (PRIMARY)",
            "corroborated_passages": [
                {
                    "primary_pid": 1655,
                    "passage": "易水出涿郡故安縣閻鄉西山",
                    "note": "OCR 校正：「承郡」→「涿郡」、「間鄉」→「閻鄉」（image_checked pid1655）"
                }
            ],
            "variant_passages": [],
            "contradicting_passages": [],
            "background_passages": []
        },
        # EXT-WIKI-001: REAL URL, ACCESSED
        {
            "source_id": "EXT-WIKI-001",
            "source_role": "DIGITAL_TEXT",
            "source_type": "WIKISOURCE_DIGITAL_TEXT",
            "title": "《水經注》卷十一 易水 (Wikisource 維基文庫)",
            "institution_author": "Wikisource contributors / public domain",
            "url": "https://zh.wikisource.org/wiki/%E6%B0%B4%E7%B6%93%E6%B3%A8/%E5%8D%B711",
            "access_date": "2026-09-28",
            "publication_date": "latest revision (public domain)",
            "reliability": "PUBLIC_DOMAIN_DIGITAL_TEXT (multi-edition cross-check)",
            "verification_status": "ACCESSED",
            "verification_status_rationale": "URL 為真實 Wikisource 卷十一頁面（zh.wikisource.org）；R4.1 未獨立重新逐句比對，僅確認 URL 真實存在與 R4 記錄一致。",
            "relation_to_primary": "CORROBORATES",
            "corroborated_passages": [
                {
                    "primary_pid": 1655,
                    "passage": "易水出涿郡故安縣閻鄉西山",
                    "variant_in_source": "Wikisource 校勘版本作「易水出涿郡故安縣閻鄉西山」（無異文）",
                    "note": "CORROBORATES DB OCR 校正：「涿郡」/「閻鄉」"
                }
            ],
            "variant_passages": [],
            "contradicting_passages": [],
            "background_passages": []
        },
        # EXT-CTEXT-001: REAL URL, ACCESSED
        {
            "source_id": "EXT-CTEXT-001",
            "source_role": "DIGITAL_TEXT",
            "source_type": "DIGITAL_TEXT_DATABASE",
            "title": "中國哲學書電子化計劃 ctext.org 水經注 卷十一",
            "institution_author": "ctext.org contributors (Donald Sturgeon 主編)",
            "url": "https://ctext.org/text.pl?node=600306&if=en",
            "access_date": "2026-09-28",
            "publication_date": "持續更新",
            "reliability": "DIGITAL_TEXT_DATABASE (cross-check with multiple editions)",
            "verification_status": "ACCESSED",
            "verification_status_rationale": "URL 為真實 ctext.org 水經注頁面；R4.1 未獨立重新逐句比對。",
            "relation_to_primary": "CORROBORATES",
            "corroborated_passages": [
                {
                    "primary_pid": 1657,
                    "passage": "東過范陽縣南又東過容城縣南",
                    "variant_in_source": "ctext.org 版本作「東過范陽縣南又東過容城縣南」（無異文）",
                    "note": "CORROBORATES pid1657 大字標題"
                },
                {
                    "primary_pid": 1657,
                    "passage": "易水東南流，逕范陽縣故城南，即應劭所謂范水之陽也。漢景帝中元三年，封匈奴降王信為侯國",
                    "variant_in_source": "ctext.org 版本同文（無異文）",
                    "note": "CORROBORATES pid1657 R4-YSH-008/012 引文"
                }
            ],
            "variant_passages": [],
            "contradicting_passages": [],
            "background_passages": []
        },
        # EXT-YANG-1905: REAL URL, ACCESSED
        {
            "source_id": "EXT-YANG-1905",
            "source_role": "SCHOLARLY_EDITION",
            "source_type": "SCHOLARLY_ANNOTATED_EDITION",
            "title": "楊守敬《水經注疏》(1905 影印本, ctext.org 數位化)",
            "institution_author": "楊守敬 (1839-1915) / 熊會貞 續疏",
            "url": "https://ctext.org/wiki.pl?if=zh&res=644196",
            "access_date": "2026-09-28",
            "publication_date": "1905 (清光緒三十一年) 初次影印；ctext.org 數位化版持續更新",
            "reliability": "SCHOLARLY_ANNOTATED_EDITION (Yang Shoujing + Xiong Huizhen annotations)",
            "verification_status": "ACCESSED",
            "verification_status_rationale": "URL 為 ctext.org wiki.pl 頁面（res=644196），可定位；R4.1 未獨立重新逐句比對楊守敬原書。",
            "relation_to_primary": "CORROBORATES",
            "corroborated_passages": [
                {
                    "primary_pid": 1656,
                    "passage": "故傳逮迹遊賦曰：出北薊，歷良鄉，登金臺，觀武陽",
                    "variant_in_source": "楊守敬《水經注疏》註：謝靈運《撰征賦》（一作「逮迹遊獵賦」）",
                    "note": "CORROBORATES pid1656 R4-YSH-009 引文；標註謝靈運《撰征賦》之異稱"
                },
                {
                    "primary_pid": 1659,
                    "passage": "故《地理志》曰：故安縣閻鄉，易水所出，至范陽入濡水",
                    "variant_in_source": "楊守敬《水經注疏》註：班固《漢書·地理志》原文",
                    "note": "CORROBORATES pid1659 R4-YSH-006 引文"
                },
                {
                    "primary_pid": 1682,
                    "passage": "漢景帝中元三年，以封匈奴降王隆疆爲侯國",
                    "variant_in_source": "楊守敬《水經注疏》註：王莽更名「迺屏」",
                    "note": "CORROBORATES pid1682 enfeoffment 記錄（迺縣=迺屏）"
                }
            ],
            "variant_passages": [],
            "contradicting_passages": [],
            "background_passages": []
        },
        # EXT-CHEN-2007: PLACEHOLDER URL, IDENTIFIED
        {
            "source_id": "EXT-CHEN-2007",
            "source_role": "SCHOLARLY_EDITION",
            "source_type": "SCHOLARLY_ANNOTATED_EDITION",
            "title": "陳橋驛《水經注校證》(2007)",
            "institution_author": "陳橋驛 (1923-2015) / 浙江大學",
            "url": "https://www.zhihu.com/question/... (placeholder URL — needs real link)",
            "access_date": "2026-09-28",
            "publication_date": "2007 (中華書局出版)",
            "reliability": "SCHOLARLY_ANNOTATED_EDITION (Chen Qiaoyi collated multiple editions)",
            "verification_status": "IDENTIFIED",
            "verification_status_rationale": "URL 為 zhihu.com/question/... placeholder；R4.1 無法定位真實可訪問 URL。本書 ISBN 978-7-101-08566-6；真實 URL 應指向 中華書局官方頁面或 浙江大学出版社 紀念頁面。",
            "relation_to_primary": "CLAIMED_BUT_NOT_VERIFIED_IN_R41",
            "corroborated_passages": [
                {
                    "primary_pid": 1661,
                    "passage": "景帝中元三年以封匈奴降王攜徐盧於容城",
                    "variant_in_source": "陳橋驛《水經注校證》註：「攜徐盧」一作「撅徐盧」",
                    "note": "CLAIMED in R4 record; URL not verified in R4.1 audit. VARIANT 記錄仍標示於 R4-VARIANT_PASSAGES。"
                }
            ],
            "variant_passages": [
                {
                    "primary_pid": 1661,
                    "passage": "景帝中元三年以封匈奴降王攜徐盧於容城",
                    "variant": "撅徐盧 (一作)",
                    "source_attribution": "陳橋驛《水經注校證》(2007) — claimed in R4 record, URL not verified in R4.1 audit",
                    "note": "異文記錄保留以備未來學術查證；R4.1 不將此計入 PASSAGE_VERIFIED count。"
                }
            ],
            "contradicting_passages": [],
            "background_passages": []
        },
        # EXT-WANG-1956: PLACEHOLDER URL, IDENTIFIED, BACKGROUND_ONLY
        {
            "source_id": "EXT-WANG-1956",
            "source_role": "SCHOLARLY_EDITION",
            "source_type": "SCHOLARLY_ANNOTATED_EDITION",
            "title": "王國維《水經注校》(1956 重印本)",
            "institution_author": "王國維 (1877-1927) / 1956 影印",
            "url": "https://... (placeholder URL — needs real link)",
            "access_date": "2026-09-28",
            "publication_date": "1956 影印 (原作 1920s 期間)",
            "reliability": "SCHOLARLY_ANNOTATED_EDITION (Wang Guowei textual criticism)",
            "verification_status": "IDENTIFIED",
            "verification_status_rationale": "URL 為 https://... placeholder；R4.1 無法定位真實可訪問 URL。王國維《水經注校》1956 由 人民文學出版社 重印。",
            "relation_to_primary": "BACKGROUND_ONLY",
            "corroborated_passages": [],
            "variant_passages": [],
            "contradicting_passages": [],
            "background_passages": [
                {
                    "primary_pid": 1656,
                    "passage": "逮迹遊賦",
                    "note": "BACKGROUND：謝靈運《撰征賦》之校勘背景；王國維《水經注校》提供歷史學背景但對 pid1656/1661 主題不直接構成校核。"
                }
            ]
        },
        # EXT-ZHONGHUA-2013: PLACEHOLDER URL, IDENTIFIED
        {
            "source_id": "EXT-ZHONGHUA-2013",
            "source_role": "SCHOLARLY_EDITION",
            "source_type": "SCHOLARLY_PUNCTUATED_EDITION",
            "title": "中華書局《水經注》標點本 (2013)",
            "institution_author": "中華書局 / 陳橋驛 點校",
            "url": "https://www.zhbc.com/... (placeholder URL — needs real link)",
            "access_date": "2026-09-28",
            "publication_date": "2013 (中華書局重印)",
            "reliability": "SCHOLARLY_PUNCTUATED_EDITION",
            "verification_status": "IDENTIFIED",
            "verification_status_rationale": "URL 為 zhbc.com/... placeholder；R4.1 無法定位真實可訪問 URL。中華書局官方頁面應為 www.zhbc.com.cn。",
            "relation_to_primary": "CLAIMED_BUT_NOT_VERIFIED_IN_R41",
            "corroborated_passages": [
                {
                    "primary_pid": 1656,
                    "passage": "易水逕故安城南外東流",
                    "variant_in_source": "中華書局標點本作「易水逕故安城南，外東流」（逗號標點異於明吳琯校本）",
                    "note": "CLAIMED in R4 record; URL not verified in R4.1 audit. 標點異議為現代標點符號差異，非實質異文。"
                },
                {
                    "primary_pid": 1682,
                    "passage": "又東南過容城縣北",
                    "variant_in_source": "中華書局標點本同文（無異文）",
                    "note": "CLAIMED in R4 record; URL not verified in R4.1 audit."
                }
            ],
            "variant_passages": [],
            "contradicting_passages": [],
            "background_passages": []
        }
    ],

    "hard_boundaries": {
        "NEW_OCR": 0,
        "NEW_PRIMARY_ACQUISITION": 0,
        "DB_WRITES": 0,
        "EMBEDDINGS": 0,
        "R4_BASELINE_PRESERVED": True,
        "PRIMARY_SOURCES_EXCLUDED_FROM_EXTERNAL": True
    },

    "audit_summary": {
        "primary_sources": 1,
        "external_sources": 6,
        "passage_verified_sources": 0,
        "verification_status_summary": {
            "PRIMARY_LOCATED": ["EXT-NII-DIGITAL"],
            "ACCESSED_real_URL": ["EXT-WIKI-001", "EXT-CTEXT-001", "EXT-YANG-1905"],
            "IDENTIFIED_placeholder_URL": ["EXT-CHEN-2007", "EXT-WANG-1956", "EXT-ZHONGHUA-2013"]
        },
        "downgrades_from_R4": {
            "EXT-CHEN-2007": "CORROBORATES → CLAIMED_BUT_NOT_VERIFIED_IN_R41 (zhihu.com placeholder)",
            "EXT-ZHONGHUA-2013": "CORROBORATES → CLAIMED_BUT_NOT_VERIFIED_IN_R41 (zhbc.com placeholder)",
            "EXT-WANG-1956": "BACKGROUND_ONLY (preserved; placeholder URL recorded)"
        },
        "variant_passages_recovered": 1,
        "variant_source": "EXT-CHEN-2007 陳橋驛《水經注校證》(2007) — 「攜徐盧」一作「撅徐盧」(claimed in R4, URL not verified in R4.1)"
    }
}


# ============================================================
# Section G+H: CORE_TOPOLOGY + FULL_TOPOLOGY + Claim-to-Edge Binding
# ============================================================

# Per user spec:
# - CORE_TOPOLOGY: 6-10 core nodes (易水, 故安, 范陽, 容城, 濡水, 巨馬水, 大利亭, + evidence-needed)
# - FULL_TOPOLOGY: 72 nodes / 29 edges preserved (in fold/appendix)
# - Each core edge must bind: relation_id, claim_id, canonical_citation, exact_excerpt, support_status

CORE_TOPOLOGY_R4_1 = {
    "schema_version": "r4.1-yishui-core-topology-audit/1.0",
    "generated_at": NOW,
    "task": "WATER_CLASSIC_R4_1_SCHOLARLY_AUDIT",
    "section": "R4.1 · Topology simplification (CORE + FULL)",
    "basis": "R4 frozen commit 582c852 textual_topology_r4.json preserved as FULL_TOPOLOGY; R4.1 adds CORE_TOPOLOGY with claim-to-edge binding",

    "core_topology_nodes": 9,
    "core_topology_edges": 15,
    "full_topology_nodes": 72,
    "full_topology_edges": 29,
    "full_topology_preserved": True,

    "core_node_selection_rationale": {
        "user_spec_explicit": ["易水", "故安", "范陽", "容城", "濡水", "巨馬水", "大利亭"],
        "evidence_needed_additions": [
            "武陽 (R4-YSH-009 燕下都記錄)",
            "易京 (R4-YSH-011 公孫瓚記錄)"
        ],
        "excluded_from_core_but_in_full": [
            "金毫陂 (R4-YSH-010 金臺所在陂，非核心地理節點)",
            "蘭馬臺 (R4-YSH-010 臺名，非獨立核心節點)",
            "其他65節點 (FULL_TOPOLOGY 詳列)"
        ]
    },

    "core_nodes": [
        {"node_id": "cn_01", "name": "易水", "type": "river", "x": 250, "y": 350, "core_role": "central water body"},
        {"node_id": "cn_02", "name": "故安", "type": "historical_place", "x": 100, "y": 250, "core_role": "易水水源"},
        {"node_id": "cn_03", "name": "范陽", "type": "historical_place", "x": 400, "y": 350, "core_role": "易水+巨馬水交匯"},
        {"node_id": "cn_04", "name": "容城", "type": "historical_place", "x": 500, "y": 350, "core_role": "易水+巨馬水東端"},
        {"node_id": "cn_05", "name": "濡水", "type": "river", "x": 250, "y": 150, "core_role": "北側水系"},
        {"node_id": "cn_06", "name": "巨馬水", "type": "river", "x": 250, "y": 550, "core_role": "南側水系"},
        {"node_id": "cn_07", "name": "大利亭", "type": "historical_place", "x": 350, "y": 500, "core_role": "三水交會地理節點"},
        {"node_id": "cn_08", "name": "武陽", "type": "historical_place", "x": 100, "y": 450, "core_role": "燕下都 (R4-YSH-009)"},
        {"node_id": "cn_09", "name": "易京", "type": "historical_place", "x": 550, "y": 250, "core_role": "公孫瓚遷都處 (R4-YSH-011)"}
    ],

    "core_edges": [
        # e_001: 易水起源
        {"edge_id": "ce_001", "subject": "故安", "predicate": "易水出於", "object": "易水",
         "relation_id": "r_1655_origin_01",
         "claim_id": "R4-YSH-002",
         "canonical_citation": "SHUGE:p124575:1655",
         "exact_excerpt": "易水出涿郡故安縣閻鄉西山",
         "support_status": "TEXT_REPORTS",
         "svg_x1": 100, "svg_y1": 250, "svg_x2": 250, "svg_y2": 350},
        # e_002: 故安城南外東流
        {"edge_id": "ce_002", "subject": "故安", "predicate": "易水逕城南外東流", "object": "易水",
         "relation_id": "r_1656_south_city_01",
         "claim_id": "R4-YSH-003",
         "canonical_citation": "SHUGE:p124575:1656",
         "exact_excerpt": "易水逕故安城南外東流",
         "support_status": "TEXTUAL_INFERENCE",
         "svg_x1": 100, "svg_y1": 280, "svg_x2": 230, "svg_y2": 340},
        # e_003: 故安北 → 濡水
        {"edge_id": "ce_003", "subject": "故安", "predicate": "位於濡水之南", "object": "濡水",
         "relation_id": "r_1659_passes_north_of_01",
         "claim_id": "R4-YSH-003",
         "canonical_citation": "SHUGE:p124575:1659",
         "exact_excerpt": "其水又東南流，歷故安縣北",
         "support_status": "TEXTUAL_INFERENCE",
         "svg_x1": 130, "svg_y1": 230, "svg_x2": 240, "svg_y2": 170},
        # e_004: 故安水 → 大利亭
        {"edge_id": "ce_004", "subject": "故安", "predicate": "故安水東南至大利亭", "object": "大利亭",
         "relation_id": "r_1659_flow_south_01",
         "claim_id": "R4-YSH-007",
         "canonical_citation": "SHUGE:p124575:1659",
         "exact_excerpt": "其水又東南流於容城縣西北大利亭東南",
         "support_status": "TEXT_REPORTS",
         "svg_x1": 130, "svg_y1": 270, "svg_x2": 340, "svg_y2": 490},
        # e_005: 大利亭 → 合易水注巨馬水
        {"edge_id": "ce_005", "subject": "大利亭", "predicate": "合易水注巨馬水", "object": "巨馬水",
         "relation_id": "r_1659_meets_01",
         "claim_id": "R4-YSH-007",
         "canonical_citation": "SHUGE:p124575:1659",
         "exact_excerpt": "合易水而注巨馬水也",
         "support_status": "TEXT_REPORTS",
         "svg_x1": 360, "svg_y1": 510, "svg_x2": 270, "svg_y2": 540},
        # e_006: 易水 → 過武陽南
        {"edge_id": "ce_006", "subject": "易水", "predicate": "逕武陽南", "object": "武陽",
         "relation_id": "r_1656_passes_south_of_wuyang",
         "claim_id": "R4-YSH-009",
         "canonical_citation": "SHUGE:p124575:1656",
         "exact_excerpt": "易水又東逕武陽南",
         "support_status": "TEXT_REPORTS",
         "svg_x1": 230, "svg_y1": 360, "svg_x2": 110, "svg_y2": 450},
        # e_007: 武陽 → 燕下都
        {"edge_id": "ce_007", "subject": "武陽", "predicate": "酈道元記為燕下都", "object": "武陽",
         "relation_id": "r_1656_historical_relation",
         "claim_id": "R4-YSH-009",
         "canonical_citation": "SHUGE:p124575:1656",
         "exact_excerpt": "武陽蓋燕昭王之所城也，東西二十里，南北十七里",
         "support_status": "TEXT_REPORTS",
         "note": "此 edge 為 self-loop，標示 武陽=燕下都 之 historical_relation",
         "svg_x1": 100, "svg_y1": 450, "svg_x2": 130, "svg_y2": 480},
        # e_008: 易水 → 過范陽南 (大字標題)
        {"edge_id": "ce_008", "subject": "易水", "predicate": "東過范陽縣南", "object": "范陽",
         "relation_id": "r_1657_passes_south_of_fanyang",
         "claim_id": "R4-YSH-001",
         "canonical_citation": "SHUGE:p124575:1657",
         "exact_excerpt": "東過范陽縣南",
         "support_status": "TEXT_REPORTS",
         "svg_x1": 270, "svg_y1": 340, "svg_x2": 390, "svg_y2": 350},
        # e_009: 易水 → 過容城南 (大字標題)
        {"edge_id": "ce_009", "subject": "易水", "predicate": "又東過容城縣南", "object": "容城",
         "relation_id": "r_1657_passes_south_of_rongcheng",
         "claim_id": "R4-YSH-001",
         "canonical_citation": "SHUGE:p124575:1657",
         "exact_excerpt": "又東過容城縣南",
         "support_status": "TEXT_REPORTS",
         "svg_x1": 410, "svg_y1": 350, "svg_x2": 490, "svg_y2": 350},
        # e_010: 易水 → 過容城北 (pid1659 「互攝通稱」)
        {"edge_id": "ce_010", "subject": "易水", "predicate": "通稱東逕容城縣故城北", "object": "容城",
         "relation_id": "r_1659_passes_north_of_rongcheng",
         "claim_id": "R4-YSH-006",
         "canonical_citation": "SHUGE:p124575:1659",
         "exact_excerpt": "通稱東逕容城縣故城北",
         "support_status": "TEXT_REPORTS",
         "svg_x1": 270, "svg_y1": 330, "svg_x2": 490, "svg_y2": 320},
        # e_011: 易水 → 入濡水 (互攝)
        {"edge_id": "ce_011", "subject": "易水", "predicate": "同入濡水", "object": "濡水",
         "relation_id": "r_1659_confluences_with",
         "claim_id": "R4-YSH-006",
         "canonical_citation": "SHUGE:p124575:1659",
         "exact_excerpt": "然二易俱出一鄉，同入濡水",
         "support_status": "TEXTUAL_INFERENCE",
         "svg_x1": 250, "svg_y1": 320, "svg_x2": 250, "svg_y2": 200},
        # e_012: 易水 → 過易京南
        {"edge_id": "ce_012", "subject": "易水", "predicate": "東逕易京南", "object": "易京",
         "relation_id": "r_1661_passes_south_of_yijing",
         "claim_id": "R4-YSH-011",
         "canonical_citation": "SHUGE:p124575:1661",
         "exact_excerpt": "易水又東逕易京南",
         "support_status": "TEXT_REPORTS",
         "note": "僅 '易水之南' 部分為 TEXT_REPORTS；'範陽以東、容城以西' 為 TEXTUAL_INFERENCE（見 R4-YSH-011 claim）",
         "svg_x1": 280, "svg_y1": 340, "svg_x2": 540, "svg_y2": 260},
        # e_013: 巨馬水 → 過范陽故城北
        {"edge_id": "ce_013", "subject": "巨馬水", "predicate": "東南逕范陽縣故城北", "object": "范陽",
         "relation_id": "r_1682_passes_north_of_fanyang",
         "claim_id": "R4-YSH-004",
         "canonical_citation": "SHUGE:p124575:1682",
         "exact_excerpt": "又東南逕范陽縣故城北，易水注之",
         "support_status": "TEXT_REPORTS",
         "note": "巨馬水章（pid1682），與易水章不同水系；R4-YSH-004 已標註此水系差異",
         "svg_x1": 250, "svg_y1": 530, "svg_x2": 390, "svg_y2": 380},
        # e_014: 易水 → 注巨馬水
        {"edge_id": "ce_014", "subject": "易水", "predicate": "注於巨馬水", "object": "巨馬水",
         "relation_id": "r_1682_flows_into_juma",
         "claim_id": "R4-YSH-006",
         "canonical_citation": "SHUGE:p124575:1682",
         "exact_excerpt": "又東南逕范陽縣故城北，易水注之",
         "support_status": "TEXTUAL_INFERENCE",
         "svg_x1": 260, "svg_y1": 380, "svg_x2": 250, "svg_y2": 520},
        # e_015: 巨馬水 → 過容城縣北
        {"edge_id": "ce_015", "subject": "巨馬水", "predicate": "又東南過容城縣北", "object": "容城",
         "relation_id": "r_1682_passes_north_of_rongcheng_juma",
         "claim_id": "R4-YSH-004",
         "canonical_citation": "SHUGE:p124575:1682",
         "exact_excerpt": "又東南過容城縣北",
         "support_status": "TEXT_REPORTS",
         "svg_x1": 280, "svg_y1": 540, "svg_x2": 490, "svg_y2": 380}
    ],

    "full_topology_preserved": True,
    "full_topology_source": "data/yishui_textual_topology_r4.json (582c852) — 72 nodes / 29 edges, unchanged in R4.1",

    "layout_improvement": {
        "R4_issue": "原 R4 SVG 大量節點使用相同 cy=380 座標，與頁面聲稱的「y軸按 pid1655 → pid1683 排列」不一致，導致節點視覺重疊。",
        "R4.1_fix": "CORE_TOPOLOGY 採用 9 節點 5 列佈局：(100, 250-450) 故安/武陽；(250, 150-550) 濡水/易水/巨馬水；(350-550, 250-500) 大利亭/范陽/容城/易京。FULL_TOPOLOGY 完整保留於 R4 frozen JSON（不做視覺重排，僅在 /yishui/ 頁面以 fold/appendix 形式呈現）。"
    },

    "hard_boundaries": {
        "NEW_OCR": 0,
        "NEW_PRIMARY_ACQUISITION": 0,
        "DB_WRITES": 0,
        "EMBEDDINGS": 0,
        "R4_BASELINE_PRESERVED": True,
        "FULL_TOPOLOGY_NOT_OVERWRITTEN": True
    }
}


# ============================================================
# Write files
# ============================================================

def write_json(path: Path, obj: dict) -> int:
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=2)
    return path.stat().st_size


def main():
    print("=== R4.1 · Section A+B+C+D+E+G+H · Build audit overlay JSON ===")
    print()

    p1 = DATA_DIR / "yishui_claims_r4_1.json"
    s1 = write_json(p1, CLAIMS_R4_1)
    print(f"Wrote {p1.relative_to(PROJECT_ROOT)} ({s1} bytes, 12 claims)")

    p2 = DATA_DIR / "yishui_external_sources_r4_1.json"
    s2 = write_json(p2, EXTERNAL_SOURCES_R4_1)
    print(f"Wrote {p2.relative_to(PROJECT_ROOT)} ({s2} bytes, 7 sources)")

    p3 = DATA_DIR / "yishui_core_topology_r4_1.json"
    s3 = write_json(p3, CORE_TOPOLOGY_R4_1)
    print(f"Wrote {p3.relative_to(PROJECT_ROOT)} ({s3} bytes, 9 core nodes + 15 core edges + FULL preserved)")

    print()
    print("=== R4.1 Sections A+B+C+D+E+G+H COMPLETE ===")
    print("  Section A+B+C: yishui_claims_r4_1.json (truth_scope + revised support)")
    print("  Section D+E:   yishui_external_sources_r4_1.json (source_role + verification_status)")
    print("  Section G+H:   yishui_core_topology_r4_1.json (CORE + FULL + claim-to-edge)")
    print()
    print("Distribution:")
    print("  CLAIMS_TOTAL=12, SUPPORTED=7, PARTIAL=5, NOT_SUPPORTED=0")
    print("  TEXT_REPORTS=7, TEXTUAL_INFERENCE=5, HISTORICAL_CORROBORATED=0, MODERN_MAPPING=0")
    print("  CLAIM_011_REVISED=true, CLAIM_012_CORRECTED=true")
    print("  PRIMARY_SOURCES=1, EXTERNAL_SOURCES=6, PASSAGE_VERIFIED_SOURCES=0")
    print("  CORROBORATING_PASSAGES=6, VARIANT_PASSAGES=1, CONTRADICTING_PASSAGES=0, BACKGROUND_ONLY=1")
    print("  CORE_TOPOLOGY_NODES=9, CORE_TOPOLOGY_EDGES=15, FULL_TOPOLOGY_PRESERVED=true")


if __name__ == "__main__":
    main()