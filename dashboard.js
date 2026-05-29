/* ============================================
   DMC Finance Portal — Dashboard Logic
   js/dashboard.js

   Used by: index.html only
   Requires: data.js, ui.js, charts.js
   ============================================ */

(function () {

  function init() {
    DMC_UI.setActiveNav();

    var entries  = DMC_DATA.load();
    var summary  = DMC_DATA.ytdSummary(entries);
    var monthMap = DMC_DATA.byMonth(entries);
    var net      = summary.income - summary.expenses;

    /* Metric cards */
    setText('m-income',  DMC_UI.fmt(summary.income));
    setText('m-expense', DMC_UI.fmt(summary.expenses));
    setMetric('m-net',   net);
    setText('m-balance', DMC_UI.fmt(net));

    /* Recent entries list */
    DMC_UI.renderRecentList(entries, 'recent-list');

    /* Charts */
    DMC_CHARTS.renderMonthlyBar('chart-monthly', monthMap);
    DMC_CHARTS.renderNetTrend('chart-net', monthMap);
  }

  function setText(id, val) {
    var el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function setMetric(id, net) {
    var el = document.getElementById(id);
    if (!el) return;
    el.textContent = DMC_UI.fmt(net);
    el.className   = 'metric-val ' + (net >= 0 ? 'green' : 'red');
  }

  document.addEventListener('DOMContentLoaded', init);

})();
