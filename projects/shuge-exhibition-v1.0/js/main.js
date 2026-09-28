// SHUGE DH Exhibition v0.3 — main.js
// 继承 v0.2 的所有交互 + 新增 renderEvidenceCardV3 helper (v0.3 升级 evidence card)

(function() {
  'use strict';

  // ============================================================
  // v0.3 NEW: renderEvidenceCardV3 — 4 个新字段:
  //   source_context / citation_path / collection / related_workspace
  // ============================================================
  window.renderEvidenceCardV3 = function(c) {
    var slug = c.collection || 'none';
    var collBadge;
    if (slug === 'historical-hydrology') {
      collBadge = '<span class="badge badge-collection-hydrology">' + slug + '</span>';
    } else if (slug === 'architecture-construction') {
      collBadge = '<span class="badge badge-collection-architecture">' + slug + '</span>';
    } else {
      collBadge = '<span class="badge badge-status-searching">no-collection</span>';
    }

    // source_context block
    var sc = c.source_context || {};
    var scHtml = '';
    if (sc.work_title) {
      scHtml = '<div class="source-context-block">';
      scHtml += '<div class="source-context-label">Source Context</div>';
      scHtml += '<div class="source-context-fields">';
      scHtml += '<span class="scf-work">' + sc.work_title + '</span>';
      if (sc.author) scHtml += '<span class="scf-author">' + sc.author + '</span>';
      if (sc.dynasty) scHtml += '<span class="scf-dynasty">' + sc.dynasty + '</span>';
      if (sc.page_label) scHtml += '<span class="scf-page mono">page_label=' + sc.page_label + '</span>';
      if (sc.ocr_engine) scHtml += '<span class="scf-ocr mono">OCR=' + (sc.ocr_engine || '') + (sc.ocr_model ? '/' + sc.ocr_model : '') + '</span>';
      scHtml += '</div>';
      if (sc.shuge_url) {
        scHtml += '<div class="source-context-link"><a href="' + sc.shuge_url + '">' + sc.shuge_url + '</a></div>';
      }
      if (sc.note) {
        scHtml += '<div class="source-context-note">' + sc.note + '</div>';
      }
      scHtml += '</div>';
    }

    // citation_path block
    var cp = c.citation_path || [];
    var cpHtml = '';
    if (cp.length > 0) {
      cpHtml = '<details class="citation-path-block">';
      cpHtml += '<summary>▸ Citation path (' + cp.length + ' steps)</summary>';
      cpHtml += '<ol class="citation-path-list">';
      cp.forEach(function(step) {
        cpHtml += '<li><span class="cp-step mono">step ' + step.step + '</span> · <span class="cp-action mono">' + step.action + '</span>';
        if (step.input) cpHtml += ' — <span class="cp-input">' + step.input + '</span>';
        if (step.collection_slug) cpHtml += ' · <span class="cp-coll mono">' + step.collection_slug + '</span>';
        if (step.mode) cpHtml += ' · <span class="cp-mode mono">' + step.mode + '</span>';
        if (step.support_count !== undefined) cpHtml += ' · support=' + step.support_count + ' evidence=' + step.evidence_count;
        if (step.citation_ids && step.citation_ids.length) {
          cpHtml += ' · <span class="cp-cite mono">' + step.citation_ids.join(', ') + '</span>';
        }
        cpHtml += '</li>';
      });
      cpHtml += '</ol>';
      cpHtml += '</details>';
    }

    // related_workspace line
    var rw = c.related_workspace || [];
    var rwHtml = '';
    if (rw.length > 0) {
      rwHtml = '<div class="evidence-card-workspace">workspace: ';
      rw.forEach(function(w, i) {
        rwHtml += '<span class="badge badge-status-open mono">' + w + '</span>';
        if (i < rw.length - 1) rwHtml += ' ';
      });
      rwHtml += '</div>';
    } else {
      rwHtml = '<div class="evidence-card-workspace dim">workspace: —</div>';
    }

    // claim cite line
    var cclHtml = '';
    if (c.citation_ids && c.citation_ids.length > 0) {
      cclHtml = '<div class="claim-cite mono">' + c.citation_ids.slice(0, 6).join(', ') + (c.citation_ids.length > 6 ? ' … (+' + (c.citation_ids.length - 6) + ')' : '') + '</div>';
    }

    // evidence ledger rows
    var elHtml = '';
    (c.evidence_preview || []).forEach(function(e, i) {
      var sel = e.selected_for_brief ? '<span class="selected-yes">✓</span>' : ' ';
      elHtml += '<div class="evidence-ledger-row" data-cid="' + e.citation_id + '" data-mtype="' + (e.match_type || '') + '" data-terms="' + (e.matched_terms || '') + '" data-score="' + (e.retrieval_score || 0).toFixed(3) + '" data-reliability="' + (e.text_reliability || '') + '" data-review="' + (e.review_status || '') + '" style="cursor:pointer" onclick="openCitationViewer(this, \'' + c.claim_id + '\', ' + c.run_id + ', ' + i + ')">';
      elHtml += '<span><span class="mono">' + sel + '</span></span>';
      elHtml += '<span class="mono">' + (e.match_type || '') + '</span>';
      elHtml += '<span class="mono">' + (e.matched_terms || '') + '</span>';
      elHtml += '<span class="mono">' + (e.retrieval_score || 0).toFixed(2) + '</span>';
      elHtml += '<span class="mono">' + (e.text_reliability || '') + '</span>';
      elHtml += '</div>';
    });

    // Build complete card
    var html = '<div class="evidence-card" data-run-id="' + c.run_id + '">';
    html += '<div class="evidence-card-header">';
    html += '<div class="evidence-card-question">' + c.question + '</div>';
    html += '<div class="evidence-card-meta"><span class="run-id">#' + c.run_id + '</span> · ' + collBadge + '</div>';
    html += '</div>';

    // v0.3 NEW: source context
    html += scHtml;

    // claim block
    html += '<div class="evidence-claim-block">';
    html += '<div class="evidence-claim-meta">' + c.claim_type + ' · ' + c.claim_id + ' · support=' + c.support_count + ' · evidence=' + c.evidence_count + '</div>';
    html += '<div class="evidence-claim-text">' + c.claim_text + '</div>';
    html += cclHtml;
    html += '</div>';

    // v0.3 NEW: citation path
    html += cpHtml;

    // ledger toggle
    html += '<div class="evidence-ledger-toggle">▸ show evidence ledger</div>';
    html += '<div class="evidence-ledger">';
    html += elHtml;
    html += '</div>';

    // v0.3 NEW: collection + workspace meta line
    html += '<div class="evidence-card-footer-meta">';
    html += '<span class="ecfm-coll">collection: <span class="mono">' + (c.collection || '—') + '</span></span>';
    html += '</div>';
    html += rwHtml;

    // citation viewer panel
    html += '<div class="citation-viewer">';
    html += '<div class="citation-viewer-close">✕ close</div>';
    html += '<div class="citation-viewer-field"><span class="citation-viewer-field-label">citation_id</span><span class="mono cv-citation-id">—</span></div>';
    html += '<div class="citation-viewer-field"><span class="citation-viewer-field-label">match_type</span><span class="mono cv-match-type">—</span></div>';
    html += '<div class="citation-viewer-field"><span class="citation-viewer-field-label">matched_terms</span><span class="mono cv-terms">—</span></div>';
    html += '<div class="citation-viewer-field"><span class="citation-viewer-field-label">retrieval_score</span><span class="mono cv-score">—</span></div>';
    html += '<div class="citation-viewer-field"><span class="citation-viewer-field-label">text_reliability</span><span class="mono cv-reliability">—</span></div>';
    html += '<div class="citation-viewer-field"><span class="citation-viewer-field-label">review_status</span><span class="mono cv-review">—</span></div>';
    html += '</div>';

    html += '</div>';
    return html;
  };

  // ============================================================
  // Evidence ledger toggle (v0.2 继承)
  // ============================================================
  document.addEventListener('click', function(e) {
    if (e.target && e.target.classList && e.target.classList.contains('evidence-ledger-toggle')) {
      var ledger = e.target.nextElementSibling;
      if (ledger && ledger.classList.contains('evidence-ledger')) {
        var isOpen = ledger.classList.toggle('open');
        e.target.textContent = isOpen ? '▾ hide evidence ledger' : '▸ show evidence ledger';
      }
    }
  });

  // ============================================================
  // Citation Viewer (v0.2 继承)
  // ============================================================
  window.openCitationViewer = function(rowEl, claimId, runId, evidenceIndex) {
    var card = rowEl.closest('.evidence-card');
    if (!card) return;
    var viewer = card.querySelector('.citation-viewer');
    if (!viewer) return;

    viewer.querySelector('.cv-citation-id').textContent = rowEl.getAttribute('data-cid');
    viewer.querySelector('.cv-match-type').textContent = rowEl.getAttribute('data-mtype');
    viewer.querySelector('.cv-terms').textContent = rowEl.getAttribute('data-terms');
    viewer.querySelector('.cv-score').textContent = rowEl.getAttribute('data-score');
    viewer.querySelector('.cv-reliability').textContent = rowEl.getAttribute('data-reliability');
    viewer.querySelector('.cv-review').textContent = rowEl.getAttribute('data-review');
    viewer.classList.add('open');
  };

  document.addEventListener('click', function(e) {
    if (e.target && e.target.classList && e.target.classList.contains('citation-viewer-close')) {
      var viewer = e.target.closest('.citation-viewer');
      if (viewer) viewer.classList.remove('open');
    }
  });

  // ============================================================
  // Map tooltip (v0.2 继承)
  // ============================================================
  document.addEventListener('mouseenter', function(e) {
    if (e.target && e.target.classList && e.target.classList.contains('map-point')) {
      var container = e.target.closest('.map-placeholder');
      var tooltip = container && container.querySelector('.map-tooltip');
      if (tooltip) {
        tooltip.textContent = e.target.getAttribute('data-name') + ' — ' + e.target.getAttribute('data-note');
        tooltip.style.opacity = '1';
      }
    }
  }, true);

  document.addEventListener('mouseleave', function(e) {
    if (e.target && e.target.classList && e.target.classList.contains('map-point')) {
      var container = e.target.closest('.map-placeholder');
      var tooltip = container && container.querySelector('.map-tooltip');
      if (tooltip) tooltip.style.opacity = '0';
    }
  }, true);

})();