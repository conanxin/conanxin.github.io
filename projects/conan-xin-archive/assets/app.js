/* Conan Xin Archive public reading edition v0.1.0.
   All data is a small curated public snapshot. No network requests, storage,
   analytics or publication of original private source documents. */
(function () {
  'use strict';

  const data = window.CXA_PUBLIC_DATA;
  const root = document.querySelector('.cxa-page');
  if (!root || !data || !Array.isArray(data.objects) || !Array.isArray(data.shelves)) {
    const element = document.querySelector('#cxa-feature');
    if (element) element.textContent = '导览数据暂时无法加载。请检查公开项目的 catalog.js 文件。';
    return;
  }

  const routeTabs = document.querySelector('#cxa-route-tabs');
  const stopsNode = document.querySelector('#cxa-stops');
  const featureNode = document.querySelector('#cxa-feature');
  const collectionNode = document.querySelector('#cxa-objects');
  const searchInput = document.querySelector('#cxa-search');
  const objects = Object.fromEntries(data.objects.map((item) => [item.id, item]));
  const routes = Object.fromEntries(data.shelves.map((route) => [route.id, route]));
  let routeId = data.shelves[0].id;
  let stopNumber = 0;

  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;',
      '"': '&quot;', "'": '&#39;'
    }[character]));
  }

  function safeLink(link) {
    const value = String(link ?? '');
    return /^https:\/\/[^\s<>"']+$/i.test(value) ? value : '';
  }

  function visualStatus(item) {
    return '来源深度 ' + item.evidence_depth + ' · 尚未完成正式人工编目审核';
  }

  function linkList(item) {
    if (!item.sources.length) {
      return '<p>当前公开试行页没有可确认指向这件样本的单独机构记录。请勿据此推定它不存在。</p>';
    }
    return '<ul>' + item.sources.map((source) => {
      const href = safeLink(source.url);
      if (!href) return '';
      return '<li><a href="' + escapeHTML(href) +
        '" target="_blank" rel="noopener noreferrer">' + escapeHTML(source.label) +
        '</a><br><small>' + escapeHTML(source.relation) + '</small></li>';
    }).join('') + '</ul>';
  }

  function questionList(item) {
    return '<ul>' + item.questions.map((item) =>
      '<li>' + escapeHTML(item.question) + ' <small>（待证）</small></li>'
    ).join('') + '</ul>';
  }

  function renderRouteTabs() {
    routeTabs.innerHTML = data.shelves.map((route, i) =>
      '<button type="button" role="tab" class="cxa-route-tab" data-route="' +
      escapeHTML(route.id) + '" aria-selected="' + (routeId === route.id) +
      '" aria-controls="cxa-feature">' +
      '<span class="cxa-route-tab__eyebrow">READING TABLE / 0' + (i + 1) + '</span>' +
      '<span class="cxa-route-tab__title">' + escapeHTML(route.title) + '</span>' +
      '<span class="cxa-route-tab__question">' + escapeHTML(route.question) + '</span>' +
      '<span class="cxa-route-tab__count">' + route.steps.length + '件资料 · 可按自己的问题进入</span>' +
      '</button>'
    ).join('');
    routeTabs.querySelectorAll('button').forEach((button) => {
      button.addEventListener('click', () => activate(button.dataset.route, 0));
    });
  }

  function renderStops(route) {
    stopsNode.innerHTML = route.steps.map((step, index) =>
      '<button class="cxa-stop" type="button" aria-current="' +
      (index === stopNumber ? 'true' : 'false') +
      '" data-stop="' + index + '">' +
      '<span class="cxa-stop__num">0' + (index + 1) + '</span>' +
      '<span class="cxa-stop__label">' + escapeHTML(step.role) +
      '<br><small>' + escapeHTML(objects[step.id]?.category ?? '') + '</small></span>' +
      '</button>'
    ).join('');
    stopsNode.querySelectorAll('button').forEach((button) => {
      button.addEventListener('click', () => activate(routeId, Number(button.dataset.stop)));
    });
  }

  function renderExtra(item) {
    if (!item.extra) return '';
    return '<figure class="cxa-extra"><div class="cxa-extra__image"><a href="' +
      escapeHTML(item.extra.image) + '" title="查看公开的缩略页图">' +
      '<img loading="lazy" src="' + escapeHTML(item.extra.image) + '" alt="' +
      escapeHTML(item.extra.title) + '"></a><figcaption><strong>' +
      escapeHTML(item.extra.title) + '</strong><br>' +
      escapeHTML(item.extra.caption) + '</figcaption></div></figure>';
  }

  function renderFeature(route) {
    const step = route.steps[stopNumber];
    const item = objects[step.id];
    if (!item) {
      featureNode.textContent = '找不到这一件的公开摘要。';
      return;
    }
    document.querySelector('#cxa-reading-title').textContent = route.title;
    document.querySelector('#cxa-reading-question').textContent = route.question;
    document.querySelector('#cxa-reading-context').textContent = route.curator_note;
    document.querySelector('#cxa-reading-count').textContent =
      (stopNumber + 1) + ' / ' + route.steps.length;

    featureNode.innerHTML = '<div class="cxa-feature__top">' +
      '<div><figure class="cxa-feature__picture"><img src="' + escapeHTML(item.image) +
      '" alt="' + escapeHTML(item.title) + ' · 公开展示的低清缩略图"></figure>' +
      '<p class="cxa-feature__picture-note">公开策展缩略图 · 不提供完整扫描母版</p></div>' +
      '<div class="cxa-feature__body">' +
      '<div class="cxa-feature__id">' + escapeHTML(item.id) + ' / ' +
      escapeHTML(item.category) + '</div>' +
      '<h3 class="cxa-feature__question">' + escapeHTML(step.prompt) + '</h3>' +
      '<p class="cxa-feature__name">' + escapeHTML(item.title) + '</p>' +
      '<p class="cxa-feature__intro">' + escapeHTML(item.intro) + '</p>' +
      '<div class="cxa-feature__meta"><span class="cxa-feature__pill">' +
      escapeHTML(visualStatus(item)) + '</span></div></div></div>' +
      '<div class="cxa-evidence-row">' +
      '<div class="cxa-fact"><strong>目前能观察到</strong>' +
      escapeHTML(item.observed) + '</div>' +
      '<div class="cxa-pending"><strong>仍然没有确认</strong>' +
      escapeHTML(item.still_unknown) + '</div>' +
      '<div class="cxa-editorial-note"><strong>为什么值得连着看</strong>' +
      escapeHTML(step.reason) + '<p class="cxa-proof-limit"><b>' +
      escapeHTML(step.relation_type) + '</b><br>不能由此断言：' +
      escapeHTML(step.not_proved) + '</p></div></div>' +
      '<details class="cxa-evidence-details"><summary>展开来源、开放问题与可公开页图</summary>' +
      '<div class="cxa-evidence-details__inside">' +
      '<h4>可继续查阅的馆藏记录和相关资料</h4>' + linkList(item) +
      '<h4>研究中仍需补证的问题</h4>' + questionList(item) +
      renderExtra(item) +
      '<p><small>以上链接可能属于机构物件、相册系列或二次来源，关系性质已逐项注明。任何链接都不代表现有私人编目已获得正式人工批准。</small></p>' +
      '</div></details>' +
      '<div class="cxa-feature__nav">' +
      '<button type="button" id="cxa-prev" ' + (stopNumber === 0 ? 'disabled' : '') +
      '>← 上一件</button>' +
      '<span>' + (stopNumber + 1) + ' / ' + route.steps.length + ' · ' +
      escapeHTML(item.id) + '</span>' +
      '<button type="button" id="cxa-next" ' +
      (stopNumber === route.steps.length - 1 ? 'disabled' : '') +
      '>下一件 →</button></div>';

    featureNode.querySelector('#cxa-prev').addEventListener('click', () =>
      activate(routeId, stopNumber - 1));
    featureNode.querySelector('#cxa-next').addEventListener('click', () =>
      activate(routeId, stopNumber + 1));
  }

  function activate(nextRouteId, nextIndex, updateHash = true) {
    const route = routes[nextRouteId];
    if (!route || !Number.isInteger(nextIndex) ||
      nextIndex < 0 || nextIndex >= route.steps.length) return false;
    routeId = nextRouteId;
    stopNumber = nextIndex;
    renderRouteTabs();
    renderStops(route);
    renderFeature(route);
    if (updateHash) {
      const fragment = 'route=' + encodeURIComponent(routeId) +
        '&item=' + encodeURIComponent(route.steps[stopNumber].id);
      history.replaceState(null, '', '#' + fragment);
    }
    return true;
  }

  function firstRouteFor(objectId) {
    for (const route of data.shelves) {
      const index = route.steps.findIndex((step) => step.id === objectId);
      if (index >= 0) return [route.id, index];
    }
    return [data.shelves[0].id, 0];
  }

  function renderObjects(search = '') {
    const query = search.trim().toLocaleLowerCase();
    const visible = data.objects.filter((item) => {
      const haystack = [item.id, item.title, item.category, item.intro,
        item.observed, item.still_unknown, ...item.questions.map(q => q.question)]
        .join(' ').toLocaleLowerCase();
      return !query || haystack.includes(query);
    });
    document.querySelector('#cxa-search-count').textContent =
      visible.length + ' / ' + data.objects.length + '件';
    collectionNode.innerHTML = visible.map((item) =>
      '<button type="button" class="cxa-object" data-id="' + escapeHTML(item.id) +
      '" aria-label="在策展路径中浏览' + escapeHTML(item.title) + '">' +
      '<img src="' + escapeHTML(item.image) + '" alt="' +
      escapeHTML(item.title) + ' · 小尺寸展示图" loading="lazy">' +
      '<span class="cxa-object__meta"><span class="cxa-object__id">' +
      escapeHTML(item.id) + '</span><span class="cxa-object__title">' +
      escapeHTML(item.title) + '</span><span class="cxa-object__category">' +
      escapeHTML(item.category) + ' · 进入阅读</span></span></button>'
    ).join('');
    collectionNode.querySelectorAll('button[data-id]').forEach((button) => {
      button.addEventListener('click', () => {
        const next = firstRouteFor(button.dataset.id);
        activate(next[0], next[1]);
        document.querySelector('#cxa-reading').scrollIntoView({behavior:'smooth',block:'start'});
      });
    });
  }

  function renderUpdates() {
    document.querySelector('#cxa-update-log').innerHTML =
      data.updates.map((entry) =>
        '<div class="cxa-update-entry"><time datetime="' +
        escapeHTML(entry.date) + '">' + escapeHTML(entry.date) +
        '</time><strong>' + escapeHTML(entry.version) + ' · 初次公开</strong><p>' +
        escapeHTML(entry.note) + '</p></div>'
      ).join('');
  }

  function readFragment() {
    const params = new URLSearchParams(location.hash.replace(/^#/, ''));
    const targetRoute = params.get('route');
    const targetItem = params.get('item');
    const route = routes[targetRoute];
    if (route) {
      const index = route.steps.findIndex(step => step.id === targetItem);
      if (index >= 0) return activate(targetRoute, index, false);
    }
    return false;
  }

  searchInput.addEventListener('input', () => renderObjects(searchInput.value));
  window.addEventListener('hashchange', () => { readFragment(); });
  renderObjects();
  renderUpdates();
  if (!readFragment()) activate(routeId, 0, false);
})();
