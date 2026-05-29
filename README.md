# DMC Financial Portal

Daily financial monitoring and entry portal for D' Mezzanine Cafe.

---

## File Structure

```
dmc-finance-portal/
│
├── index.html          — Dashboard (owner's monitoring view)
├── entry.html          — Daily Entry (manager's input form)
├── monthly.html        — Monthly summary and charts
│
├── css/
│   └── style.css       — All styling, shared across pages
│
├── js/
│   ├── data.js         — Data storage and retrieval (swap this for Google Sheets later)
│   ├── ui.js           — Shared UI components and formatting helpers
│   ├── charts.js       — All Chart.js chart logic
│   ├── dashboard.js    — Logic for index.html only
│   ├── entry.js        — Logic for entry.html only
│   └── monthly.js      — Logic for monthly.html only
│
└── README.md
```

---

## Pages

| Page | URL | Who uses it |
|------|-----|-------------|
| Dashboard | `/index.html` | Owner (Boqs) — monitor everything |
| Daily Entry | `/entry.html` | Manager — log daily income and expenses |
| Monthly View | `/monthly.html` | Owner / accountant — review summaries |

---

## How to deploy (GitHub Pages)

1. Push all files to your GitHub repo
2. Go to **Settings → Pages**
3. Set Source: **Deploy from a branch**
4. Branch: **main**, Folder: **/ (root)**
5. Click Save — your site will be live at:
   `https://[your-username].github.io/dmc-finance-portal/`

---

## How to upgrade to a real database (Phase 2)

Currently data is stored in `localStorage` — it lives in the browser it was entered on.

To make entries shared across devices, open `js/data.js` and replace the `load()` and `save()` functions with Google Sheets API calls. Nothing else needs to change.

See `js/data.js` — the comments show exactly where to make the replacement.

---

## Income channels tracked

- Cash
- GCash
- Card
- Foodpanda
- SD / C/O / GC

## Expense categories tracked

- Salaries
- Purchases
- Rental
- Utilities
- Benefits (SSS, PhilHealth, Pag-IBIG)
- Staff Meals
- PCF / Cash Advance
- Taxes & License
- Sundries

---

*Built by Boqs (James) — D' Mezzanine Cafe, 2026*
