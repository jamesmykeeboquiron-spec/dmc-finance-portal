/* ============================================
   DMC Finance Portal — Shared UI Utilities
   js/ui.js
   ============================================ */

const DMC_UI = (function () {

  const MONTHS = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  /* ------------------------------------------
     Number formatting
  ------------------------------------------ */
  function fmt(n) {
    return '₱' + Math.round(n).toLocaleString('en-PH');
  }

  function fmtDec(n) {
    return '₱' + Number(n).toLocaleString('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function fmtAxis(v) {
    if (v >= 1000000) return '₱' + (v / 1000000).toFixed(1) + 'M';
    if (v >= 1000)    return '₱' + (v / 1000).toFixed(0) + 'k';
    return '₱' + v;
  }

  function monthName(key) {
    /* key = 'YYYY-MM' */
    return MONTHS[parseInt(key.split('-')[1]) - 1];
  }

  function monthShort(key) {
    return monthName(key).substring(0, 3);
  }

  /* ------------------------------------------
     Toast notification
  ------------------------------------------ */
  function toast(msg, duration) {
    duration = duration || 2500;
    let el = document.getElementById('toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast';
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('show');
    setTimeout(function () { el.classList.remove('show'); }, duration);
  }

  /* ------------------------------------------
     Set active nav link based on current page
  ------------------------------------------ */
  function setActiveNav() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === path || (path === '' && href === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  /* ------------------------------------------
     Render recent entries list (dashboard)
  ------------------------------------------ */
  function renderRecentList(entries, containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    const recent = entries.slice().reverse().slice(0, 10);
    if (!recent.length) {
      el.innerHTML = '<div class="empty-state">No entries yet — use Daily Entry to start logging</div>';
      return;
    }

    el.innerHTML = recent.map(function (e) {
      const net = e.income - e.expenses;
      const netClass = net >= 0 ? 'pos' : 'neg';
      const netPrefix = net >= 0 ? '+' : '';
      return [
        '<div class="entry-row">',
          '<span class="col-date">', e.date.substring(5), '</span>',
          '<span class="col-desc">', e.note, '</span>',
          '<span class="col-amt pos col-inc">', fmt(e.income), '</span>',
          '<span class="col-amt neg col-exp">-', fmt(e.expenses), '</span>',
          '<span class="col-amt ', netClass, ' col-net">', netPrefix, fmt(net), '</span>',
        '</div>'
      ].join('');
    }).join('');
  }

  /* ------------------------------------------
     Render monthly summary table
  ------------------------------------------ */
  function renderMonthlyTable(monthMap, tbodyId, footIds) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;

    const keys = Object.keys(monthMap).sort();
    let totI = 0, totE = 0;

    tbody.innerHTML = keys.map(function (k) {
      const r   = monthMap[k];
      const net = r.income - r.expenses;
      totI += r.income;
      totE += r.expenses;

      const badge = net >= 0
        ? '<span class="badge profit">&#8593; Profit</span>'
        : '<span class="badge loss">&#8595; Loss</span>';

      return [
        '<tr>',
          '<td>', monthName(k), '</td>',
          '<td class="text-right text-green">', fmt(r.income), '</td>',
          '<td class="text-right text-red">',   fmt(r.expenses), '</td>',
          '<td class="text-right fw-600 ', (net >= 0 ? 'text-green' : 'text-red'), '">',
            fmt(net),
          '</td>',
          '<td class="text-right">', badge, '</td>',
        '</tr>'
      ].join('');
    }).join('');

    /* Footer totals */
    const totNet = totI - totE;
    if (footIds) {
      var fi = document.getElementById(footIds.income);
      var fe = document.getElementById(footIds.expenses);
      var fn = document.getElementById(footIds.net);
      if (fi) fi.textContent = fmt(totI);
      if (fe) fe.textContent = fmt(totE);
      if (fn) {
        fn.textContent = fmt(totNet);
        fn.className   = totNet >= 0 ? 'text-right text-green' : 'text-right text-red';
      }
    }
  }

  /* ------------------------------------------
     Get numeric value from an input safely
  ------------------------------------------ */
  function getVal(id) {
    var el = document.getElementById(id);
    return el ? (parseFloat(el.value) || 0) : 0;
  }

  /* ------------------------------------------
     Set today's date as default on a date input
  ------------------------------------------ */
  function setTodayDate(inputId, labelId) {
    var today = new Date();
    var iso   = today.toISOString().split('T')[0];
    var el    = document.getElementById(inputId);
    if (el) el.value = iso;

    var lbl = document.getElementById(labelId);
    if (lbl) {
      lbl.textContent = today.toLocaleDateString('en-PH', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
    }
  }

  /* --- Public API --- */
  return {
    MONTHS:             MONTHS,
    fmt:                fmt,
    fmtDec:             fmtDec,
    fmtAxis:            fmtAxis,
    monthName:          monthName,
    monthShort:         monthShort,
    toast:              toast,
    setActiveNav:       setActiveNav,
    renderRecentList:   renderRecentList,
    renderMonthlyTable: renderMonthlyTable,
    getVal:             getVal,
    setTodayDate:       setTodayDate
  };

})();
