/* ============================================
   DMC Finance Portal — Charts
   js/charts.js

   Requires: Chart.js (loaded via CDN in HTML)
             DMC_UI (js/ui.js)
   ============================================ */

const DMC_CHARTS = (function () {

  /* Keep references so we can destroy before redraw */
  var _instances = {};

  /* ------------------------------------------
     Shared Chart.js defaults
  ------------------------------------------ */
  var COLORS = {
    income:   '#5DCAA5',
    expenses: '#F09595',
    net:      '#D85A30',
    netFill:  'rgba(216,90,48,0.07)',
    purple:   '#7F77DD',
    gridLine: 'rgba(0,0,0,0.04)'
  };

  function destroyIfExists(id) {
    if (_instances[id]) {
      _instances[id].destroy();
      delete _instances[id];
    }
  }

  function axisConfig() {
    return {
      ticks: { callback: DMC_UI.fmtAxis },
      grid:  { color: COLORS.gridLine }
    };
  }

  /* ------------------------------------------
     Monthly Income vs Expenses — bar chart
     Used on: index.html (dashboard)
  ------------------------------------------ */
  function renderMonthlyBar(canvasId, monthMap) {
    destroyIfExists(canvasId);
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;

    var keys    = Object.keys(monthMap).sort();
    var labels  = keys.map(DMC_UI.monthShort);
    var incData = keys.map(function (k) { return Math.round(monthMap[k].income); });
    var expData = keys.map(function (k) { return Math.round(monthMap[k].expenses); });

    _instances[canvasId] = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Income',
            data: incData,
            backgroundColor: COLORS.income,
            borderRadius: 4,
            borderSkipped: false
          },
          {
            label: 'Expenses',
            data: expData,
            backgroundColor: COLORS.expenses,
            borderRadius: 4,
            borderSkipped: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: axisConfig()
        }
      }
    });
  }

  /* ------------------------------------------
     Net Income Trend — line chart
     Used on: index.html (dashboard)
  ------------------------------------------ */
  function renderNetTrend(canvasId, monthMap) {
    destroyIfExists(canvasId);
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;

    var keys    = Object.keys(monthMap).sort();
    var labels  = keys.map(DMC_UI.monthShort);
    var netData = keys.map(function (k) {
      return Math.round(monthMap[k].income - monthMap[k].expenses);
    });

    _instances[canvasId] = new Chart(canvas, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Net income',
          data: netData,
          borderColor: COLORS.net,
          backgroundColor: COLORS.netFill,
          tension: 0.35,
          fill: true,
          pointRadius: 5,
          pointBackgroundColor: COLORS.net,
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: axisConfig()
        }
      }
    });
  }

  /* ------------------------------------------
     Expense Category Breakdown — horizontal bar
     Used on: monthly.html
  ------------------------------------------ */
  function renderExpenseBreakdown(canvasId, breakdown) {
    destroyIfExists(canvasId);
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;

    var labels = ['Salaries','Purchases','Rental','Utilities','Benefits','Staff Meals','PCF','Taxes','Sundries'];
    var keys   = ['sal','pur','rent','util','ben','meals','pcf','tax','sun'];
    var data   = keys.map(function (k) { return Math.round(breakdown[k] || 0); });

    _instances[canvasId] = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Total',
          data: data,
          backgroundColor: COLORS.purple,
          borderRadius: 4,
          borderSkipped: false
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: axisConfig(),
          y: { grid: { display: false } }
        }
      }
    });
  }

  /* ------------------------------------------
     Channel Breakdown — doughnut chart
     Used on: monthly.html (income by channel)
  ------------------------------------------ */
  function renderChannelDoughnut(canvasId, entries) {
    destroyIfExists(canvasId);
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;

    var totals = { cash: 0, gcash: 0, card: 0, fp: 0, other: 0 };
    entries.forEach(function (e) {
      if (e.channels) {
        Object.keys(totals).forEach(function (ch) {
          totals[ch] += (e.channels[ch] || 0);
        });
      }
    });

    var labels = ['Cash', 'GCash', 'Card', 'Foodpanda', 'Other'];
    var keys   = ['cash', 'gcash', 'card', 'fp', 'other'];
    var data   = keys.map(function (k) { return Math.round(totals[k]); });
    var colors = ['#5DCAA5','#7F77DD','#378ADD','#F09595','#EF9F27'];

    _instances[canvasId] = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: { font: { size: 12 }, padding: 12 }
          }
        },
        cutout: '65%'
      }
    });
  }

  /* --- Public API --- */
  return {
    renderMonthlyBar:       renderMonthlyBar,
    renderNetTrend:         renderNetTrend,
    renderExpenseBreakdown: renderExpenseBreakdown,
    renderChannelDoughnut:  renderChannelDoughnut,
    destroyIfExists:        destroyIfExists
  };

})();
