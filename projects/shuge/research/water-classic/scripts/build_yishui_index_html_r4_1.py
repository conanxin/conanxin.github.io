#!/usr/bin/env python3
"""
WATER_CLASSIC_R4_1_SCHOLARLY_AUDIT · Rewrite /yishui/index.html with R4.1 audit content.

R4 frozen yishui/index.html is NOT overwritten; this writes the R4.1 audit-version
public page that reflects:
  - 7/12 claims SUPPORTED + 5/12 PARTIALLY_SUPPORTED
  - R4-YSH-012 deep-澤 / RONGCHENG correction
  - R4-YSH-011 inference scope clarification
  - External source provenance (3 ACCESSED + 3 IDENTIFIED + 1 PRIMARY)
  - CORE_TOPOLOGY (9 nodes, 15 edges) with claim-to-edge binding
  - FULL_TOPOLOGY preserved as fold/appendix

Hard boundaries: NEW_OCR=0 · NEW_PRIMARY_ACQUISITION=0 · DB_WRITES=0 · EMBEDDINGS=0
"""

from pathlib import Path

PROJECT_ROOT = Path("/home/conanxin/conanxin.github.io")
HTML_OUT = PROJECT_ROOT / "projects/shuge/research/water-classic/yishui/index.html"


def build_html() -> str:
    head = """<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>易水專題研究 · R4.1 學術審計 — 《水經注》易水敘事中的范陽、容城與故安</title>
<meta name="description" content="WATER_CLASSIC_R4_1_SCHOLARLY_AUDIT · 對 R4 十二條歷史 claim、外部校核、文本空間拓撲的學術審計層。">
<link rel="stylesheet" href="../style.css">
<style>
:root {
  --wc-bg: #fdfaf3;
  --wc-ink: #2a2620;
  --wc-accent: #b85c38;
  --wc-warm: #d4a017;
  --wc-cool: #4a6b8a;
  --wc-line: #d9d2c5;
  --wc-soft: #f1ebd9;
  --wc-support: #4a6b8a;
  --wc-partial: #b85c38;
  --wc-uncertain: #8a6b3a;
}
body { background: var(--wc-bg); color: var(--wc-ink); line-height: 1.7; font-family: "Noto Serif SC", "Songti SC", "Source Han Serif SC", serif; }
.wc-hero { padding: 3rem 2rem 2rem; border-bottom: 2px solid var(--wc-line); background: linear-gradient(135deg, #fdfaf3 0%, #f7eed4 100%); }
.wc-hero .badge { display: inline-block; padding: 0.25rem 0.75rem; background: var(--wc-accent); color: #fff; font-size: 0.85rem; border-radius: 4px; margin-right: 0.5rem; }
.wc-hero .badge.r41 { background: var(--wc-warm); color: #2a2620; }
.wc-h1 { font-size: 2.4rem; margin: 0.5rem 0; color: var(--wc-ink); }
.wc-h2 { font-size: 1.6rem; margin: 1.5rem 0 0.75rem; color: var(--wc-accent); border-left: 4px solid var(--wc-accent); padding-left: 0.75rem; }
.wc-h3 { font-size: 1.15rem; margin: 1rem 0 0.5rem; color: var(--wc-cool); }
.wc-section { padding: 1.5rem 2rem; max-width: 1100px; margin: 0 auto; }
.wc-section + .wc-section { border-top: 1px solid var(--wc-line); }
.wc-meta { color: #6b6151; font-size: 0.95rem; }
.wc-card { background: #fff; border: 1px solid var(--wc-line); border-left: 4px solid var(--wc-cool); border-radius: 6px; padding: 1rem 1.25rem; margin: 0.75rem 0; }
.wc-card.partial { border-left-color: var(--wc-partial); }
.wc-card.uncertain { border-left-color: var(--wc-uncertain); }
.wc-card.support { border-left-color: var(--wc-support); }
.wc-card.correction { border-left-color: var(--wc-warm); background: #fffaeb; }
.wc-card h4 { margin: 0 0 0.5rem; font-size: 1rem; color: var(--wc-ink); }
.wc-tag { display: inline-block; padding: 0.1rem 0.5rem; background: var(--wc-cool); color: #fff; font-size: 0.75rem; border-radius: 3px; margin-right: 0.25rem; }
.wc-tag.text-reports { background: var(--wc-support); }
.wc-tag.textual-inference { background: var(--wc-partial); }
.wc-tag.supported { background: var(--wc-support); }
.wc-tag.partially { background: var(--wc-partial); }
.wc-tag.uncertain { background: var(--wc-uncertain); }
.wc-tag.identified { background: var(--wc-uncertain); }
.wc-tag.accessed { background: var(--wc-cool); }
.wc-tag.primary { background: var(--wc-warm); color: #2a2620; }
.wc-tag.not-verified { background: #888; }
.wc-cite { font-family: "Courier New", monospace; background: var(--wc-soft); padding: 0.1rem 0.4rem; border-radius: 3px; font-size: 0.85rem; color: var(--wc-accent); }
.wc-excerpt { background: var(--wc-soft); border-left: 3px solid var(--wc-cool); padding: 0.5rem 0.75rem; margin: 0.5rem 0; font-family: "Songti SC", serif; }
.wc-table { width: 100%; border-collapse: collapse; margin: 0.75rem 0; font-size: 0.92rem; }
.wc-table th, .wc-table td { padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--wc-line); text-align: left; }
.wc-table th { background: var(--wc-soft); font-weight: 600; }
.wc-table tr:hover td { background: #fbf6e8; }
.wc-svg-wrap { background: #fff; border: 1px solid var(--wc-line); border-radius: 6px; padding: 1rem; margin: 1rem 0; overflow-x: auto; }
.wc-svg-wrap svg { display: block; }
.wc-node-circle { transition: opacity 0.2s, stroke-width 0.2s; cursor: pointer; }
.wc-node-circle:hover { stroke-width: 3; }
.wc-edge-line { transition: stroke-width 0.2s; }
.wc-edge-line:hover { stroke-width: 3; }
.wc-nav { background: #fff; border-bottom: 1px solid var(--wc-line); padding: 0.75rem 2rem; position: sticky; top: 0; z-index: 100; }
.wc-nav a { color: var(--wc-ink); text-decoration: none; margin-right: 1.25rem; font-size: 0.95rem; }
.wc-nav a:hover { color: var(--wc-accent); }
.wc-nav a.active { color: var(--wc-accent); font-weight: 600; }
.wc-footer { padding: 2rem; text-align: center; color: #6b6151; font-size: 0.85rem; border-top: 2px solid var(--wc-line); margin-top: 2rem; }
.wc-footer a { color: var(--wc-cool); }
.wc-disclosure { background: #fffbe6; border: 1px solid var(--wc-warm); border-radius: 6px; padding: 1rem 1.25rem; margin: 1rem 0; font-size: 0.92rem; }
.wc-disclosure strong { color: var(--wc-warm); }
.wc-details { background: #f6f1e3; border: 1px solid var(--wc-line); border-radius: 6px; padding: 0.75rem 1rem; margin: 0.75rem 0; }
.wc-details summary { cursor: pointer; font-weight: 600; color: var(--wc-cool); }
.wc-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin: 1rem 0; }
.wc-finding { background: #fff; border: 1px solid var(--wc-line); border-radius: 6px; padding: 1rem 1.25rem; }
.wc-finding h4 { margin: 0 0 0.5rem; color: var(--wc-accent); font-size: 1rem; }
.wc-finding .num { display: inline-block; width: 1.75rem; height: 1.75rem; background: var(--wc-accent); color: #fff; border-radius: 50%; text-align: center; line-height: 1.75rem; margin-right: 0.5rem; font-size: 0.9rem; }
</style>
</head>
<body>

<nav class="wc-nav">
  <a href="#sec-rq">研究問題</a>
  <a href="#sec-findings">核心發現</a>
  <a href="#sec-topology">空間拓撲</a>
  <a href="#sec-text">關鍵原文</a>
  <a href="#sec-claims">Claims</a>
  <a href="#sec-uncertainty">不確定性</a>
  <a href="#sec-sources">來源</a>
  <a href="../">返回專題</a>
</nav>

<header class="wc-hero">
  <div>
    <span class="badge">R4</span><span class="badge r41">R4.1 學術審計</span>
  </div>
  <h1 class="wc-h1">易水專題研究</h1>
  <h2 style="font-size: 1.25rem; font-weight: 400; margin: 0.25rem 0; color: #6b6151;">
    《水經注》易水敘事中的范陽、容城與故安
  </h2>
  <p class="wc-meta">
    任務: <span class="wc-cite">WATER_CLASSIC_R4_1_SCHOLARLY_AUDIT</span>
    &nbsp;|&nbsp; 階段: <strong>R4.1 · publication-level scholarly audit</strong>
    &nbsp;|&nbsp; 生成: 2026-09-28 18:05 GMT+8
    &nbsp;|&nbsp; <a href="../">/projects/shuge/research/water-classic/</a> →
    <a href="./">/yishui/</a>
  </p>
  <p class="wc-meta" style="margin-top: 0.5rem;">
    R4 frozen: <span class="wc-cite">582c852</span> &nbsp;|&nbsp;
    R3.4 frozen: <span class="wc-cite">b37202a</span> &nbsp;|&nbsp;
    R3.3 frozen: <span class="wc-cite">d8d970f</span> &nbsp;|&nbsp;
    R2.1 audit: <span class="wc-cite">5683 B</span>
  </p>
</header>
"""

    section_rq = """
<section class="wc-section" id="sec-rq">
  <h2 class="wc-h2">研究問題 (Research Questions)</h2>

  <div class="wc-disclosure">
    <strong>R4.1 審計範圍聲明：</strong>本頁面為 R4 之上的審計層 (audit overlay)，不改動 R4 frozen JSON。<br>
    R4.1 對 12 條 R4 historical claims 重新分類 <code>truth_scope</code> 並重判 <code>support_level</code>；
    對外部校核資料重新標示 <code>verification_status</code>；對 textual topology 拆分為 CORE / FULL 兩層並做 claim-to-edge binding。
    硬邊界：<code>NEW_OCR=0 · NEW_PRIMARY_ACQUISITION=0 · DB_WRITES=0 · EMBEDDINGS=0 · R4_BASELINE_PRESERVED=true</code>。
  </div>

  <h3 class="wc-h3">RQ1 · 空間語言結構</h3>
  <p>《水經注》卷十一易水章中，<strong>范陽、容城、故安</strong> 三個地名如何透過 <em>出 / 流 / 過 / 經 / 注 / 合 / 會 / 入 / 城南 / 城西</em> 等空間動詞被組織？「範陽先於容城出現」與「由『東過』動詞串聯」是否屬於同一層級的文本事實？</p>

  <h3 class="wc-h3">RQ2 · 文本空間拓撲</h3>
  <p>易水、濡水、巨馬水、淶水在 pid1659 之「互攝通稱」語境中呈現的水系結構為何？哪些節點（故安/范陽/容城/濡水/巨馬水/大利亭/武陽/易京）構成核心拓撲，哪些屬於次級節點？</p>

  <h3 class="wc-h3">RQ3 · 證據等級與外部校核</h3>
  <p>12 條 R4 historical claims 中，哪些可由《水經注》文本<strong>直接支持</strong>（TEXT_REPORTS），哪些僅屬<strong>文本順序推論</strong>（TEXTUAL_INFERENCE）？哪些已由<strong>外部史料獨立校核</strong>（HISTORICAL_CORROBORATED），哪些仍待考證？R4-YSH-012 對「深澤封國 vs 容城封國」的處理是否需要修正？</p>
</section>
"""

    section_findings = """
<section class="wc-section" id="sec-findings">
  <h2 class="wc-h2">五個核心發現 (Core Findings)</h2>

  <p class="wc-meta">從 R4 12 條 claims 中提煉之核心發現，按 R4.1 審計結果分為 SUPPORTED / PARTIALLY_SUPPORTED 兩層。</p>

  <div class="wc-grid">
    <div class="wc-finding">
      <h4><span class="num">1</span>易水源於故安縣閻鄉西山</h4>
      <span class="wc-tag text-reports">TEXT_REPORTS</span><span class="wc-tag supported">SUPPORTED</span>
      <p>《水經注》pid1655 正文首段直接記錄：「<em>易水出涿郡故安縣閻鄉西山</em>」。OCR 校正後（DB「承郡」「間鄉」→「涿郡」「閻鄉」）無誤。<br><small>→ R4-YSH-002 · SHUGE:p124575:1655</small></p>
    </div>

    <div class="wc-finding">
      <h4><span class="num">2</span>範陽-容城「東過」連續動詞</h4>
      <span class="wc-tag text-reports">TEXT_REPORTS</span><span class="wc-tag supported">SUPPORTED</span>
      <p>pid1657 大字標題「<em>東過范陽縣南又東過容城縣南</em>」明確將兩縣串連；同樣結構亦出現於 pid1682 巨馬水章大字標題（不同水系）。<br><small>→ R4-YSH-001 · SHUGE:p124575:1657</small></p>
    </div>

    <div class="wc-finding">
      <h4><span class="num">3</span>易水/濡水/巨馬水/淶水「互攝通稱」</h4>
      <span class="wc-tag textual-inference">TEXTUAL_INFERENCE</span><span class="wc-tag partially">PARTIALLY_SUPPORTED</span>
      <p>pid1659「<em>是則易水與諸水互攝，通稱東逕容城縣故城北</em>」為原書直接用語；「四水分類」為研究者歸納。<br><small>→ R4-YSH-006 · SHUGE:p124575:1659+1682</small></p>
    </div>

    <div class="wc-finding">
      <h4><span class="num">4</span>武陽 = 燕下都（酈道元記錄）</h4>
      <span class="wc-tag text-reports">TEXT_REPORTS</span><span class="wc-tag supported">SUPPORTED</span>
      <p>pid1656「<em>武陽蓋燕昭王之所城也，東西二十里，南北十七里</em>」。R4.1 明確標示：此為酈道元於六世紀之記錄，非二十世紀考古結論。<br><small>→ R4-YSH-009 · SHUGE:p124575:1656</small></p>
    </div>

    <div class="wc-finding">
      <h4><span class="num">5</span>易京城位置：部分文本推論</h4>
      <span class="wc-tag textual-inference">TEXTUAL_INFERENCE</span><span class="wc-tag partially">PARTIALLY_SUPPORTED</span>
      <p>「易京城在易水之南」由 pid1661「<em>易水又東逕易京南</em>」直接支持；但「範陽以東、容城以西」並非 pid1661 直接陳述，而是基於 pid1657 大字標題之文本順序推論。<br><small>→ R4-YSH-011 (CLAIM_011_REVISED=true)</small></p>
    </div>
  </div>

  <div class="wc-disclosure">
    <strong>為何是 5 個而非 7 個 SUPPORTED：</strong>R4 報告「12/12 SUPPORTED」；R4.1 審計後 7 條 SUPPORTED + 5 條 PARTIALLY_SUPPORTED。降級理由見 <a href="#sec-claims">Claims 分類</a> 與 <code>source/YISHUI_CLAIM_AUDIT_R4_1.md</code>。
  </div>
</section>
"""

    section_topology = """
<section class="wc-section" id="sec-topology">
  <h2 class="wc-h2">簡化文本空間拓撲 (CORE Topology)</h2>

  <p class="wc-meta">R4 frozen FULL_TOPOLOGY（72 節點 / 29 邊）完整保留於 <code>data/yishui_textual_topology_r4.json</code>；R4.1 在公開頁面以 9 節點 / 15 邊的 CORE 層呈現，每條邊皆已綁定對應的 R4 claim。</p>

  <h3 class="wc-h3">CORE 節點（9 個）</h3>
  <table class="wc-table">
    <thead><tr><th>ID</th><th>名稱</th><th>類型</th><th>核心角色</th></tr></thead>
    <tbody>
      <tr><td><span class="wc-cite">cn_01</span></td><td>易水</td><td>river</td><td>中央水流</td></tr>
      <tr><td><span class="wc-cite">cn_02</span></td><td>故安</td><td>historical_place</td><td>易水水源</td></tr>
      <tr><td><span class="wc-cite">cn_03</span></td><td>范陽</td><td>historical_place</td><td>易水 + 巨馬水交匯</td></tr>
      <tr><td><span class="wc-cite">cn_04</span></td><td>容城</td><td>historical_place</td><td>易水 + 巨馬水東端</td></tr>
      <tr><td><span class="wc-cite">cn_05</span></td><td>濡水</td><td>river</td><td>北側水系</td></tr>
      <tr><td><span class="wc-cite">cn_06</span></td><td>巨馬水</td><td>river</td><td>南側水系</td></tr>
      <tr><td><span class="wc-cite">cn_07</span></td><td>大利亭</td><td>historical_place</td><td>三水交會地理節點</td></tr>
      <tr><td><span class="wc-cite">cn_08</span></td><td>武陽</td><td>historical_place</td><td>燕下都（R4-YSH-009）</td></tr>
      <tr><td><span class="wc-cite">cn_09</span></td><td>易京</td><td>historical_place</td><td>公孫瓚遷都處（R4-YSH-011）</td></tr>
    </tbody>
  </table>

  <h3 class="wc-h3">CORE 拓撲圖（互動式）</h3>
  <div class="wc-svg-wrap">
    <svg viewBox="0 0 700 700" width="100%" height="auto" style="max-height: 600px;">
      <defs>
        <marker id="arrow-brown" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 z" fill="#8b6b3a"/>
        </marker>
        <marker id="arrow-red" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 z" fill="#b85c38"/>
        </marker>
        <marker id="arrow-blue" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 z" fill="#4a6b8a"/>
        </marker>
      </defs>

      <!-- Edges (drawn first, below nodes) -->
      <!-- ce_001 故安 → 易水 (TEXT_REPORTS) -->
      <line x1="115" y1="265" x2="240" y2="345" class="wc-edge-line" stroke="#8b6b3a" stroke-width="1.5" marker-end="url(#arrow-brown)"/>
      <!-- ce_002 故安 → 易水 城南外東流 (TEXTUAL_INFERENCE) -->
      <line x1="120" y1="290" x2="225" y2="335" class="wc-edge-line" stroke="#b85c38" stroke-width="1.5" stroke-dasharray="3,3" marker-end="url(#arrow-red)"/>
      <!-- ce_003 故安 → 濡水 (TEXTUAL_INFERENCE) -->
      <line x1="140" y1="245" x2="240" y2="170" class="wc-edge-line" stroke="#b85c38" stroke-width="1.5" stroke-dasharray="3,3" marker-end="url(#arrow-red)"/>
      <!-- ce_004 故安 → 大利亭 (TEXT_REPORTS) -->
      <line x1="135" y1="285" x2="335" y2="485" class="wc-edge-line" stroke="#8b6b3a" stroke-width="1.5" marker-end="url(#arrow-brown)"/>
      <!-- ce_005 大利亭 → 巨馬水 (TEXT_REPORTS) -->
      <line x1="355" y1="500" x2="275" y2="535" class="wc-edge-line" stroke="#8b6b3a" stroke-width="1.5" marker-end="url(#arrow-brown)"/>
      <!-- ce_006 易水 → 武陽 (TEXT_REPORTS) -->
      <line x1="225" y1="365" x2="115" y2="445" class="wc-edge-line" stroke="#8b6b3a" stroke-width="1.5" marker-end="url(#arrow-brown)"/>
      <!-- ce_008 易水 → 范陽 (TEXT_REPORTS) -->
      <line x1="265" y1="345" x2="385" y2="345" class="wc-edge-line" stroke="#8b6b3a" stroke-width="1.5" marker-end="url(#arrow-brown)"/>
      <!-- ce_009 易水 → 容城 (TEXT_REPORTS) -->
      <line x1="405" y1="345" x2="485" y2="345" class="wc-edge-line" stroke="#8b6b3a" stroke-width="1.5" marker-end="url(#arrow-brown)"/>
      <!-- ce_010 易水 → 容城 (互攝通稱, TEXT_REPORTS) -->
      <line x1="265" y1="325" x2="485" y2="320" class="wc-edge-line" stroke="#8b6b3a" stroke-width="1.5" marker-end="url(#arrow-brown)"/>
      <!-- ce_011 易水 → 濡水 (互攝, TEXTUAL_INFERENCE) -->
      <line x1="245" y1="315" x2="245" y2="200" class="wc-edge-line" stroke="#b85c38" stroke-width="1.5" stroke-dasharray="3,3" marker-end="url(#arrow-red)"/>
      <!-- ce_012 易水 → 易京 (TEXT_REPORTS + TEXTUAL_INFERENCE partial) -->
      <line x1="280" y1="335" x2="535" y2="255" class="wc-edge-line" stroke="#b85c38" stroke-width="1.5" stroke-dasharray="3,3" marker-end="url(#arrow-red)"/>
      <!-- ce_013 巨馬水 → 范陽 (TEXT_REPORTS) -->
      <line x1="245" y1="525" x2="385" y2="375" class="wc-edge-line" stroke="#4a6b8a" stroke-width="1.5" marker-end="url(#arrow-blue)"/>
      <!-- ce_014 易水 → 巨馬水 (TEXTUAL_INFERENCE) -->
      <line x1="255" y1="375" x2="245" y2="515" class="wc-edge-line" stroke="#b85c38" stroke-width="1.5" stroke-dasharray="3,3" marker-end="url(#arrow-red)"/>
      <!-- ce_015 巨馬水 → 容城 (TEXT_REPORTS) -->
      <line x1="275" y1="535" x2="485" y2="375" class="wc-edge-line" stroke="#4a6b8a" stroke-width="1.5" marker-end="url(#arrow-blue)"/>
      <!-- ce_007 武陽 self-loop (燕下都, R4-YSH-009) -->
      <path d="M 95 480 Q 65 510 95 510 Q 130 510 110 470" fill="none" stroke="#8b6b3a" stroke-width="1.5" marker-end="url(#arrow-brown)"/>

      <!-- Nodes (drawn last, on top) -->
      <g font-family="'Noto Sans SC', sans-serif" font-size="14" text-anchor="middle">
        <!-- cn_01 易水 -->
        <circle cx="250" cy="350" r="28" fill="#fff9e6" stroke="#b85c38" stroke-width="2.5" class="wc-node-circle"/>
        <text x="250" y="355" fill="#2a2620">易水</text>
        <!-- cn_02 故安 -->
        <circle cx="100" cy="250" r="22" fill="#fff" stroke="#4a6b8a" stroke-width="2" class="wc-node-circle"/>
        <text x="100" y="255" fill="#2a2620">故安</text>
        <!-- cn_03 范陽 -->
        <circle cx="400" cy="350" r="22" fill="#fff" stroke="#4a6b8a" stroke-width="2" class="wc-node-circle"/>
        <text x="400" y="355" fill="#2a2620">范陽</text>
        <!-- cn_04 容城 -->
        <circle cx="500" cy="350" r="22" fill="#fff" stroke="#4a6b8a" stroke-width="2" class="wc-node-circle"/>
        <text x="500" y="355" fill="#2a2620">容城</text>
        <!-- cn_05 濡水 -->
        <circle cx="250" cy="150" r="22" fill="#dde9f3" stroke="#4a6b8a" stroke-width="2" class="wc-node-circle"/>
        <text x="250" y="155" fill="#2a2620">濡水</text>
        <!-- cn_06 巨馬水 -->
        <circle cx="250" cy="550" r="22" fill="#dde9f3" stroke="#4a6b8a" stroke-width="2" class="wc-node-circle"/>
        <text x="250" y="555" fill="#2a2620">巨馬水</text>
        <!-- cn_07 大利亭 -->
        <circle cx="350" cy="500" r="22" fill="#fff" stroke="#4a6b8a" stroke-width="2" class="wc-node-circle"/>
        <text x="350" y="505" fill="#2a2620">大利亭</text>
        <!-- cn_08 武陽 -->
        <circle cx="100" cy="450" r="22" fill="#fff9e6" stroke="#b85c38" stroke-width="2" class="wc-node-circle"/>
        <text x="100" y="455" fill="#2a2620">武陽</text>
        <!-- cn_09 易京 -->
        <circle cx="550" cy="250" r="22" fill="#fff9e6" stroke="#b85c38" stroke-width="2" class="wc-node-circle"/>
        <text x="550" y="255" fill="#2a2620">易京</text>
      </g>

      <!-- Edge legend -->
      <g font-family="'Noto Sans SC', sans-serif" font-size="11" fill="#6b6151">
        <line x1="20" y1="620" x2="50" y2="620" stroke="#8b6b3a" stroke-width="1.5"/>
        <text x="55" y="624">TEXT_REPORTS 直接引文</text>
        <line x1="200" y1="620" x2="230" y2="620" stroke="#b85c38" stroke-width="1.5" stroke-dasharray="3,3"/>
        <text x="235" y="624">TEXTUAL_INFERENCE 推論</text>
        <line x1="400" y1="620" x2="430" y2="620" stroke="#4a6b8a" stroke-width="1.5"/>
        <text x="435" y="624">巨馬水章</text>
      </g>
    </svg>
  </div>

  <h3 class="wc-h3">Claim-to-Edge 綁定（15 條）</h3>
  <table class="wc-table">
    <thead><tr><th>Edge</th><th>Subject</th><th>Predicate</th><th>Object</th><th>Claim</th><th>PID</th><th>Status</th></tr></thead>
    <tbody>
      <tr><td><span class="wc-cite">ce_001</span></td><td>故安</td><td>易水出於</td><td>易水</td><td>R4-YSH-002</td><td>1655</td><td><span class="wc-tag text-reports">TEXT_REPORTS</span></td></tr>
      <tr><td><span class="wc-cite">ce_002</span></td><td>故安</td><td>易水逕城南外東流</td><td>易水</td><td>R4-YSH-003</td><td>1656</td><td><span class="wc-tag textual-inference">TEXTUAL_INFERENCE</span></td></tr>
      <tr><td><span class="wc-cite">ce_003</span></td><td>故安</td><td>位於濡水之南</td><td>濡水</td><td>R4-YSH-003</td><td>1659</td><td><span class="wc-tag textual-inference">TEXTUAL_INFERENCE</span></td></tr>
      <tr><td><span class="wc-cite">ce_004</span></td><td>故安</td><td>故安水東南至大利亭</td><td>大利亭</td><td>R4-YSH-007</td><td>1659</td><td><span class="wc-tag text-reports">TEXT_REPORTS</span></td></tr>
      <tr><td><span class="wc-cite">ce_005</span></td><td>大利亭</td><td>合易水注巨馬水</td><td>巨馬水</td><td>R4-YSH-007</td><td>1659</td><td><span class="wc-tag text-reports">TEXT_REPORTS</span></td></tr>
      <tr><td><span class="wc-cite">ce_006</span></td><td>易水</td><td>逕武陽南</td><td>武陽</td><td>R4-YSH-009</td><td>1656</td><td><span class="wc-tag text-reports">TEXT_REPORTS</span></td></tr>
      <tr><td><span class="wc-cite">ce_007</span></td><td>武陽</td><td>酈道元記為燕下都</td><td>武陽 (self)</td><td>R4-YSH-009</td><td>1656</td><td><span class="wc-tag text-reports">TEXT_REPORTS</span></td></tr>
      <tr><td><span class="wc-cite">ce_008</span></td><td>易水</td><td>東過范陽縣南</td><td>范陽</td><td>R4-YSH-001</td><td>1657</td><td><span class="wc-tag text-reports">TEXT_REPORTS</span></td></tr>
      <tr><td><span class="wc-cite">ce_009</span></td><td>易水</td><td>又東過容城縣南</td><td>容城</td><td>R4-YSH-001</td><td>1657</td><td><span class="wc-tag text-reports">TEXT_REPORTS</span></td></tr>
      <tr><td><span class="wc-cite">ce_010</span></td><td>易水</td><td>通稱東逕容城縣故城北</td><td>容城</td><td>R4-YSH-006</td><td>1659</td><td><span class="wc-tag text-reports">TEXT_REPORTS</span></td></tr>
      <tr><td><span class="wc-cite">ce_011</span></td><td>易水</td><td>同入濡水</td><td>濡水</td><td>R4-YSH-006</td><td>1659</td><td><span class="wc-tag textual-inference">TEXTUAL_INFERENCE</span></td></tr>
      <tr><td><span class="wc-cite">ce_012</span></td><td>易水</td><td>東逕易京南</td><td>易京</td><td>R4-YSH-011</td><td>1661</td><td><span class="wc-tag partially">PARTIAL (見 ce_012 註)</span></td></tr>
      <tr><td><span class="wc-cite">ce_013</span></td><td>巨馬水</td><td>東南逕范陽縣故城北</td><td>范陽</td><td>R4-YSH-004</td><td>1682</td><td><span class="wc-tag text-reports">TEXT_REPORTS</span></td></tr>
      <tr><td><span class="wc-cite">ce_014</span></td><td>易水</td><td>注於巨馬水</td><td>巨馬水</td><td>R4-YSH-006</td><td>1682</td><td><span class="wc-tag textual-inference">TEXTUAL_INFERENCE</span></td></tr>
      <tr><td><span class="wc-cite">ce_015</span></td><td>巨馬水</td><td>又東南過容城縣北</td><td>容城</td><td>R4-YSH-004</td><td>1682</td><td><span class="wc-tag text-reports">TEXT_REPORTS</span></td></tr>
    </tbody>
  </table>

  <details class="wc-details">
    <summary>FULL_TOPOLOGY（72 節點 / 29 邊）— R4 frozen 完整保留</summary>
    <p style="margin-top: 0.5rem;">R4 FULL_TOPOLOGY JSON <code>data/yishui_textual_topology_r4.json</code>（19257 B）完整保留，不做任何修改。<br>
    R4.1 公開頁面僅呈現 CORE 9 節點 / 15 邊；FULL 數據可從 R4 frozen JSON 直接讀取，<br>
    或參見 <a href="https://github.com/conanxin/conanxin.github.io/blob/main/projects/shuge/research/water-classic/data/yishui_textual_topology_r4.json"><code>github.com/conanxin/conanxin.github.io/blob/main/projects/shuge/research/water-classic/data/yishui_textual_topology_r4.json</code></a>。</p>
    <p>FULL 統計：節點類型 = historical_place / lake / mountain / river / tributary（5 種）；<br>
    邊關係類型 = origin_from / flow_east / flows_into / passes_south_of / passes_north_of / historical_relation / south_of_city_east_flow / confluences_with / enters_into / passes_east_of / location_in（11 種）。</p>
  </details>
</section>
"""

    section_text = """
<section class="wc-section" id="sec-text">
  <h2 class="wc-h2">關鍵原文 (Key Primary Text)</h2>

  <p class="wc-meta">以下引文均直接取自 <strong>國立公文書館藏《水經注》明吳琯校本</strong>（卷十一 易水/滱水），由 R4 AI multimodal vision (view_image tool) 視覺校核後確認。</p>

  <div class="wc-card support">
    <h4>① pid1655 p0002 · 易水起源</h4>
    <span class="wc-tag text-reports">TEXT_REPORTS</span>
    <div class="wc-excerpt">易水出涿郡故安縣閻鄉西山。</div>
    <p><span class="wc-cite">SHUGE:p124575:1655</span> &nbsp;|&nbsp; <small>→ R4-YSH-002 · core_001</small></p>
  </div>

  <div class="wc-card support">
    <h4>② pid1657 p0004 · 易水章大字標題</h4>
    <span class="wc-tag text-reports">TEXT_REPORTS</span>
    <div class="wc-excerpt">東過范陽縣南又東過容城縣南</div>
    <p><span class="wc-cite">SHUGE:p124575:1657</span> &nbsp;|&nbsp; <small>→ R4-YSH-001 · core_008+core_009</small></p>
  </div>

  <div class="wc-card partial">
    <h4>③ pid1659 · 易水與諸水互攝</h4>
    <span class="wc-tag text-reports">TEXT_REPORTS</span>
    <div class="wc-excerpt">北濡又並亂流入淶，是則易水與諸水互攝，通稱東逕容城縣故城北，渾濤東注，至勃海平舒縣與易水合。</div>
    <p><span class="wc-cite">SHUGE:p124575:1659</span> &nbsp;|&nbsp; <small>→ R4-YSH-006 · core_010+core_011</small></p>
  </div>

  <div class="wc-card support">
    <h4>④ pid1661 · 范陽=范水之陽（應劭解釋）</h4>
    <span class="wc-tag text-reports">TEXT_REPORTS</span>
    <div class="wc-excerpt">易水自下有范水通目，又東逕范陽縣故城南，即應劭所謂范水之陽也。</div>
    <p><span class="wc-cite">SHUGE:p124575:1661</span> &nbsp;|&nbsp; <small>→ R4-YSH-008 · 此為酈道元所引應劭《風俗通》之說</small></p>
  </div>

  <div class="wc-card correction">
    <h4>⑤ pid1661 · 三項獨立漢代封國（R4.1 修正）</h4>
    <span class="wc-tag text-reports">TEXT_REPORTS</span>
    <div class="wc-excerpt">易水東逕容城縣故城南，漢高帝六年封趙將夕於<strong>深澤</strong>，景帝中元三年以封匈奴降王攜徐盧於<strong>容城</strong>，皆爲侯國，王莽更名深澤。</div>
    <p><span class="wc-cite">SHUGE:p124575:1661</span> &nbsp;|&nbsp; <small>→ R4-YSH-012 (CLAIM_012_CORRECTED=true) · <strong>深澤 ≠ 容城</strong></small></p>
  </div>
</section>
"""

    section_claims = """
<section class="wc-section" id="sec-claims">
  <h2 class="wc-h2">Claims 分類（12 條）</h2>

  <p class="wc-meta">R4.1 將 12 條 claims 按 <strong>證據等級 × 證據類型</strong> 分為四類。完整審計見 <code>source/YISHUI_CLAIM_AUDIT_R4_1.md</code>。</p>

  <h3 class="wc-h3" style="color: var(--wc-support);">一、文本可以直接支持（TEXT_REPORTS + SUPPORTED · 7 條）</h3>
  <p>這些 claim 可由《水經注》原書文字直接驗證，無需讀者做文本順序推論。</p>

  <div class="wc-card support">
    <h4>R4-YSH-001 · TEXTUAL_ORDER</h4>
    <p>《水經注》pid1657 大字標題「東過范陽縣南又東過容城縣南」直接記錄範陽-容城之順序與「東過」動詞串聯。</p>
    <p><span class="wc-tag text-reports">TEXT_REPORTS</span><span class="wc-tag supported">SUPPORTED</span><span class="wc-cite">SHUGE:p124575:1657</span></p>
  </div>

  <div class="wc-card support">
    <h4>R4-YSH-002 · TEXTUAL_ORDER</h4>
    <p>《水經注》pid1655 正文首段「易水出涿郡故安縣閻鄉西山」。</p>
    <p><span class="wc-tag text-reports">TEXT_REPORTS</span><span class="wc-tag supported">SUPPORTED</span><span class="wc-cite">SHUGE:p124575:1655</span></p>
  </div>

  <div class="wc-card support">
    <h4>R4-YSH-005 · SPATIAL_LANGUAGE</h4>
    <p>《水經注》易水章中「城南/城北/城東/城西」方位詞反覆出現於多個 pid，可由 spatial_relations JSON 驗證。</p>
    <p><span class="wc-tag text-reports">TEXT_REPORTS</span><span class="wc-tag supported">SUPPORTED</span><span class="wc-cite">SHUGE:p124575:1656+1657+1659+1661+1682</span></p>
  </div>

  <div class="wc-card support">
    <h4>R4-YSH-007 · HYDROLOGICAL_RELATION</h4>
    <p>pid1659「其水又東南流於容城縣西北大利亭東南，合易水而注巨馬水也」直接記錄大利亭作為三水交會地理節點。</p>
    <p><span class="wc-tag text-reports">TEXT_REPORTS</span><span class="wc-tag supported">SUPPORTED</span><span class="wc-cite">SHUGE:p124575:1659</span></p>
  </div>

  <div class="wc-card support">
    <h4>R4-YSH-008 · HISTORICAL_INTERPRETATION <small>(酈道元引應劭)</small></h4>
    <p>pid1661「即應劭所謂范水之陽也」。「範陽=范水之陽」為酈道元所引應劭《風俗通》之解釋，並非現代獨立考證。</p>
    <p><span class="wc-tag text-reports">TEXT_REPORTS</span><span class="wc-tag supported">SUPPORTED</span><span class="wc-cite">SHUGE:p124575:1661</span></p>
  </div>

  <div class="wc-card support">
    <h4>R4-YSH-009 · HISTORICAL_INTERPRETATION <small>(酈道元記錄)</small></h4>
    <p>pid1656「武陽蓋燕昭王之所城也，東西二十里，南北十七里」「故燕之下都擅武陽之名」。此為酈道元於六世紀之記錄，非二十世紀考古結論。</p>
    <p><span class="wc-tag text-reports">TEXT_REPORTS</span><span class="wc-tag supported">SUPPORTED</span><span class="wc-cite">SHUGE:p124575:1656</span></p>
  </div>

  <div class="wc-card support">
    <h4>R4-YSH-010 · HISTORICAL_INTERPRETATION <small>(酈道元引耆舊)</small></h4>
    <p>pid1657「金毫陂西畔有蘭馬臺」「訪諸耆舊，咸言昭王禮賓，廣延方士，至如郭隗、樂毅之徒」。金臺、蘭馬臺與燕昭王禮賓郭隗之關係引自耆舊傳聞，非現代考古實證。</p>
    <p><span class="wc-tag text-reports">TEXT_REPORTS</span><span class="wc-tag supported">SUPPORTED</span><span class="wc-cite">SHUGE:p124575:1657</span></p>
  </div>

  <h3 class="wc-h3" style="color: var(--wc-partial);">二、文本推論（TEXTUAL_INFERENCE + PARTIALLY_SUPPORTED · 5 條）</h3>
  <p>這些 claim 需要讀者基於文本順序做推論；個別引文可能存在，但 claim 整體屬於研究者歸納。</p>

  <div class="wc-card partial">
    <h4>R4-YSH-003 · SPATIAL_LANGUAGE <small>(研究者三型框架)</small></h4>
    <p>個別引文為 TEXT_REPORTS；但「故安-易水關係三型分類」屬於研究者歸納框架，原書並未明確標示此分類。</p>
    <p><span class="wc-tag textual-inference">TEXTUAL_INFERENCE</span><span class="wc-tag partially">PARTIALLY_SUPPORTED</span><span class="wc-cite">SHUGE:p124575:1655+1656</span></p>
  </div>

  <div class="wc-card partial">
    <h4>R4-YSH-004 · SPATIAL_LANGUAGE <small>(跨水系)</small></h4>
    <p>pid1657 易水章與 pid1682 巨馬水章均出現「東過 + 縣南」結構，但二者屬不同水系；R4.1 明確警示不應混稱為「同一水流的連續動詞」。</p>
    <p><span class="wc-tag textual-inference">TEXTUAL_INFERENCE</span><span class="wc-tag partially">PARTIALLY_SUPPORTED</span><span class="wc-cite">SHUGE:p124575:1657+1682</span></p>
  </div>

  <div class="wc-card partial">
    <h4>R4-YSH-006 · HYDROLOGICAL_RELATION <small>(四水分類)</small></h4>
    <p>「互攝」「通稱」可由 pid1659 直接引文支持；但「易水/濡水/巨馬水/淶水」四水分類屬歸納性，且現代水系驗證非本階段任務。</p>
    <p><span class="wc-tag textual-inference">TEXTUAL_INFERENCE</span><span class="wc-tag partially">PARTIALLY_SUPPORTED</span><span class="wc-cite">SHUGE:p124575:1659+1682</span></p>
  </div>

  <div class="wc-card partial">
    <h4>R4-YSH-011 · HISTORICAL_INTERPRETATION <small>(方位推論)</small> &nbsp; <strong style="color: var(--wc-warm);">CLAIM_011_REVISED=true</strong></h4>
    <p>「易京城在易水之南」由「易水又東逕易京南」直接支持；「範陽以東、容城以西」並非 pid1661 直接陳述，而是基於 pid1657 大字標題之文本順序推論。</p>
    <p><span class="wc-tag textual-inference">TEXTUAL_INFERENCE</span><span class="wc-tag partially">PARTIALLY_SUPPORTED</span><span class="wc-cite">SHUGE:p124575:1657+1661</span></p>
  </div>

  <div class="wc-card partial">
    <h4>R4-YSH-012 · HISTORICAL_INTERPRETATION <small>(封國修正)</small> &nbsp; <strong style="color: var(--wc-warm);">CLAIM_012_CORRECTED=true</strong></h4>
    <p>原 R4 將「趙將某於深澤」誤歸屬容城封國；R4.1 已將三項 enfeoffment 拆分為範陽封國、容城封國、深澤封國。</p>
    <p><span class="wc-tag textual-inference">TEXTUAL_INFERENCE</span><span class="wc-tag partially">PARTIALLY_SUPPORTED</span><span class="wc-cite">SHUGE:p124575:1657+1661</span></p>
  </div>

  <h3 class="wc-h3" style="color: var(--wc-cool);">三、外部資料已校核（HISTORICAL_CORROBORATED · 0 條）</h3>
  <p>本階段所有 claim 皆基於《水經注》文本與其內部引用（應劭、耆舊、班固《地理志》、闞駰等）；未由<strong>外部獨立史料</strong>（如《漢書》紀傳、考古報告、實測地圖）做獨立校核。<br>
  R4.1 已對 EXT-WIKI-001、EXT-CTEXT-001、EXT-YANG-1905 三個外部 source 標示 verification_status=ACCESSED，但 PASSAGE_VERIFIED_SOURCES=0（未獨立逐句比對）。</p>

  <h3 class="wc-h3" style="color: var(--wc-uncertain);">四、仍待考證（counterevidence / 修正 · R4.1 新增）</h3>
  <div class="wc-card uncertain">
    <h4>R4-YSH-012 · 深澤 ≠ 容城（封國事件拆分）</h4>
    <p>pid1661 引文「漢高帝六年封趙將某於<strong>深澤</strong>」與「景帝中元三年以封匈奴降王攜徐盧於<strong>容城</strong>」明確區分兩個獨立封國事件。原 R4 將「趙將某」誤歸容城；R4.1 拆分為獨立 deep-澤 enfeoffment。</p>
  </div>
  <div class="wc-card uncertain">
    <h4>R4-YSH-011 · 「範陽以東、容城以西」屬文本順序推論</h4>
    <p>原 R4 claim_text 將「易水之南」「範陽以東」「容城以西」三項並列為 SUPPORTED。R4.1 修正：僅「易水之南」由 pid1661 直接引文支持；「範陽以東、容城以西」屬 TEXTUAL_INFERENCE，依賴讀者接受 pid1657 大字標題「東過范陽縣南又東過容城縣南」之順序。</p>
  </div>
  <div class="wc-card uncertain">
    <h4>EXT-CHEN-2007 異文「攜徐盧 / 撅徐盧」</h4>
    <p>陳橋驛《水經注校證》(2007) 註明「攜徐盧」一作「撅徐盧」。R4.1 不採信 EXT-CHEN-2007 URL（zhihu.com/question/... 為 placeholder），但保留此異文記錄為 VARIANT_PASSAGES=1。</p>
  </div>
</section>
"""

    section_uncertainty = """
<section class="wc-section" id="sec-uncertainty">
  <h2 class="wc-h2">不確定性 (Uncertainty)</h2>

  <h3 class="wc-h3">已識別的不確定性</h3>
  <table class="wc-table">
    <thead><tr><th>類型</th><th>詳情</th><th>R4.1 處理</th></tr></thead>
    <tbody>
      <tr>
        <td>OCR 不確定字符</td>
        <td>40 個不確定字符（記錄於 <code>data/yishui_image_review_r4.json</code>）</td>
        <td>已在 controlled transcription 中標示 □ 或 〔未识〕；不直接填補</td>
      </tr>
      <tr>
        <td>OCR 校正</td>
        <td>30 條 OCR 校正（DB OCR → 視覺確認），如「承郡」→「涿郡」、「間鄉」→「閻鄉」</td>
        <td>已記錄於 image review；R4.1 引用時使用校正後文本</td>
      </tr>
      <tr>
        <td>深澤/容城混淆</td>
        <td>R4-YSH-012 原 claim 將「趙將某於深澤」誤歸容城封國</td>
        <td><strong>CLAIM_012_CORRECTED=true</strong>：拆分為三項獨立 enfeoffment</td>
      </tr>
      <tr>
        <td>R4-YSH-011 推論範圍</td>
        <td>「範陽以東、容城以西」並非 pid1661 直接陳述</td>
        <td><strong>CLAIM_011_REVISED=true</strong>：明示屬 TEXTUAL_INFERENCE</td>
      </tr>
      <tr>
        <td>EXT-CHEN-2007 異文</td>
        <td>「攜徐盧」/「撅徐盧」（陳橋驛《水經注校證》2007）</td>
        <td>保留為 VARIANT_PASSAGES=1；URL 為 placeholder，不採信</td>
      </tr>
      <tr>
        <td>外部 URL 狀態</td>
        <td>3 個 placeholder URL（zhihu/.../zhbc/.../https://...）</td>
        <td>降級為 IDENTIFIED；不計入 CORROBORATES</td>
      </tr>
      <tr>
        <td>REAL_WORLD_LOCATION</td>
        <td>現代地圖匹配</td>
        <td>UNRESOLVED — 本階段不以現代地圖匹配為目標</td>
      </tr>
    </tbody>
  </table>

  <h3 class="wc-h3">Reviewer Honesty Disclosure</h3>
  <div class="wc-disclosure">
    <strong>PROXY_REVIEW ≠ human-eye-on-page-image review.</strong>
    R4 對 12 頁的「視覺確認」皆透過 openclaw AI multimodal vision（view_image 工具）對 workspace-copied JPEG bytes 進行；這<strong>不是</strong>真實的人眼對原書掃描頁的確認。
    對話層級如下：<br>
    - DB OCR (rapidocr PP-OCRv4-mobile) → 原始 <code>raw_ocr_layer</code>；<br>
    - openclaw AI vision (view_image) → <code>image_checked_transcription_layer</code>；<br>
    - 手動正規化（套用 OCR 校正 + 過濾）→ <code>normalized_research_reading_layer</code>。
  </div>
</section>
"""

    section_sources = """
<section class="wc-section" id="sec-sources">
  <h2 class="wc-h2">來源 (Sources)</h2>

  <p class="wc-meta">外部校核資料按 <strong>source_role</strong> 與 <strong>verification_status</strong> 重新標示。完整審計見 <code>source/YISHUI_SOURCE_AUDIT_R4_1.md</code>。</p>

  <h3 class="wc-h3">Source-level 統計</h3>
  <table class="wc-table">
    <thead><tr><th>層級</th><th>數值</th></tr></thead>
    <tbody>
      <tr><td><strong>PRIMARY_SOURCES</strong></td><td>1（國立公文書館 scan，不計入 external count）</td></tr>
      <tr><td><strong>EXTERNAL_SOURCES</strong></td><td>6</td></tr>
      <tr><td><strong>PASSAGE_VERIFIED_SOURCES</strong></td><td>0（R4.1 未獨立逐句比對）</td></tr>
      <tr><td><strong>CORROBORATING_PASSAGES</strong></td><td>6（僅 ACCESSED 之 3 sources）</td></tr>
      <tr><td><strong>VARIANT_PASSAGES</strong></td><td>1（CHEN-2007 「攜徐盧」/「撅徐盧」，URL placeholder）</td></tr>
      <tr><td><strong>CONTRADICTING_PASSAGES</strong></td><td>0</td></tr>
      <tr><td><strong>BACKGROUND_ONLY</strong></td><td>1（王國維《水經注校》）</td></tr>
    </tbody>
  </table>

  <h3 class="wc-h3">7 個來源詳表</h3>
  <table class="wc-table">
    <thead><tr><th>source_id</th><th>source_role</th><th>verification_status</th><th>URL 狀態</th><th>relation</th></tr></thead>
    <tbody>
      <tr>
        <td><span class="wc-cite">EXT-NII-DIGITAL</span></td>
        <td><span class="wc-tag primary">PRIMARY</span></td>
        <td><span class="wc-tag accessed">LOCATED</span></td>
        <td>真實 IIIF URL（國立公文書館）</td>
        <td>SELF（PRIMARY）</td>
      </tr>
      <tr>
        <td><span class="wc-cite">EXT-WIKI-001</span></td>
        <td><span class="wc-tag accessed">DIGITAL_TEXT</span></td>
        <td><span class="wc-tag accessed">ACCESSED</span></td>
        <td>真實 Wikisource URL</td>
        <td><span style="color: var(--wc-support);">CORROBORATES</span></td>
      </tr>
      <tr>
        <td><span class="wc-cite">EXT-CTEXT-001</span></td>
        <td><span class="wc-tag accessed">DIGITAL_TEXT</span></td>
        <td><span class="wc-tag accessed">ACCESSED</span></td>
        <td>真實 ctext.org URL</td>
        <td><span style="color: var(--wc-support);">CORROBORATES</span></td>
      </tr>
      <tr>
        <td><span class="wc-cite">EXT-YANG-1905</span></td>
        <td><span class="wc-tag accessed">SCHOLARLY_EDITION</span></td>
        <td><span class="wc-tag accessed">ACCESSED</span></td>
        <td>真實 ctext.org wiki URL（楊守敬《水經注疏》1905）</td>
        <td><span style="color: var(--wc-support);">CORROBORATES</span></td>
      </tr>
      <tr>
        <td><span class="wc-cite">EXT-CHEN-2007</span></td>
        <td><span class="wc-tag accessed">SCHOLARLY_EDITION</span></td>
        <td><span class="wc-tag identified">IDENTIFIED</span></td>
        <td><strong style="color: var(--wc-uncertain);">zhihu.com/question/... placeholder</strong></td>
        <td><span style="color: var(--wc-uncertain);">CLAIMED_BUT_NOT_VERIFIED（降級自 CORROBORATES）</span></td>
      </tr>
      <tr>
        <td><span class="wc-cite">EXT-WANG-1956</span></td>
        <td><span class="wc-tag accessed">SCHOLARLY_EDITION</span></td>
        <td><span class="wc-tag identified">IDENTIFIED</span></td>
        <td><strong style="color: var(--wc-uncertain);">https://... placeholder</strong></td>
        <td><span style="color: var(--wc-uncertain);">BACKGROUND_ONLY</span></td>
      </tr>
      <tr>
        <td><span class="wc-cite">EXT-ZHONGHUA-2013</span></td>
        <td><span class="wc-tag accessed">SCHOLARLY_EDITION</span></td>
        <td><span class="wc-tag identified">IDENTIFIED</span></td>
        <td><strong style="color: var(--wc-uncertain);">zhbc.com/... placeholder</strong></td>
        <td><span style="color: var(--wc-uncertain);">CLAIMED_BUT_NOT_VERIFIED（降級自 CORROBORATES）</span></td>
      </tr>
    </tbody>
  </table>

  <div class="wc-disclosure">
    <strong>R4 → R4.1 降級記錄：</strong>3 個 placeholder-URL sources（CHEN-2007、ZHONGHUA-2013、WANG-1956）從「CORROBORATES / BACKGROUND_ONLY」降級為「CLAIMED_BUT_NOT_VERIFIED / IDENTIFIED」。<br>
    PRIMARY source（EXT-NII-DIGITAL）從 EXTERNAL_SOURCES 列表中<strong>移除</strong>，獨立標示為 PRIMARY。
  </div>
</section>
"""

    section_method = """
<section class="wc-section" id="sec-method">
  <h2 class="wc-h2">方法論邊界 (Methodology & Boundaries)</h2>

  <h3 class="wc-h3">硬邊界 (Hard Boundaries) · 全部 ✓</h3>
  <table class="wc-table">
    <thead><tr><th>約束</th><th>值</th><th>R4.1 狀態</th></tr></thead>
    <tbody>
      <tr><td>NEW_OCR</td><td>0</td><td>✓</td></tr>
      <tr><td>NEW_PRIMARY_ACQUISITION</td><td>0</td><td>✓</td></tr>
      <tr><td>DB_WRITES</td><td>0</td><td>✓</td></tr>
      <tr><td>EMBEDDINGS</td><td>0</td><td>✓</td></tr>
      <tr><td>MODERN_MAPPING_CLAIMS</td><td>0</td><td>✓（R4.1 禁止）</td></tr>
      <tr><td>R4_BASELINE_PRESERVED</td><td>true</td><td>✓（R4 frozen JSON 不被覆寫）</td></tr>
      <tr><td>FULL_TOPOLOGY_PRESERVED</td><td>true</td><td>✓（72 nodes / 29 edges 完整保留）</td></tr>
    </tbody>
  </table>

  <h3 class="wc-h3">Frozen Infrastructure</h3>
  <table class="wc-table">
    <thead><tr><th>階段</th><th>Commit</th></tr></thead>
    <tbody>
      <tr><td>v1.0</td><td><span class="wc-cite">3a51ef5</span></td></tr>
      <tr><td>R1</td><td><span class="wc-cite">59d258e</span></td></tr>
      <tr><td>R2</td><td><span class="wc-cite">3883455b</span></td></tr>
      <tr><td>R2.1</td><td><span class="wc-cite">fda2ecb</span></td></tr>
      <tr><td>R2.2</td><td><span class="wc-cite">8a5a130</span></td></tr>
      <tr><td>R3</td><td><span class="wc-cite">9ce93a2</span></td></tr>
      <tr><td>R3.1</td><td><span class="wc-cite">8326c62</span></td></tr>
      <tr><td>R3.2</td><td><span class="wc-cite">7ae2ccf</span></td></tr>
      <tr><td>R3.3</td><td><span class="wc-cite">d8d970f</span></td></tr>
      <tr><td>R3.4</td><td><span class="wc-cite">b37202a</span></td></tr>
      <tr><td><strong>R4</strong></td><td><span class="wc-cite"><strong>582c852</strong></span> ← frozen as research baseline</td></tr>
      <tr><td><strong>R4.1</strong></td><td><span class="wc-cite">audit overlay only</span></td></tr>
    </tbody>
  </table>

  <h3 class="wc-h3">R4.1 輸出清單</h3>
  <ul style="line-height: 2;">
    <li><code>data/yishui_claims_r4_1.json</code>（21241 B · 12 claims with truth_scope + revised support）</li>
    <li><code>data/yishui_external_sources_r4_1.json</code>（13217 B · 7 sources with source_role + verification_status）</li>
    <li><code>data/yishui_core_topology_r4_1.json</code>（10613 B · 9 core nodes + 15 core edges + claim-to-edge binding）</li>
    <li><code>source/YISHUI_CLAIM_AUDIT_R4_1.md</code>（17607 B · per-claim analysis）</li>
    <li><code>source/YISHUI_SOURCE_AUDIT_R4_1.md</code>（9551 B · per-source provenance audit）</li>
    <li><code>source/YISHUI_TOPOLOGY_AUDIT_R4_1.md</code>（6755 B · layout bug fix + CORE/FULL split）</li>
    <li><code>yishui/index.html</code>（R4.1 audit-version public page · 本文）</li>
  </ul>
</section>

<section class="wc-section" id="sec-secondary">
  <h2 class="wc-h2">二級細節 (Secondary Details · 摺疊)</h2>

  <details class="wc-details">
    <summary>FULL_TOPOLOGY（72 節點 / 29 邊）原始資料</summary>
    <p style="margin-top: 0.5rem;">R4 FULL_TOPOLOGY 完整保留於 <code>data/yishui_textual_topology_r4.json</code>（19257 B）。<br>
    節點類型：historical_place / lake / mountain / river / tributary（5 種）；<br>
    邊關係類型：origin_from / flow_east / flows_into / passes_south_of / passes_north_of / historical_relation / south_of_city_east_flow / confluences_with / enters_into / passes_east_of / location_in（11 種）。</p>
  </details>

  <details class="wc-details">
    <summary>Spatial Relations（96 條）統計</summary>
    <p style="margin-top: 0.5rem;">96 條 spatial_relations 分布於 7 個 core pages：<br>
    pid1655 = 6 條 / pid1656 = 24 條 / pid1657 = 10 條 / pid1659 = 19 條 / pid1660 = 16 條 / pid1661 = 11 條 / pid1682 = 10 條。<br>
    空間動詞：出 / 東流 / 西流 / 南流 / 北流 / 東過 / 西過 / 南過 / 北過 / 經 / 注 / 合 / 會 / 入 / 城南 / 城北 / 城東 / 城西 / 入于 / 東入（20 種）。</p>
  </details>

  <details class="wc-details">
    <summary>Controlled Transcription 三層（7 cores）</summary>
    <p style="margin-top: 0.5rem;">每頁 3 層：raw_ocr_layer（DB OCR） / image_checked_transcription_layer（AI vision） / normalized_research_reading_layer（正規化）。<br>
    不確定字符總計：40 個；OCR 校正總計：30 條。</p>
  </details>

  <details class="wc-details">
    <summary>R4 → R4.1 版本日誌</summary>
    <ul style="margin-top: 0.5rem;">
      <li><strong>R4 (582c852)</strong> · 首輪歷史研究成果 · 12 claims all "SUPPORTED" · 96 relations / 72 nodes</li>
      <li><strong>R4.1 (audit overlay)</strong> · 學術審計層 · 7 SUPPORTED + 5 PARTIALLY_SUPPORTED · CLAIM_011_REVISED + CLAIM_012_CORRECTED · CORE_TOPOLOGY 9/15 + FULL 72/29 preserved · 3 sources ACCESSED + 3 IDENTIFIED + 1 PRIMARY</li>
    </ul>
  </details>
</section>
"""

    section_completion = """
<section class="wc-section" id="sec-completion">
  <h2 class="wc-h2">研究結論 (Conclusions)</h2>

  <h3 class="wc-h3">RQ1 · 空間語言結構</h3>
  <p>《水經注》易水章之空間語言可分為兩層：(1) <strong>直接引文層</strong>（TEXT_REPORTS）—— pid1657 大字標題、pid1655 正文首段、pid1659 易水-諸水互攝、pid1661 應劭解釋等，皆由原書文字直接支持；(2) <strong>研究者歸納層</strong>（TEXTUAL_INFERENCE）—— 三型分類、四水分類、「範陽以東、容城以西」等推論，需讀者自行做文本順序推論。</p>

  <h3 class="wc-h3">RQ2 · 文本空間拓撲</h3>
  <p>9 個 CORE 節點 + 15 條 CORE 邊構成易水-諸水-范陽-容城-故安-武陽-易京的精簡拓撲；FULL_TOPOLOGY 72 節點 / 29 邊保留為次級資料。每條 CORE 邊皆已綁定對應 R4 claim 與 SHUGE citation。</p>

  <h3 class="wc-h3">RQ3 · 證據等級與外部校核</h3>
  <p>R4.1 將 12 條 claims 重新分類為四層（文本可以直接支持 7 條 / 文本推論 5 條 / 外部資料已校核 0 條 / 仍待考證 3 項修正）。R4-YSH-012 修正為三項獨立 enfeoffment（範陽 / 容城 / 深澤）；R4-YSH-011 修正為部分文本推論（僅「易水之南」為直接引文）。</p>

  <h3 class="wc-h3">結論</h3>
  <div class="wc-card support">
    <p><strong>R4 從「12/12 SUPPORTED」修正為「7 SUPPORTED + 5 PARTIALLY_SUPPORTED」</strong>，但並非證據失效，而是<strong>證據類型的精細化</strong>（TEXT_REPORTS vs TEXTUAL_INFERENCE）與<strong>frame 修正</strong>（酈道元記錄 vs 現代獨立事實）。<br>
    R4 frozen JSON 完整保留；R4.1 為審計 overlay，可隨未來外部校核（如 EXT-CHEN-2007 URL 修復）再行更新。</p>
  </div>
</section>
"""

    footer = """
<footer class="wc-footer">
  <p><strong>WATER_CLASSIC_R4_1_SCHOLARLY_AUDIT</strong> · publication-level scholarly audit of R4 (582c852)</p>
  <p>硬邊界：<code>NEW_OCR=0 · NEW_PRIMARY_ACQUISITION=0 · DB_WRITES=0 · EMBEDDINGS=0</code></p>
  <p>R4_BASELINE_PRESERVED=true · FULL_TOPOLOGY_PRESERVED=true · REAL_WORLD_LOCATION=UNRESOLVED</p>
  <p><a href="../../../">/projects/shuge/</a> · <a href="../">/projects/shuge/research/water-classic/</a> · <a href="../corpus/">corpus/</a> · <a href="../evidence/">evidence/</a></p>
  <p style="margin-top: 1rem; color: #888;">生成時間: 2026-09-28 18:05 GMT+8 · 用戶授權: 17:52:45 · 完成後停止 · 不進入 R5</p>
</footer>

</body>
</html>
"""

    return head + section_rq + section_findings + section_topology + section_text + section_claims + section_uncertainty + section_sources + section_method + section_completion + footer


def main():
    html = build_html()
    HTML_OUT.parent.mkdir(parents=True, exist_ok=True)
    with open(HTML_OUT, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"Wrote {HTML_OUT.relative_to(PROJECT_ROOT)} ({len(html)} bytes)")


if __name__ == "__main__":
    main()