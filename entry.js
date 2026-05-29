/* ============================================
   DMC Finance Portal — Daily Entry Logic
   js/entry.js

   Used by: entry.html only
   Requires: data.js, ui.js
   ============================================ */

(function () {

  /* Income field IDs */
  var INC_FIELDS = ['inc-cash','inc-gcash','inc-card','inc-fp','inc-other'];

  /* Expense field IDs */
  var EXP_FIELDS = ['exp-sal','exp-pur','exp-rent','exp-util','exp-ben','exp-meals','exp-pcf','exp-tax','exp-sun'];

  /* ------------------------------------------
     Live calculation as manager types
  ------------------------------------------ */
  function calcTotals() {
    var inc = INC_FIELDS.reduce(function (s, id) { return s + DMC_UI.getVal(id); }, 0);
    var exp = EXP_FIELDS.reduce(function (s, id) { return s + DMC_UI.getVal(id); }, 0);
    var net = inc - exp;

    setText('inc-total', DMC_UI.fmtDec(inc));
    setText('exp-total', DMC_UI.fmtDec(exp));

    var netEl = document.getElementById('net-day');
    if (netEl) {
      netEl.textContent = DMC_UI.fmtDec(net);
      netEl.style.color = net >= 0 ? '#1D9E75' : '#E24B4A';
    }
  }

  /* ------------------------------------------
     Save entry
  ------------------------------------------ */
  function saveEntry() {
    var date = getInputVal('entry-date');
    if (!date) { alert('Please select a date.'); return; }

    var inc = INC_FIELDS.reduce(function (s, id) { return s + DMC_UI.getVal(id); }, 0);
    var exp = EXP_FIELDS.reduce(function (s, id) { return s + DMC_UI.getVal(id); }, 0);
    var note = getInputVal('exp-note') || 'Daily entry';

    var entry = {
      date:     date,
      income:   inc,
      expenses: exp,
      note:     note,
      channels: {
        cash:  DMC_UI.getVal('inc-cash'),
        gcash: DMC_UI.getVal('inc-gcash'),
        card:  DMC_UI.getVal('inc-card'),
        fp:    DMC_UI.getVal('inc-fp'),
        other: DMC_UI.getVal('inc-other')
      },
      expBreak: {
        sal:   DMC_UI.getVal('exp-sal'),
        pur:   DMC_UI.getVal('exp-pur'),
        rent:  DMC_UI.getVal('exp-rent'),
        util:  DMC_UI.getVal('exp-util'),
        ben:   DMC_UI.getVal('exp-ben'),
        meals: DMC_UI.getVal('exp-meals'),
        pcf:   DMC_UI.getVal('exp-pcf'),
        tax:   DMC_UI.getVal('exp-tax'),
        sun:   DMC_UI.getVal('exp-sun')
      }
    };

    var ok = DMC_DATA.save(entry);

    if (ok) {
      resetForm();
      DMC_UI.toast('Entry saved ✓');
    } else {
      alert('Could not save entry. Please try again.');
    }
  }

  /* ------------------------------------------
     Reset all form fields after save
  ------------------------------------------ */
  function resetForm() {
    INC_FIELDS.concat(EXP_FIELDS).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.value = '';
    });
    var noteEl = document.getElementById('exp-note');
    if (noteEl) noteEl.value = '';

    setText('inc-total', '₱0.00');
    setText('exp-total', '₱0.00');

    var netEl = document.getElementById('net-day');
    if (netEl) {
      netEl.textContent = '₱0.00';
      netEl.style.color = '#1a1a18';
    }
  }

  /* ------------------------------------------
     Helpers
  ------------------------------------------ */
  function setText(id, val) {
    var el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function getInputVal(id) {
    var el = document.getElementById(id);
    return el ? el.value : '';
  }

  /* ------------------------------------------
     Init
  ------------------------------------------ */
  function init() {
    DMC_UI.setActiveNav();
    DMC_UI.setTodayDate('entry-date', 'today-label');

    INC_FIELDS.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', calcTotals);
    });

    EXP_FIELDS.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', calcTotals);
    });

    var saveBtn = document.getElementById('btn-save');
    if (saveBtn) saveBtn.addEventListener('click', saveEntry);
  }

  document.addEventListener('DOMContentLoaded', init);

})();
