/**
 * map.js — Du Fu Route Leaflet Map Prototype
 * Phase 6B — 杜甫诗路真实地图原型
 *
 * Reads:
 *   data/map_points.json
 *   data/route_segments.geojson
 *   data/locations.json
 *   data/poems.json
 *
 * Features:
 *   - Leaflet map with WGS84 markers and route lines
 *   - Marker popup with name/modern/accuracy/stage/siteType/note
 *   - Right-side detail panel with location info and poems
 *   - Stage filter chips
 *   - fitBounds to all visible markers
 */

(function () {
  'use strict';

  // ── State ─────────────────────────────────────────────────────
  let map = null;
  let allMarkers = [];        // { marker, pt }
  let allLines = [];          // { polyline, fromId, toId }
  let allPoints = [];         // raw map_points array
  let allLocations = [];      // raw locations array
  let allPoems = [];          // raw poems array
  let activeStage = 'all';
  let activeMarkerId = null;
  let prevMarker = null;   // previously active marker for icon reset

  // ── Leaflet Default Icon Fix (DEPRECATED — using CSS DivIcon instead) ─
  // L.Icon.Default.mergeOptions({
  //   iconRetinaUrl: 'vendor/leaflet/images/marker-icon-2x.png',
  //   iconUrl: 'vendor/leaflet/images/marker-icon.png',
  //   shadowUrl: 'vendor/leaflet/images/marker-shadow.png'
  // });

  // ── Escape HTML ─────────────────────────────────────────────
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ── Accuracy → CSS class ─────────────────────────────────────
  function accuracyClass(acc) {
    return 'detail-tag detail-tag--accuracy-' + acc;
  }

  // ── Create CSS-based DivIcon marker ─────────────────────────
  function createDufuMarkerIcon(pt, isActive) {
    var accuracy = pt.accuracy || 'approximate';
    var cls = [
      'dufu-div-marker',
      'accuracy-' + accuracy,
      isActive ? 'is-active' : ''
    ].join(' ');
    return L.divIcon({
      className: cls,
      html: '<span class="dufu-div-marker-dot" title="' + escapeHtml(pt.name || '') + '"></span>',
      iconSize: [22, 22],
      iconAnchor: [11, 11],
      popupAnchor: [0, -12]
    });
  }

  // ── Build popup HTML ─────────────────────────────────────────
  function buildPopupHTML(pt) {
    const stageLabel = pt.stage || '未知阶段';
    return `
      <div class="popup-name">${pt.name}</div>
      <div class="popup-modern">${pt.modern}</div>
      <span class="popup-stage-badge">${stageLabel}</span>
    `;
  }

  // ── Build detail card HTML ───────────────────────────────────
  function buildDetailCard(pt) {
    // find corresponding location record
    const loc = allLocations.find(function (l) { return l.id === pt.locationId; }) || {};

    // find poems for this locationId
    const poems = allPoems.filter(function (p) { return p.locationId === pt.locationId; });

    const accLabel = {
      city: '城市级',
      district: '区县级',
      scenic: '景区级',
      approximate: '估算值',
      disputed: '有争议'
    }[pt.accuracy] || pt.accuracy;

    // Build siteType tags
    const siteTypeTags = (pt.siteType || []).map(function (t) {
      return '<span class="detail-tag">' + t + '</span>';
    }).join('');

    // Build poem list
    let poemsHTML = '';
    if (poems.length > 0) {
      poemsHTML = '<ul class="detail-poems">' +
        poems.map(function (p) {
          return '<li>' + p.title + '</li>';
        }).join('') +
        '</ul>';
    } else {
      poemsHTML = '<p class="detail-empty">暂无关联诗歌</p>';
    }

    return `
      <div class="detail-card">
        <div class="detail-name">${pt.name}</div>
        <div class="detail-modern">今日：${pt.modern}</div>

        <div class="detail-tags">
          <span class="detail-tag detail-tag--stage">${pt.stage || ''}</span>
          <span class="${accuracyClass(pt.accuracy)}">${accLabel}</span>
          ${siteTypeTags}
        </div>

        <div class="detail-note">${pt.note || ''}</div>

        ${loc.articleMeaning ? `
        <div class="detail-section">
          <div class="detail-section-title">历史意义</div>
          <p>${loc.articleMeaning}</p>
        </div>` : ''}

        ${loc.travelTip ? `
        <div class="detail-section">
          <div class="detail-section-title">文旅提示</div>
          <p>${loc.travelTip}</p>
        </div>` : ''}

        <div class="detail-section">
          <div class="detail-section-title">相关诗歌（${poems.length}首）</div>
          ${poemsHTML}
        </div>
      </div>
    `;
  }

  // ── Render detail panel ───────────────────────────────────────
  function showDetail(pt) {
    var detail = document.getElementById('map-detail');
    if (!detail) return;
    detail.innerHTML = buildDetailCard(pt);
  }

  function clearDetail() {
    var detail = document.getElementById('map-detail');
    if (!detail) return;
    detail.innerHTML = '<div class="detail-placeholder"><p>点击地图上的标记点<br>查看地点详情、相关诗歌与历史意义</p></div>';
  }

  // ── Render map intro (shown after data loads, before any marker click) ─
  function renderMapIntro(mapPoints, routeGeoJSON) {
    var detail = document.getElementById('map-detail');
    if (!detail) return;

    var segCount = routeGeoJSON.features ? routeGeoJSON.features.length : 0;
    var legendHTML = [
      '<div class="map-legend">',
      '  <div><span class="legend-dot accuracy-city"></span> 城市级参考点</div>',
      '  <div><span class="legend-dot accuracy-district"></span> 区县级参考点</div>',
      '  <div><span class="legend-dot accuracy-scenic"></span> 景区 / 实地景点</div>',
      '  <div><span class="legend-dot accuracy-approximate"></span> 近似 / 考证提示点</div>',
      '</div>'
    ].join('');

    detail.innerHTML = [
      '<div class="map-detail-empty">',
      '  <div class="detail-kicker">Map Ready</div>',
      '  <h2>地图已加载</h2>',
      '  <p>左侧地图已载入 <strong>' + mapPoints.length + '</strong> 个今日地点参考点和 <strong>' + segCount + '</strong> 条路线示意线。</p>',
      '  <p>点击任一圆点，可查看对应地点、地点类型、相关诗歌与旅行提示。</p>',
      legendHTML,
      '</div>'
    ].join('');
  }

  // ── Render stage summary (shown when a stage filter is active but no marker is selected) ─
  function showStageSummary(stage, points) {
    var detail = document.getElementById('map-detail');
    if (!detail) return;

    var stageLabel = {
      '长安奉先': '长安 · 奉先',
      '安史逃亡': '安史逃亡',
      '陷京见证': '陷京 · 见证',
      '三吏三别': '三吏三别',
      '秦州陇蜀': '秦州 · 陇蜀',
      '成都草堂': '成都草堂'
    }[stage] || stage;

    var count = points.length;
    if (count === 0) {
      detail.innerHTML = [
        '<div class="map-detail-empty">',
        '  <div class="detail-kicker">' + stageLabel + '</div>',
        '  <h2>本阶段暂无点位</h2>',
        '  <p>该阶段暂无记录，请切换其他阶段。</p>',
        '</div>'
      ].join('');
      return;
    }

    detail.innerHTML = [
      '<div class="map-detail-empty">',
      '  <div class="detail-kicker">当前阶段</div>',
      '  <h2>' + stageLabel + '</h2>',
      '  <p>本阶段包含 <strong>' + count + '</strong> 个今日地点参考点。</p>',
      '  <p>点击地图中的圆点查看详情。</p>',
      '</div>'
    ].join('');
  }

  // ── Highlight marker ─────────────────────────────────────────
  function highlightMarker(ptId) {
    allMarkers.forEach(function (item) {
      var isActive = (item.pt.id === ptId);
      item.marker.setIcon(createDufuMarkerIcon(item.pt, isActive));
    });
  }

  // ── Apply stage filter ────────────────────────────────────────
  function applyFilter(stage) {
    activeStage = stage;

    // Update chip active states
    document.querySelectorAll('.stage-chip').forEach(function (chip) {
      chip.classList.toggle('active', chip.dataset.stage === stage);
    });

    // Show/hide markers
    allMarkers.forEach(function (item) {
      var show = (stage === 'all' || item.pt.stage === stage);
      if (show) {
        map.addLayer(item.marker);
      } else {
        map.removeLayer(item.marker);
      }
    });

    // Show/hide lines — keep all but dim if filtering
    allLines.forEach(function (item) {
      var show = (stage === 'all' || item.stage === stage);
      if (show) {
        map.addLayer(item.polyline);
        item.polyline.setStyle({ opacity: 0.7, weight: 3 });
      } else {
        map.addLayer(item.polyline);
        item.polyline.setStyle({ opacity: 0.2, weight: 1.5 });
      }
    });

    // fitBounds to visible markers
    var visibleMarkers = allMarkers.filter(function (item) {
      return (stage === 'all' || item.pt.stage === stage);
    });

    if (visibleMarkers.length > 0) {
      var group = L.featureGroup(visibleMarkers.map(function (item) { return item.marker; }));
      map.fitBounds(group.getBounds().pad(0.2));
    }

    // Show stage summary if '全部', otherwise show filtered stage summary
    if (stage === 'all') {
      clearDetail();
    } else {
      showStageSummary(stage, visibleMarkers.map(function (item) { return item.pt; }));
    }
  }

  // ── Setup stage filter chips ──────────────────────────────────
  function setupFilterChips() {
    document.querySelectorAll('.stage-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        applyFilter(chip.dataset.stage);
      });
    });
  }

  // ── Fetch JSON helper ────────────────────────────────────────
  function fetchJSON(url) {
    return fetch(url).then(function (resp) {
      if (!resp.ok) throw new Error('HTTP ' + resp.status + ' for ' + url);
      return resp.json();
    });
  }

  // ── Load data and init map ────────────────────────────────────
  function init() {
    var detail = document.getElementById('map-detail');
    if (detail) {
      detail.innerHTML = '<div class="map-loading">正在加载地图数据…</div>';
    }

    Promise.all([
      fetchJSON('data/map_points.json'),
      fetchJSON('data/route_segments.geojson'),
      fetchJSON('data/locations.json'),
      fetchJSON('data/poems.json')
    ]).then(function (results) {
      var mapPoints = results[0];
      var routeGeoJSON = results[1];
      allLocations = results[2];
      allPoems = results[3];
      allPoints = mapPoints;

      console.log(
        '[DuFu Map] Loaded: ' + mapPoints.length + ' points, ' +
        (routeGeoJSON.features ? routeGeoJSON.features.length : 0) + ' route segments, ' +
        allLocations.length + ' locations, ' + allPoems.length + ' poems'
      );

      buildMap(mapPoints, routeGeoJSON);
      setupFilterChips();
    }).catch(function (err) {
      console.error('[DuFu Map] Data load failed:', err);
      var detail = document.getElementById('map-detail');
      if (detail) {
        detail.innerHTML = '<div class="map-error">地图数据加载失败：' + err.message + '</div>';
      }
    });
  }

  // ── Populate stage chip counts (called after data loads) ───────
  function renderChipCounts(mapPoints) {
    var stageIds = ['all', '长安奉先', '安史逃亡', '陷京见证', '三吏三别', '秦州陇蜀', '成都草堂'];
    stageIds.forEach(function (stage) {
      var el = document.getElementById('count-' + stage);
      if (!el) return;
      if (stage === 'all') {
        el.textContent = mapPoints.length;
      } else {
        var pts = mapPoints.filter(function (p) { return p.stage === stage; });
        el.textContent = pts.length;
      }
    });
  }

  // ── Build Leaflet Map ─────────────────────────────────────────
  function buildMap(mapPoints, routeGeoJSON) {
    // Initialize map centered on China mid-west (Xi'an area)
    map = L.map('dufu-real-map', {
      center: [34.2, 107.5],
      zoom: 5,
      zoomControl: true,
      scrollWheelZoom: true
    });

    // Add a neutral dark tile layer (OpenStreetMap with dark style)
    // Use CartoDB Positron dark for clean neutral look (no API key needed)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    // ── Render route lines ─────────────────────────────────────
    var segErrors = 0;
    if (routeGeoJSON.features) {
      routeGeoJSON.features.forEach(function (feat) {
        var props = feat.properties || {};
        var coords = feat.geometry ? feat.geometry.coordinates : [];
        if (coords.length < 2) { segErrors++; return; }

        // Convert [lng, lat] → [[lng,lat], ...]
        var latLngs = coords.map(function (c) { return [c[1], c[0]]; });

        var polyline = L.polyline(latLngs, {
          color: '#c8874a',
          weight: 3,
          opacity: 0.7,
          smoothFactor: 1.5
        });

        polyline.addTo(map);
        allLines.push({
          polyline: polyline,
          fromId: props.from,
          toId: props.to,
          stage: props.stage
        });
      });
    }

    if (segErrors > 0) {
      console.warn('[DuFu Map] Skipped ' + segErrors + ' route segments with insufficient coordinates');
    }

    // ── Render markers ──────────────────────────────────────────
    mapPoints.forEach(function (pt) {
      var marker = L.marker([pt.lat, pt.lng], {
        icon: createDufuMarkerIcon(pt, false),
        title: pt.name
      });

      marker.bindPopup(buildPopupHTML(pt), {
        maxWidth: 240,
        closeButton: true
      });

      marker.on('click', function () {
        activeMarkerId = pt.id;
        highlightMarker(pt.id);
        showDetail(pt);

        // On mobile, scroll detail into view
        var detail = document.getElementById('map-detail');
        if (detail && window.innerWidth <= 768) {
          detail.scrollIntoView({ behavior: 'smooth' });
        }
      });

      marker.addTo(map);
      allMarkers.push({ marker: marker, pt: pt });
    });

    // ── Fit bounds ──────────────────────────────────────────────
    if (allMarkers.length > 0) {
      var bounds = L.latLngBounds(allMarkers.map(function (item) {
        return [item.pt.lat, item.pt.lng];
      }));
      map.fitBounds(bounds.pad(0.15));
    }

    console.log(
      '[DuFu Map] Initialized: ' + allMarkers.length + ' markers, ' +
      allLines.length + ' route lines'
    );

    // Show intro state with legend after map is ready
    renderMapIntro(mapPoints, routeGeoJSON);
    // Populate chip counts
    renderChipCounts(mapPoints);
  }

  // ── Boot ──────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
