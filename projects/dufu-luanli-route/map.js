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

    clearDetail();
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
  }

  // ── Boot ──────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
