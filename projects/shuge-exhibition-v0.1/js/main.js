/* SHUGE DH Exhibition v0.1 — minimal interactivity */

// Accordion toggle for run details (Evidence page)
document.addEventListener('DOMContentLoaded', function() {
  // Run row click → toggle detail
  document.querySelectorAll('.run-summary').forEach(function(el) {
    el.addEventListener('click', function() {
      var detail = el.nextElementSibling;
      if (detail && detail.classList.contains('run-detail')) {
        detail.classList.toggle('open');
      }
    });
  });

  // Collection filter (Evidence page)
  var filterRadios = document.querySelectorAll('.filter-row input[name="coll-filter"]');
  filterRadios.forEach(function(radio) {
    radio.addEventListener('change', function() {
      var val = radio.value;
      document.querySelectorAll('.run').forEach(function(run) {
        if (val === 'all' || run.dataset.coll === val) {
          run.style.display = '';
        } else {
          run.style.display = 'none';
        }
      });
      // Status filter
      var statusVal = document.querySelector('input[name="status-filter"]:checked');
      if (statusVal) {
        var sVal = statusVal.value;
        document.querySelectorAll('.run').forEach(function(run) {
          if (sVal !== 'all' && run.dataset.status !== sVal) {
            run.style.display = 'none';
          }
        });
      }
    });
  });

  // Status filter
  var statusRadios = document.querySelectorAll('.filter-row input[name="status-filter"]');
  statusRadios.forEach(function(radio) {
    radio.addEventListener('change', function() {
      var val = radio.value;
      document.querySelectorAll('.run').forEach(function(run) {
        if (val === 'all' || run.dataset.status === val) {
          run.style.display = '';
        } else {
          run.style.display = 'none';
        }
      });
      // Then apply collection filter
      var collVal = document.querySelector('input[name="coll-filter"]:checked');
      if (collVal) {
        var cVal = collVal.value;
        document.querySelectorAll('.run').forEach(function(run) {
          if (cVal !== 'all' && run.dataset.coll !== cVal) {
            run.style.display = 'none';
          }
        });
      }
    });
  });

  // Workspace → evidence link
  document.querySelectorAll('[data-jump-to]').forEach(function(el) {
    el.addEventListener('click', function(e) {
      // normal <a href> works; no extra logic needed
    });
  });
});
