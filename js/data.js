/* ============================================
   DMC Finance Portal — Data Layer
   js/data.js

   This is the ONLY file you need to touch
   when connecting to a real database later.
   Replace loadEntries() and saveEntry() with
   your Google Sheets or Supabase calls.
   ============================================ */

const DMC_DATA = (function () {

  const STORAGE_KEY = 'dmc_entries_v1';

  /* ------------------------------------------
     Seed data — pre-loaded from your spreadsheet
     Jan–Apr 2026 monthly closes
  ------------------------------------------ */
  const SEED = [
    {
      date: '2026-01-31',
      income: 770771.75,
      expenses: 704140.14,
      note: 'January close',
      channels: { cash: 0, gcash: 0, card: 0, fp: 0, other: 0 },
      expBreak: {
        sal: 35245.88, pur: 90000, rent: 70273,
        util: 5132.07, ben: 14865, meals: 18000,
        pcf: 70000, tax: 0, sun: 400.19
      }
    },
    {
      date: '2026-02-28',
      income: 601008,
      expenses: 685620.56,
      note: 'February close',
      channels: { cash: 0, gcash: 0, card: 0, fp: 0, other: 0 },
      expBreak: {
        sal: 31244.88, pur: 80000, rent: 70723,
        util: 3303.95, ben: 17990, meals: 18000,
        pcf: 65000, tax: 0, sun: 358.73
      }
    },
    {
      date: '2026-03-31',
      income: 957856.80,
      expenses: 786930.39,
      note: 'March close',
      channels: { cash: 0, gcash: 0, card: 0, fp: 0, other: 0 },
      expBreak: {
        sal: 66268.78, pur: 110000, rent: 80014,
        util: 5695, ben: 9234, meals: 18000,
        pcf: 80000, tax: 0, sun: 17718.61
      }
    },
    {
      date: '2026-04-30',
      income: 1202571.20,
      expenses: 1221421.52,
      note: 'April close',
      channels: { cash: 0, gcash: 0, card: 0, fp: 0, other: 0 },
      expBreak: {
        sal: 93262.62, pur: 120000, rent: 90000,
        util: 13935.48, ben: 17990, meals: 18000,
        pcf: 80000, tax: 0, sun: 188233.42
      }
    }
  ];

  /* ------------------------------------------
     Load all entries from localStorage
     REPLACE THIS with your API call later:
       const res = await fetch('/api/entries');
       return await res.json();
  ------------------------------------------ */
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const stored = raw ? JSON.parse(raw) : [];
      // Merge seed + stored, avoid duplicates by date+note
      const all = [...SEED];
      stored.forEach(function (e) {
        const isDupe = SEED.some(function (s) { return s.date === e.date && s.note === e.note; });
        if (!isDupe) all.push(e);
      });
      return all.sort(function (a, b) { return a.date.localeCompare(b.date); });
    } catch (err) {
      console.error('DMC_DATA.load error:', err);
      return [...SEED];
    }
  }

  /* ------------------------------------------
     Save a new entry
     REPLACE THIS with your API call later:
       await fetch('/api/entries', { method: 'POST', body: JSON.stringify(entry) });
  ------------------------------------------ */
  function save(entry) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const stored = raw ? JSON.parse(raw) : [];
      stored.push(entry);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
      return true;
    } catch (err) {
      console.error('DMC_DATA.save error:', err);
      return false;
    }
  }

  /* ------------------------------------------
     Aggregate entries by calendar month
     Returns an object keyed by 'YYYY-MM'
  ------------------------------------------ */
  function byMonth(entries) {
    const map = {};
    entries.forEach(function (e) {
      const key = e.date.substring(0, 7);
      if (!map[key]) {
        map[key] = {
          income: 0, expenses: 0,
          expBreak: { sal: 0, pur: 0, rent: 0, util: 0, ben: 0, meals: 0, pcf: 0, tax: 0, sun: 0 }
        };
      }
      map[key].income   += e.income;
      map[key].expenses += e.expenses;
      if (e.expBreak) {
        Object.keys(map[key].expBreak).forEach(function (cat) {
          map[key].expBreak[cat] += (e.expBreak[cat] || 0);
        });
      }
    });
    return map;
  }

  /* ------------------------------------------
     Aggregate all expense categories across
     all entries — used for breakdown chart
  ------------------------------------------ */
  function expenseBreakdown(entries) {
    const totals = { sal: 0, pur: 0, rent: 0, util: 0, ben: 0, meals: 0, pcf: 0, tax: 0, sun: 0 };
    entries.forEach(function (e) {
      if (e.expBreak) {
        Object.keys(totals).forEach(function (cat) {
          totals[cat] += (e.expBreak[cat] || 0);
        });
      }
    });
    return totals;
  }

  /* ------------------------------------------
     YTD summary totals
  ------------------------------------------ */
  function ytdSummary(entries) {
    return entries.reduce(function (acc, e) {
      acc.income   += e.income;
      acc.expenses += e.expenses;
      return acc;
    }, { income: 0, expenses: 0 });
  }

  /* --- Public API --- */
  return {
    load:             load,
    save:             save,
    byMonth:          byMonth,
    expenseBreakdown: expenseBreakdown,
    ytdSummary:       ytdSummary
  };

})();
