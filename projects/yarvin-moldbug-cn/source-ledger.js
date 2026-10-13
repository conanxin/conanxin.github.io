/* P4 provenance filter: enhances the nine pre-rendered chapter cards.
   Source facts are stored separately in content/source-ledger.json.
   This reader never infers that a located page proves a historical claim. */
(() => {
  'use strict';
  const select = document.getElementById('ledgerState');
  const queryInput = document.getElementById('ledgerQuery');
  const cardsRoot = document.getElementById('sourceLedgerGrid');
  const counter = document.getElementById('sourceLedgerCount');
  if (!select || !queryInput || !cardsRoot || !counter) return;

  const cards = Array.from(cardsRoot.querySelectorAll('.source-ledger__card'));
  const stateLabels = {
    PASSAGE_LOCATED: '段落已定位',
    TOPIC_ONLY: '主题线索',
    ORIGINAL_ONLY: '待映射'
  };

  function applyFilters() {
    const state = select.value;
    const query = queryInput.value.trim().toLocaleLowerCase();
    let visible = 0;
    const counts = { PASSAGE_LOCATED: 0, TOPIC_ONLY: 0, ORIGINAL_ONLY: 0 };
    cards.forEach(card => {
      const stateMatches = state === 'all' || card.dataset.state === state;
      const queryMatches = !query || card.textContent.toLocaleLowerCase().includes(query);
      card.hidden = !(stateMatches && queryMatches);
      if (!card.hidden) {
        visible += 1;
        counts[card.dataset.state] += 1;
      }
    });
    const details = Object.keys(stateLabels)
      .map(key => stateLabels[key] + ' ' + counts[key])
      .join(' · ');
    counter.textContent = visible ? '显示 ' + visible + ' / ' + cards.length + ' 章 · ' + details
      : '没有符合条件的章节；请调整筛选或关键词。';
  }
  select.addEventListener('change', applyFilters);
  queryInput.addEventListener('input', applyFilters);
  applyFilters();
})();
