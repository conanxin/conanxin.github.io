/* Artvee Daily Digest · Archive page filter / navigation
 *
 * Public-safe, no framework, no external dependencies.
 * Provides:
 *   - artist / category / search filters over .day-card elements
 *   - dynamic population of artist + category <select> options
 *   - "Clear" button to reset filters
 *   - "Jump to latest" button to scroll to the newest day card
 *   - hidden state when no cards match (shows #no-results notice)
 *
 * The page is fully readable with JS disabled — every card and
 * meta chip is server-rendered. JS only adds interactivity.
 */
(function () {
  "use strict";

  function uniq(values) {
    var seen = {};
    var out = [];
    for (var i = 0; i < values.length; i++) {
      var v = values[i];
      if (!v || seen[v]) continue;
      seen[v] = true;
      out.push(v);
    }
    out.sort();
    return out;
  }

  function $(id) { return document.getElementById(id); }

  function applyFilters() {
    var artist = ($("filter-artist") || {}).value || "";
    var category = ($("filter-category") || {}).value || "";
    var search = (($("filter-search") || {}).value || "").toLowerCase();

    var cards = document.querySelectorAll(".day-card");
    var visibleCount = 0;
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var cardArtist = card.getAttribute("data-artists") || "";
      var cardCategory = card.getAttribute("data-categories") || "";
      var cardSearch = card.getAttribute("data-search") || "";
      var match = true;
      if (artist && (" " + cardArtist + " ").indexOf(" " + artist + " ") === -1) {
        match = false;
      }
      if (match && category && (" " + cardCategory + " ").indexOf(" " + category + " ") === -1) {
        match = false;
      }
      if (match && search) {
        var terms = search.split(/\s+/).filter(function (t) { return t.length > 0; });
        for (var k = 0; k < terms.length; k++) {
          if (cardSearch.indexOf(terms[k]) === -1) { match = false; break; }
        }
      }
      if (match) { card.classList.remove("hidden"); visibleCount++; }
      else       { card.classList.add("hidden"); }
    }

    var noResults = $("no-results");
    if (noResults) {
      if (visibleCount === 0) noResults.classList.remove("hidden");
      else                    noResults.classList.add("hidden");
    }
  }

  function populateSelect(selectId, values) {
    var sel = $(selectId);
    if (!sel) return;
    var first = sel.firstElementChild;
    while (sel.children.length > 1) sel.removeChild(sel.lastChild);
    for (var i = 0; i < values.length; i++) {
      var opt = document.createElement("option");
      opt.value = values[i];
      opt.textContent = values[i];
      sel.appendChild(opt);
    }
  }

  function init() {
    var cards = document.querySelectorAll(".day-card");
    var artists = [];
    var categories = [];
    for (var i = 0; i < cards.length; i++) {
      var a = (cards[i].getAttribute("data-artists") || "").split("|");
      var c = (cards[i].getAttribute("data-categories") || "").split("|");
      for (var j = 0; j < a.length; j++) if (a[j]) artists.push(a[j]);
      for (var k = 0; k < c.length; k++) if (c[k]) categories.push(c[k]);
    }
    populateSelect("filter-artist", uniq(artists));
    populateSelect("filter-category", uniq(categories));

    var ids = ["filter-artist", "filter-category", "filter-search"];
    for (var m = 0; m < ids.length; m++) {
      var el = $(ids[m]);
      if (!el) continue;
      var ev = (el.tagName === "INPUT") ? "input" : "change";
      el.addEventListener(ev, applyFilters);
    }
    var clearBtn = $("filter-clear");
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        var sa = $("filter-artist"); if (sa) sa.value = "";
        var sc = $("filter-category"); if (sc) sc.value = "";
        var ss = $("filter-search"); if (ss) ss.value = "";
        applyFilters();
      });
    }
    var jump = $("jump-latest");
    if (jump) {
      jump.addEventListener("click", function () {
        var first = document.querySelector(".day-card:not(.hidden)");
        if (first) first.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
    applyFilters();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
