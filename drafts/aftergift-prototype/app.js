/**
 * Aftergift — app.js
 * 故事型旧物流转平台 · 前端交互逻辑
 * Phase 1C: 故事预检 · 预览 · 模板提示 · 发布确认
 */

(function () {
  'use strict';

  // ── State ──
  var gifts = [];
  var currentFilter = 'all';
  var nextTempId = 9000;
  var lastFocusedElement = null;

  // ── Story Tip Prompts ──
  var STORY_TIPS = [
    '这件礼物是在什么时候来到你身边的？',
    '它曾经让你想起什么？承载了什么？',
    '为什么现在想让它离开？',
    '你希望下一个拥有它的人如何使用它？'
  ];

  // ── DOM refs ──
  var giftGrid     = document.getElementById('giftGrid');
  var emptyState   = document.getElementById('emptyState');
  var emptyStateLine = document.getElementById('emptyStateLine');
  var modalOverlay = document.getElementById('modalOverlay');
  var modal        = document.getElementById('modal');
  var modalBody    = document.getElementById('modalBody');
  var modalClose   = document.getElementById('modalClose');
  var publishForm  = document.getElementById('publishForm');
  var filterTabs   = document.querySelectorAll('.filter-tab');
  var emotionBtns  = document.querySelectorAll('.emotion-tag');
  var excerptInput = document.getElementById('excerpt');
  var excerptCount = document.getElementById('excerptCount');
  var precheckBtn  = document.getElementById('precheckBtn');
  var precheckCard = document.getElementById('precheckCard');
  var previewBtn   = document.getElementById('previewBtn');

  // ── Init ──
  document.addEventListener('DOMContentLoaded', function () {
    loadGifts();
    bindEvents();
  });

  // ── Data ──
  function loadGifts() {
    fetch('./data/gifts.json')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        gifts = data;
        renderGifts();
      })
      .catch(function () {
        giftGrid.innerHTML = emptyStateHTML('无法加载礼物数据，请通过本地服务器打开（python3 -m http.server 8080）。');
      });
  }

  // ── Render ──
  function renderGifts() {
    var filtered = gifts.filter(function (g) {
      return currentFilter === 'all' || g.action === currentFilter;
    });

    if (filtered.length === 0) {
      giftGrid.innerHTML = '';
      giftGrid.style.display = 'none';
      emptyState.style.display = 'flex';
      // Dynamic empty state message based on filter
      var filterMessages = {
        all:      '这里还没有礼物故事。',
        sell:     '这一类礼物暂时还没有故事。',
        exchange: '这一类礼物暂时还没有故事。',
        giveaway: '这一类礼物暂时还没有故事。',
        donate:   '这一类礼物暂时还没有故事。',
        keep:     '这一类礼物暂时还没有故事。'
      };
      emptyStateLine.textContent = filterMessages[currentFilter] || '这一类礼物暂时还没有故事。';
      return;
    }

    emptyState.style.display = 'none';
    giftGrid.style.display = '';
    giftGrid.innerHTML = filtered.map(function (g) { return giftCardHTML(g); }).join('');

    bindCardEvents();
  }

  function bindCardEvents() {
    giftGrid.querySelectorAll('.gift-card').forEach(function (card) {
      card.addEventListener('click', function () {
        var id = card.getAttribute('data-id');
        openModal(id);
      });
    });
  }

  function giftCardHTML(g) {
    var actionClass = 'action-' + g.action;
    var emotionIcon = emotionIconSVG(g.emotion);
    return '<article class="gift-card" data-id="' + g.id + '" tabindex="0" role="button" aria-label="查看礼物「' + escHtml(g.name) + '」的完整故事">' +
      '<div class="gift-card-header">' +
        '<h3 class="gift-card-title">' + escHtml(g.name) + '</h3>' +
        '<span class="gift-card-action ' + actionClass + '">' + escHtml(g.actionLabel) + '</span>' +
      '</div>' +
      '<div class="gift-card-meta">' +
        '<span class="gift-card-tag">' + escHtml(g.type) + '</span>' +
        '<span class="gift-card-tag">' + escHtml(g.relationLabel || g.relation || '') + '</span>' +
        '<span class="gift-card-emotion">' + emotionIcon + escHtml(g.emotion) + '</span>' +
      '</div>' +
      '<p class="gift-card-excerpt">' + escHtml(g.excerpt) + '</p>' +
      '<div class="gift-card-footer">' +
        '<span class="gift-card-price">' + escHtml(g.price) + '</span>' +
        '<span class="gift-card-status">' + escHtml(g.status) + '</span>' +
      '</div>' +
    '</article>';
  }

  function emptyStateHTML(msg) {
    return '<div class="empty-state" role="status">' +
      '<div class="empty-state-icon" aria-hidden="true"></div>' +
      '<p class="empty-state-line">' + escHtml(msg) + '</p>' +
      '<p class="empty-state-sub">也许下一件被温柔送走的旧物，就会出现在这里。</p>' +
    '</div>';
  }

  function emotionIconSVG(emotion) {
    var icons = {
      '放下':   '<svg viewBox="0 0 16 16" fill="none" width="12" height="12" aria-hidden="true"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.2"/><path d="M5 8h6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>',
      '遗憾':   '<svg viewBox="0 0 16 16" fill="none" width="12" height="12" aria-hidden="true"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.2"/><path d="M8 5v3l2 2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>',
      '感谢':   '<svg viewBox="0 0 16 16" fill="none" width="12" height="12" aria-hidden="true"><path d="M8 3l1.5 3 3.5.5-2.5 2.5.5 3.5L8 11.5 4.5 13l.5-3.5L3 8.5l3.5-.5z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>',
      '释怀':   '<svg viewBox="0 0 16 16" fill="none" width="12" height="12" aria-hidden="true"><path d="M3 8h10M10 5l3 3-3 3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      '重启':   '<svg viewBox="0 0 16 16" fill="none" width="12" height="12" aria-hidden="true"><path d="M13 8A5 5 0 1 1 8 3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><path d="M11 3h3v3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      '纪念':   '<svg viewBox="0 0 16 16" fill="none" width="12" height="12" aria-hidden="true"><path d="M8 3v10M5 6l3-3 3 3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      '治愈':   '<svg viewBox="0 0 16 16" fill="none" width="12" height="12" aria-hidden="true"><path d="M8 3c-2 2-2 5 0 7s2 5 0 7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>',
      '平静':   '<svg viewBox="0 0 16 16" fill="none" width="12" height="12" aria-hidden="true"><path d="M2 10c2-3 4-3 6 0s4 3 6 0" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>'
    };
    return icons[emotion] || '';
  }

  // ── Modal ──
  function openModal(id) {
    var g = findGiftById(id);
    if (!g) return;

    lastFocusedElement = document.activeElement;

    var actionClass = 'action-' + g.action;

    var safetyNoteMap = {
      keep:     '这件礼物的主人选择只分享故事，不进行流转。如故事中有可识别信息，欢迎举报。',
      sell:     '出售中 · 平台不参与真实交易，不托管资金。如有交易纠纷请自行承担风险。',
      exchange: '交换意向 · 平台不参与真实交换撮合，双方需自行约定交换方式。',
      giveaway: '免费赠送 · 请仔细阅读故事描述，确认你真的需要它再联系发布者。',
      donate:   '捐赠物 · 这件礼物由发布者免费捐出，欢迎有需要的人认领。'
    };
    var safetyNote = safetyNoteMap[g.action] || '平台不参与真实交易，如有问题请联系发布者。';

    var relationDisplay = (g.anonymous || !g.relationLabel) ? '' : escHtml(g.relationLabel);

    modalBody.innerHTML =
      '<div class="modal-gift-header">' +
        '<h2 class="modal-gift-title" id="modalTitle">' + escHtml(g.name) + '</h2>' +
        '<div class="modal-gift-meta">' +
          '<span class="gift-card-action ' + actionClass + '">' + escHtml(g.actionLabel) + '</span>' +
          '<span class="gift-card-tag">' + escHtml(g.type) + '</span>' +
          (relationDisplay ? '<span class="gift-card-tag">' + relationDisplay + '</span>' : '') +
          '<span class="modal-gift-emotion">' + emotionIconSVG(g.emotion) + ' ' + escHtml(g.emotion) + '</span>' +
        '</div>' +
        '<div class="modal-gift-price">' + escHtml(g.price) + '</div>' +
      '</div>' +
      '<div class="modal-divider"></div>' +
      '<p class="modal-story-label">礼物故事</p>' +
      '<div class="modal-story">' + escHtml(g.fullStory) + '</div>' +
      '<div class="modal-safety-note" role="note">' +
        '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2L3 5v5c0 4.4 3 7.5 7 8.5 4-1 7-4.1 7-8.5V5L10 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>' +
        '<span>' + escHtml(safetyNote) + '</span>' +
      '</div>' +
      '<div class="modal-actions">' +
        (g.action === 'sell'     ? '<button class="btn btn-primary" data-action-btn="take"><svg viewBox="0 0 20 20" fill="none" width="16" height="16" aria-hidden="true"><path d="M10 2v11l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5"/></svg>我想带走它</button>' : '') +
        (g.action === 'exchange'  ? '<button class="btn btn-primary" data-action-btn="exchange"><svg viewBox="0 0 20 20" fill="none" width="16" height="16" aria-hidden="true"><path d="M4 10h12M14 6l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>我想交换</button>' : '') +
        (g.action === 'giveaway'  ? '<button class="btn btn-primary" data-action-btn="claim"><svg viewBox="0 0 20 20" fill="none" width="16" height="16" aria-hidden="true"><path d="M10 3v14M5 12l5-5 5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>我想领取</button>' : '') +
        (g.action === 'donate'    ? '<button class="btn btn-primary" data-action-btn="claim"><svg viewBox="0 0 20 20" fill="none" width="16" height="16" aria-hidden="true"><path d="M3 10h14M10 3v14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>我想认领</button>' : '') +
        '<button class="btn btn-secondary" data-action-btn="save"><svg viewBox="0 0 20 20" fill="none" width="16" height="16" aria-hidden="true"><path d="M5 3h10a2 2 0 0 1 2 2v13l-6-3-6 3V5a2 2 0 0 1 2-2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>收藏故事</button>' +
        '<button class="btn btn-ghost" data-action-btn="report" style="color:var(--accent-2)"><svg viewBox="0 0 20 20" fill="none" width="16" height="16" aria-hidden="true"><path d="M3 10c0-4 3-7 7-7s7 3 7 7-3 7-7 7-7-3-7-7z" stroke="currentColor" stroke-width="1.5"/><path d="M10 7v3l2 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>举报隐私问题</button>' +
      '</div>';

    modalBody.querySelectorAll('[data-action-btn]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var action = btn.getAttribute('data-action-btn');
        handleModalAction(action, g);
      });
    });

    modalOverlay.classList.add('open');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    var firstBtn = modalBody.querySelector('[data-action-btn]') || modalClose;
    if (firstBtn) firstBtn.focus();
  }

  function handleModalAction(action, gift) {
    var messages = {
      take:     '意向已记录：你想带走「' + gift.name + '」（原型阶段，无真实交易）',
      exchange: '交换意向已记录：你想用礼物交换「' + gift.name + '」（原型阶段，请自行约定）',
      claim:    '领取意向已记录：「' + gift.name + '」（原型阶段，请自行联系发布者）',
      save:     '已收藏「' + gift.name + '」的故事',
      report:   '感谢反馈，我们已收到举报，会尽快审核该故事'
    };
    showToast(messages[action] || '已收到你的操作');
  }

  function findGiftById(id) {
    for (var i = 0; i < gifts.length; i++) {
      if (gifts[i].id === id) return gifts[i];
    }
    return null;
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocusedElement && lastFocusedElement.focus) {
      lastFocusedElement.focus();
    }
  }

  // ── Toast ──
  window.showToast = function (msg) {
    var existing = document.querySelector('.toast');
    if (existing) existing.remove();
    var t = document.createElement('div');
    t.className = 'toast';
    t.setAttribute('role', 'status');
    t.setAttribute('aria-live', 'polite');
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.classList.add('show'); }, 10);
    setTimeout(function () {
      t.classList.remove('show');
      setTimeout(function () { t.remove(); }, 300);
    }, 2800);
  };

  // ── Story Pre-Check ──
  var PRECHECK_RULES = {
    identityRisk: [
      // Phone numbers (various Chinese formats)
      { pattern: /1[3-9]\d[\s-]?\d{4}[\s-]?\d{4}/g, msg: '这段文字可能包含手机号码，建议删除。' },
      // WeChat
      { pattern: /微[信渠道公众号]|wechat|weixin|wx\.|WX\.|加我微信|微信号/g, msg: '这段文字可能包含微信号信息，建议只写"加 TA 的微信"而不写具体账号。' },
      // QQ
      { pattern: /[qqQ]{2}[\s-]?[0-9]{5,}/g, msg: '这段文字可能包含 QQ 号，建议删除。' },
      // Email
      { pattern: /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g, msg: '这段文字可能包含邮箱地址，建议删除。' },
      // ID card style numbers
      { pattern: /\d{3}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{2}[\s-]?\d{2}[\s-]?\d{3}[\s-]?\d/g, msg: '这段文字可能包含身份证格式的数字，建议删除。' },
      // Address keywords
      { pattern: /[小区楼栋单元门牌住址家宅搬家公司宿舍学校医院街道路号弄]/g, msg: '这段文字可能涉及详细地址信息，建议模糊处理。' },
      // Social media names
      { pattern: /微博账号|抖音号|小红书号|Instagram|Twitter|X账号|Telegram|电报群/g, msg: '这段文字可能包含社交平台账号信息，建议删除。' },
      // Specific location
      { pattern: /[省市县区街路道][a-zA-Z0-9\u4e00-\u9fa5]{2,10}(?:大厦|广场|中心|大楼|花园|公寓|学校|医院|公司)/g, msg: '这段文字可能包含具体场所名称，建议模糊描述。' }
    ],
    revengeRisk: [
      { pattern: /渣男|渣女|报复|曝光|挂人|人肉搜索|人肉|骗子|毁掉/g, msg: '这段文字听起来带有控诉或报复色彩。我们鼓励把感受写出来，但建议避免使用这类词汇，换成你自己的真实描述。' },
      { pattern: /去死|该死|恨死|恶心死了|想打|想杀|想弄死/g, msg: '听起来你还在愤怒中。也许可以先把这段放一放，等情绪平静一些再写。这个平台希望你带着平静来告别。' },
      { pattern: /贱|不要脸|无耻|恶心|下头|下头男|下头女/g, msg: '这类表达可能让他人感到被攻击。建议聚焦在礼物和自己的感受上，避免直接评价对方。' }
    ],
    identifiableRisk: [
      { pattern: /(?:他|她|TA|那个人|前任|老公|老婆|男朋友|女朋友|父亲|母亲|爸爸|妈妈|哥哥|姐姐|弟弟|妹妹)\s*叫\s*[A-Za-z\u4e00-\u9fa5]{2,4}/g, msg: '这段文字可能暴露了对方的名字。建议改成"TA"或"那个人"，只描述你们之间的关系和感受。' },
      { pattern: /姓名[:：]\s*[A-Za-z\u4e00-\u9fa5]{2,4}/g, msg: '这段文字可能包含真实姓名，建议删除或改成代称。' },
      { pattern: /全名\s*[A-Za-z\u4e00-\u9fa5]{2,4}/g, msg: '这段文字可能包含全名，建议改成代称。' }
    ]
  };

  function runPreCheck() {
    var excerpt = (document.getElementById('excerpt').value || '');
    var fullStory = (document.getElementById('fullStory').value || '');
    var combined = excerpt + '\n' + fullStory;

    var findings = [];
    var riskCount = 0;

    function checkRuleSet(rules, category) {
      rules.forEach(function (rule) {
        var matches = combined.match(rule.pattern);
        if (matches) {
          riskCount++;
          findings.push({ type: category, msg: rule.msg, count: matches.length });
        }
      });
    }

    checkRuleSet(PRECHECK_RULES.identityRisk, 'identity');
    checkRuleSet(PRECHECK_RULES.revengeRisk, 'revenge');
    checkRuleSet(PRECHECK_RULES.identifiableRisk, 'identifiable');

    var c1 = document.getElementById('confirm1').checked;
    var c2 = document.getElementById('confirm2').checked;
    var c3 = document.getElementById('confirm3').checked;

    var level, headerText, headerIcon;

    if (riskCount === 0 && c1 && c2 && c3) {
      level = 'safe';
      headerText = '适合公开';
      headerIcon = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M8 12l3 3 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    } else if (riskCount > 0) {
      level = 'risk';
      headerText = '不建议直接公开';
      headerIcon = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M12 7v5M12 15.5v.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
    } else {
      level = 'caution';
      headerText = '建议修改后公开';
      headerIcon = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M12 8v4M12 14.5v.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
    }

    var html = '<div class="precheck-header">' + headerIcon + '<span>' + headerText + '</span></div>';

    if (findings.length === 0) {
      html += '<div class="precheck-items"><div class="precheck-item">没有检测到明显的身份信息、报复性表达或可识别个人身份的内容。</div></div>';
      if (!c1 || !c2 || !c3) {
        html += '<div class="precheck-items"><div class="precheck-item" style="color:var(--accent)"><strong>请注意：</strong>发布前还需要勾选上方的三项确认。</div></div>';
      }
    } else {
      html += '<div class="precheck-items">';
      findings.forEach(function (f) {
        html += '<div class="precheck-item">' + escHtml(f.msg) + (f.count > 1 ? '（匹配 ' + f.count + ' 处）' : '') + '</div>';
      });
      html += '</div>';
      if (level !== 'safe') {
        html += '<div class="precheck-items"><div class="precheck-item" style="color:var(--text-2)">你可以保留这段故事，但建议修改后再发布。如果这是你真实想说的，也可以直接发布——平台不会强制拦截。</div></div>';
      }
    }

    precheckCard.innerHTML = html;
    precheckCard.className = 'precheck-card precheck-card-' + level + ' show';
  }

  // ── Story Preview ──
  function getFormData() {
    var name      = document.getElementById('giftName').value.trim();
    var type      = document.getElementById('giftType').value;
    var relation  = document.getElementById('relation').value;
    var action    = document.getElementById('action').value;
    var emotion   = document.getElementById('emotion').value;
    var price     = document.getElementById('price').value.trim();
    var excerpt   = document.getElementById('excerpt').value.trim();
    var fullStory = document.getElementById('fullStory').value.trim() || excerpt;
    var anonymous = document.getElementById('anonymous').checked;
    return { name: name, type: type, relation: relation, action: action, emotion: emotion || '放下', price: price, excerpt: excerpt, fullStory: fullStory, anonymous: anonymous };
  }

  function openPreviewModal() {
    var d = getFormData();
    if (!d.name || !d.type || !d.action || !d.excerpt) {
      showToast('请先填写礼物名称、类型、处理方式和故事摘录');
      return;
    }

    lastFocusedElement = document.activeElement;

    var actionLabels = { sell: '出售', exchange: '交换', giveaway: '赠送', donate: '捐出', keep: '只展示故事' };
    var actionClass = 'action-' + d.action;
    var relationDisplay = (d.anonymous || !d.relation) ? '' : escHtml(d.relation);
    var displayPrice = d.price || (d.action === 'keep' ? '非卖品，只讲故事' : '待定');

    modalBody.innerHTML =
      '<div class="modal-preview-banner">' +
        '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5"/></svg>' +
        '<span><strong>这是别人将看到的样子。</strong>发布前，请再确认是否暴露了不该公开的信息。</span>' +
      '</div>' +
      '<span class="modal-preview-badge">预览效果</span>' +
      '<div class="modal-gift-header">' +
        '<h2 class="modal-gift-title" id="modalTitle">' + escHtml(d.name) + '</h2>' +
        '<div class="modal-gift-meta">' +
          '<span class="gift-card-action ' + actionClass + '">' + escHtml(actionLabels[d.action] || d.action) + '</span>' +
          '<span class="gift-card-tag">' + escHtml(d.type) + '</span>' +
          (relationDisplay ? '<span class="gift-card-tag">' + relationDisplay + '</span>' : '') +
          '<span class="modal-gift-emotion">' + emotionIconSVG(d.emotion) + ' ' + escHtml(d.emotion) + '</span>' +
        '</div>' +
        '<div class="modal-gift-price">' + escHtml(displayPrice) + '</div>' +
      '</div>' +
      '<div class="modal-divider"></div>' +
      '<p class="modal-story-label">礼物故事</p>' +
      '<div class="modal-story">' + escHtml(d.fullStory) + '</div>' +
      '<div class="modal-safety-note" role="note">' +
        '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2L3 5v5c0 4.4 3 7.5 7 8.5 4-1 7-4.1 7-8.5V5L10 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>' +
        '<span>故事发布后将公开可见，请确认内容适合公开阅读。</span>' +
      '</div>' +
      '<div class="modal-actions" style="margin-top:8px">' +
        '<button class="btn btn-secondary" id="previewCloseBtn" aria-label="关闭预览"><svg viewBox="0 0 20 20" fill="none" width="16" height="16" aria-hidden="true"><path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>关闭预览</button>' +
      '</div>';

    document.getElementById('previewCloseBtn').addEventListener('click', closeModal);

    modalOverlay.classList.add('open');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.getElementById('previewCloseBtn').focus();
  }

  // ── Story Tips ──
  window.insertStoryTip = function (index) {
    var tip = STORY_TIPS[index];
    var ta = document.getElementById('fullStory');
    var current = ta.value.trim();
    var insert = '\n\n— ' + tip + '\n';
    if (current.length === 0) {
      ta.value = tip + '\n\n';
    } else {
      ta.value = current + insert;
    }
    ta.focus();
    showToast('提示已添加，继续书写吧');
  };

  // Story tip keyboard accessibility
  document.querySelectorAll('.story-tip-item').forEach(function (item) {
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });

  // ── Publish Form ──
  function handleFormSubmit(e) {
    e.preventDefault();

    var c1 = document.getElementById('confirm1').checked;
    var c2 = document.getElementById('confirm2').checked;
    var c3 = document.getElementById('confirm3').checked;

    if (!c1 || !c2 || !c3) {
      showToast('请先确认这个故事适合被公开阅读');
      return;
    }

    var d = getFormData();

    if (!d.name || !d.type || !d.action || !d.excerpt) {
      showToast('请填写礼物名称、类型、处理方式和故事摘录');
      return;
    }

    var actionLabels = { sell: '出售', exchange: '交换', giveaway: '赠送', donate: '捐出', keep: '只展示故事' };
    var statusMap = { sell: '出售中', exchange: '待流转', giveaway: '待认领', donate: '待捐出', keep: '故事保留' };

    var newGift = {
      id: 'temp-' + (nextTempId++),
      name: d.name,
      type: d.type,
      relation: d.relation || '',
      relationLabel: d.anonymous ? '' : (d.relation || ''),
      action: d.action,
      actionLabel: actionLabels[d.action] || d.action,
      emotion: d.emotion,
      excerpt: d.excerpt,
      fullStory: d.fullStory,
      price: d.price || (d.action === 'keep' ? '非卖品，只讲故事' : '待定'),
      status: statusMap[d.action] || '待定',
      anonymous: d.anonymous,
      tags: [d.type]
    };

    gifts.unshift(newGift);
    renderGifts();

    // Reset form
    publishForm.reset();
    emotionBtns.forEach(function (b) {
      b.classList.remove('selected');
      b.setAttribute('aria-pressed', 'false');
    });
    document.getElementById('emotion').value = '';
    excerptCount.textContent = '0';

    // Reset confirm checkboxes
    document.getElementById('confirm1').checked = false;
    document.getElementById('confirm2').checked = false;
    document.getElementById('confirm3').checked = false;

    // Hide precheck card
    precheckCard.classList.remove('show');

    // Scroll to stories
    scrollToSection('stories');
    showToast('礼物已发布，愿你与它好好告别');
  }

  // ── Filter ──
  function handleFilterClick(e) {
    var btn = e.currentTarget;
    var filter = btn.getAttribute('data-filter');

    if (btn.classList.contains('active')) return;

    currentFilter = filter;
    filterTabs.forEach(function (t) {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    renderGifts();
  }

  // ── Emotion Tags ──
  function handleEmotionClick(e) {
    var btn = e.currentTarget;
    var emotion = btn.getAttribute('data-emotion');
    var isSelected = btn.classList.contains('selected');

    emotionBtns.forEach(function (b) {
      b.classList.remove('selected');
      b.setAttribute('aria-pressed', 'false');
    });

    if (!isSelected) {
      btn.classList.add('selected');
      btn.setAttribute('aria-pressed', 'true');
      document.getElementById('emotion').value = emotion;
    } else {
      document.getElementById('emotion').value = '';
    }
  }

  // ── Char Count ──
  function handleExcerptInput() {
    excerptCount.textContent = excerptInput.value.length;
  }

  // ── Scroll helper ──
  window.scrollToSection = function (id) {
    var el = document.getElementById(id);
    if (el) {
      var offset = 72;
      var top = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }
  };

  // ── Bind Events ──
  function bindEvents() {
    // Filter tabs
    filterTabs.forEach(function (tab) {
      tab.addEventListener('click', handleFilterClick);
    });

    // Emotion tags
    emotionBtns.forEach(function (btn) {
      btn.addEventListener('click', handleEmotionClick);
    });

    // Excerpt counter
    excerptInput.addEventListener('input', handleExcerptInput);

    // Pre-check button
    precheckBtn.addEventListener('click', runPreCheck);

    // Preview button
    previewBtn.addEventListener('click', openPreviewModal);

    // Form submit
    publishForm.addEventListener('submit', handleFormSubmit);

    // Modal close
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) closeModal();
    });

    // Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
        closeModal();
      }
    });

    // Card keyboard accessibility (delegated)
    giftGrid.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        var card = e.target.closest('.gift-card');
        if (card) {
          e.preventDefault();
          card.click();
        }
      }
    });
  }

  // ── Escape HTML ──
  function escHtml(str) {
    if (str === undefined || str === null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

})();
