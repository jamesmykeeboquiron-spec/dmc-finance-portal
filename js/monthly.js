/* ============================================
   DMC Finance Portal — Monthly View Logic
   js/monthly.js

   Used by: monthly.html only
   Requires: data.js, ui.js, charts.js
   ============================================ */

(function () {

  function init() {
    DMC_UI.setActiveNav();

    var entries  = DMC_DATA.load();
    var monthMap = DMC_DATA.byMonth(entries);
    var breakdown = DMC_DATA.expenseBreakdown(entries);

    DMC_UI.renderMonthlyTable(monthMap, 'monthly-tbody', {
      income:   'foot-inc',
      expenses: 'foot-exp',
      net:      'foot-net'
    });

    DMC_CHARTS.renderExpenseBreakdown('chart-breakdown', breakdown);
    DMC_CHARTS.renderChannelDoughnut('chart-channels', entries);
  }

  document.addEventListener('DOMContentLoaded', init);

})();
