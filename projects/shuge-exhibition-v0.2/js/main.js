/* SHUGE DH Exhibition v0.2 — 公共脚本
 * 继承 v0.1: accordion + filter
 * 新增 v0.2: evidence-ledger toggle / citation-viewer toggle / map tooltip
 */

// --- v0.1 原有: run accordion ---
document.addEventListener('click', function(e) {
  var t = e.target;
  if (t.classList && t.classList.contains('run-summary')) {
    t.parentElement.classList.toggle('open');
  }
});

// --- v0.1 原有: filter-row (radio) ---
document.addEventListener('change', function(e) {
  var t = e.target;
  if (t.type !== 'radio') return;
  var collFilter = (document.querySelector('input[name="coll-filter"]:checked') || {}).value || 'all';
  var statusFilter = (document.querySelector('input[name="status-filter"]:checked') || {}).value || 'all';
  document.querySelectorAll('.run').forEach(function(r) {
    var rc = r.getAttribute('data-coll') || '';
    var rs = r.getAttribute('data-status') || '';
    var showColl = (collFilter === 'all') || (collFilter === rc) || (collFilter === 'none' && rc === 'none');
    var showStatus = (statusFilter === 'all') || (statusFilter === rs);
    r.style.display = (showColl && showStatus) ? '' : 'none';
  });
});

// --- v0.2 新增: evidence-ledger toggle ---
document.addEventListener('click', function(e) {
  var t = e.target;
  if (t.classList && t.classList.contains('evidence-ledger-toggle')) {
    var card = t.closest('.evidence-card');
    if (card) {
      var ledger = card.querySelector('.evidence-ledger');
      if (ledger) {
        ledger.classList.toggle('open');
        t.textContent = ledger.classList.contains('open') ? '▾ hide evidence ledger' : '▸ show evidence ledger';
      }
    }
  }
});

// --- v0.2 新增: citation-viewer open/close ---
window.openCitationViewer = function(claimId, runId, evidenceIndex) {
  // close any open
  document.querySelectorAll('.citation-viewer.open').forEach(function(cv) { cv.classList.remove('open'); });

  var card = document.querySelector('.evidence-card[data-run-id="' + runId + '"]');
  if (!card) return;

  var ledgerRow = card.querySelectorAll('.evidence-ledger-row')[evidenceIndex || 0];
  if (!ledgerRow) return;

  var viewer = card.querySelector('.citation-viewer');
  if (!viewer) return;

  // Populate
  viewer.querySelector('.cv-citation-id').textContent = ledgerRow.getAttribute('data-cid') || '';
  viewer.querySelector('.cv-match-type').textContent   = ledgerRow.getAttribute('data-mtype') || '';
  viewer.querySelector('.cv-terms').textContent         = ledgerRow.getAttribute('data-terms') || '';
  viewer.querySelector('.cv-score').textContent         = ledgerRow.getAttribute('data-score') || '';
  viewer.querySelector('.cv-reliability').textContent   = ledgerRow.getAttribute('data-reliability') || '';
  viewer.querySelector('.cv-review').textContent        = ledgerRow.getAttribute('data-review') || '';

  viewer.classList.add('open');
};

document.addEventListener('click', function(e) {
  var t = e.target;
  if (t.classList && t.classList.contains('citation-viewer-close')) {
    t.closest('.citation-viewer').classList.remove('open');
  }
});

// --- v0.2 新增: map tooltip ---
document.addEventListener('mouseover', function(e) {
  var t = e.target;
  if (t.classList && t.classList.contains('map-point')) {
    var tip = document.querySelector('.map-placeholder-tooltip');
    if (!tip) return;
    tip.textContent = t.getAttribute('data-label') + ' (' + t.getAttribute('data-kind') + ')';
    tip.style.left = (e.pageX + 12) + 'px';
    tip.style.top  = (e.pageY + 12) + 'px';
    tip.classList.add('show');
  }
});
document.addEventListener('mouseout', function(e) {
  var t = e.target;
  if (t.classList && t.classList.contains('map-point')) {
    var tip = document.querySelector('.map-placeholder-tooltip');
    if (tip) tip.classList.remove('show');
  }
});
