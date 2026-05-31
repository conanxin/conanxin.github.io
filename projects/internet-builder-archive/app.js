/**
 * 旧互联网建设者资料库 — 交互逻辑
 * 纯静态，无外部 CDN 依赖
 */

(function () {
  'use strict';

  // ---- 全局状态 ----
  let allItems = [];
  let currentCategory = 'all';
  let currentSearch = '';

  // ---- DOM 引用 ----
  var itemsGrid = document.getElementById('items-grid');
  var categoryFilter = document.getElementById('category-filter');
  var searchInput = document.getElementById('search-input');

  // ---- 初始化 ----
  function init() {
    loadData();
    bindEvents();
  }

  // ---- 加载数据 ----
  function loadData() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'data/items.json', true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          try {
            allItems = JSON.parse(xhr.responseText);
            renderItems();
          } catch (e) {
            itemsGrid.innerHTML = '<p class="empty-state">数据加载失败：JSON 格式错误</p>';
            console.error('JSON parse error:', e);
          }
        } else {
          itemsGrid.innerHTML = '<p class="empty-state">数据文件加载失败</p>';
        }
      }
    };
    xhr.send();
  }

  // ---- 绑定事件 ----
  function bindEvents() {
    categoryFilter.addEventListener('change', function () {
      currentCategory = this.value;
      renderItems();
    });

    searchInput.addEventListener('input', function () {
      currentSearch = this.value.trim().toLowerCase();
      renderItems();
    });

    // 推荐路径标签点击
    var pathTags = document.querySelectorAll('.path-tag');
    pathTags.forEach(function (tag) {
      tag.addEventListener('click', function () {
        var tagValue = tag.getAttribute('data-tag');
        currentCategory = tagValue;
        categoryFilter.value = tagValue;
        renderItems();
        // 滚动到条目区
        itemsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  // ---- 筛选逻辑 ----
  function filterItems() {
    return allItems.filter(function (item) {
      // 分类筛选
      if (currentCategory !== 'all' && item.category !== currentCategory) {
        return false;
      }
      // 关键词搜索
      if (currentSearch) {
        var haystack = [
          item.title_zh || '',
          item.title_en || '',
          item.people || '',
          item.organization || '',
          item.summary_zh || '',
          item.why_it_matters_zh || '',
          (item.tags || []).join(' ')
        ].join(' ').toLowerCase();
        if (haystack.indexOf(currentSearch) === -1) {
          return false;
        }
      }
      return true;
    });
  }

  // ---- 渲染条目 ----
  function renderItems() {
    var filtered = filterItems();

    if (filtered.length === 0) {
      itemsGrid.innerHTML = '<p class="empty-state">没有找到匹配的条目</p>';
      return;
    }

    var html = '';
    filtered.forEach(function (item) {
      html += buildCardHTML(item);
    });
    itemsGrid.innerHTML = html;
  }

  // ---- 构建单条卡片 HTML ----
  function buildCardHTML(item) {
    var isPlaceholder = item.status === 'placeholder';
    var cardClass = 'item-card' + (isPlaceholder ? ' is-placeholder' : '');

    var badge = '';
    if (item.status === 'placeholder') {
      badge = '<span class="placeholder-badge">⚠️ 占位条目</span>';
    } else if (item.status === 'staging') {
      badge = '<span class="placeholder-badge" style="background:#fef3c7;color:#92400e;border-color:#fcd34d;">📋 待核实</span>';
    } else if (item.status === 'verified_embed') {
      badge = '<span class="placeholder-badge" style="background:#d1fae5;color:#065f46;border-color:#6ee7b7;">✅ 已嵌入</span>';
    } else if (item.status === 'verified_source') {
      badge = '<span class="placeholder-badge" style="background:#f0fdf4;color:#166534;border-color:#86efac;">✅ 来源已核实</span>';
    }

    var titleEn = '';
    if (item.title_en && item.title_en.indexOf('[PLACEHOLDER]') === -1) {
      titleEn = '<div class="card-title-en">「' + escapeHtml(item.title_en) + '」</div>';
    }

    var metaItems = [];
    if (item.year) metaItems.push('<span class="meta-item"><span class="meta-label">📅</span> ' + escapeHtml(item.year) + '</span>');
    if (item.type) metaItems.push('<span class="meta-item"><span class="meta-label">📁</span> ' + escapeHtml(item.type) + '</span>');
    if (item.duration) metaItems.push('<span class="meta-item"><span class="meta-label">⏱</span> ' + escapeHtml(item.duration) + '</span>');
    if (item.people) metaItems.push('<span class="meta-item"><span class="meta-label">👤</span> ' + escapeHtml(item.people) + '</span>');
    if (item.organization) metaItems.push('<span class="meta-item"><span class="meta-label">🏢</span> ' + escapeHtml(item.organization) + '</span>');
    if (item.media_platform) {
      var platformBadge = item.embed_url
        ? '<span class="meta-item"><span class="meta-label">🎬</span> <span style="background:#dbeafe;color:#1e40af;padding:1px 6px;border-radius:3px;font-size:0.75rem;">' + escapeHtml(item.media_platform) + '</span></span>'
        : '<span class="meta-item"><span class="meta-label">🎬</span> <span style="background:#f3f4f6;color:#6b7280;padding:1px 6px;border-radius:3px;font-size:0.75rem;">' + escapeHtml(item.media_platform) + '</span></span>';
      metaItems.push(platformBadge);
    }

    var tagsHtml = '';
    if (item.tags && item.tags.length > 0) {
      var tags = item.tags.map(function (t) {
        return '<span class="tag">' + escapeHtml(t) + '</span>';
      }).join('');
      tagsHtml = '<div class="card-tags">' + tags + '</div>';
    }

    var embedHtml = '';
    if (item.embed_url) {
      if (item.type === '音频' || item.embed_url.indexOf('soundcloud') !== -1 || item.embed_url.indexOf('spotify') !== -1) {
        embedHtml = '<div class="embed-area"><audio controls src="' + escapeHtml(item.embed_url) + '">您的浏览器不支持音频播放</audio></div>';
      } else {
        // 通用 iframe
        embedHtml = '<div class="embed-area"><iframe src="' + escapeHtml(item.embed_url) + '" loading="lazy" allowfullscreen></iframe></div>';
      }
    }

    var linksHtml = '';
    var hasLink = false;
    if (item.source_url) {
      var srcLabel = item.source_status ? item.source_status : '查看原始链接';
      linksHtml += '<a href="' + escapeHtml(item.source_url) + '" target="_blank" rel="noopener" class="btn btn-primary">🔗 ' + escapeHtml(srcLabel) + '</a>';
      hasLink = true;
    } else if (!isPlaceholder) {
      linksHtml += '<span class="btn btn-secondary" style="opacity:0.5;cursor:default;">🔗 待补链接</span>';
      hasLink = true;
    }

    if (!hasLink) {
      linksHtml += '<span class="btn btn-secondary" style="opacity:0.5;cursor:default;">🔗 待补链接</span>';
    }

    // 备用来源
    if (item.secondary_urls && item.secondary_urls.length > 0) {
      var altLinks = item.secondary_urls.map(function(u) {
        return '<a href="' + escapeHtml(u) + '" target="_blank" rel="noopener" class="btn btn-secondary" style="font-size:0.78rem;">📂 备用来源</a>';
      }).join(' ');
      linksHtml += '<br><div style="margin-top:6px;">' + altLinks + '</div>';
    }

    // 来源说明
    if (item.source_notes_zh) {
      linksHtml += '<p class="card-source-notes">' + escapeHtml(item.source_notes_zh) + '</p>';
    }

    // ---- 新增策展字段 ----
    var curationHtml = '';

    if (item.background_zh) {
      curationHtml += '<div class="card-curation-section"><span class="card-curation-label">📖 背景</span><p class="card-curation-text">' + escapeHtml(item.background_zh) + '</p></div>';
    }

    if (item.key_points_zh && item.key_points_zh.length > 0) {
      var kpItems = item.key_points_zh.map(function(kp) {
        return '<li class="card-keypoint">' + escapeHtml(kp) + '</li>';
      }).join('');
      curationHtml += '<div class="card-curation-section"><span class="card-curation-label">🔑 关键看点</span><ul class="card-keypoints">' + kpItems + '</ul></div>';
    }

    if (item.content_format_zh) {
      curationHtml += '<div class="card-curation-section"><span class="card-curation-label">📋</span> <span class="card-format-tag">' + escapeHtml(item.content_format_zh) + '</span></div>';
    }

    if (item.recommended_for_zh && item.recommended_for_zh.length > 0) {
      var rfItems = item.recommended_for_zh.map(function(rf) {
        return '<span class="card-recommended-tag">' + escapeHtml(rf) + '</span>';
      }).join('');
      curationHtml += '<div class="card-curation-section"><span class="card-curation-label">👥 适合人群</span><div class="card-recommended-for">' + rfItems + '</div></div>';
    }

    if (item.reading_or_watching_guide_zh) {
      curationHtml += '<div class="card-curation-section"><span class="card-curation-label">🧭 阅读/观看指南</span><p class="card-curation-text">' + escapeHtml(item.reading_or_watching_guide_zh) + '</p></div>';
    }

    if (item.curator_note_zh) {
      curationHtml += '<div class="card-curation-section"><span class="card-curation-label">💬 策展说明</span><p class="card-curation-text card-curator-note">' + escapeHtml(item.curator_note_zh) + '</p></div>';
    }

    if (item.related_themes_zh && item.related_themes_zh.length > 0) {
      var rtItems = item.related_themes_zh.map(function(rt) {
        return '<span class="tag tag-related">' + escapeHtml(rt) + '</span>';
      }).join('');
      curationHtml += '<div class="card-curation-section"><span class="card-curation-label">🏷 相关主题</span><div class="card-tags">' + rtItems + '</div></div>';
    }

    return '<article class="' + cardClass + '">' +
      badge +
      '<div class="card-header">' +
        '<span class="card-category">' + escapeHtml(item.category || '') + '</span>' +
        '<div class="card-title">' + escapeHtml(item.title_zh || '') + '</div>' +
        titleEn +
      '</div>' +
      (metaItems.length > 0 ? '<div class="card-meta">' + metaItems.join('') + '</div>' : '') +
      (item.summary_zh ? '<p class="card-summary">' + escapeHtml(item.summary_zh) + '</p>' : '') +
      (item.why_it_matters_zh ? '<div class="card-why"><span class="card-why-label">💡 为什么值得看</span>' + escapeHtml(item.why_it_matters_zh) + '</div>' : '') +
      tagsHtml +
      curationHtml +
      embedHtml +
      '<div class="card-links">' + linksHtml + '</div>' +
    '</article>';
  }

  // ---- HTML 转义 ----
  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ---- 启动 ----
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
