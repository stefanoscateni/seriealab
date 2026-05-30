// ── DATA LOADER ──────────────────────────────────────────────────────────────
const DATA = { teams: null, players: null };

async function loadData() {
  if (DATA.teams && DATA.players) return DATA;
  const [t, p] = await Promise.all([
    fetch('../data/teams.json').then(r => r.json()),
    fetch('../data/players.json').then(r => r.json())
  ]);
  DATA.teams = t.teams;
  DATA.players = p.players;
  return DATA;
}

// ── FORMATTERS ───────────────────────────────────────────────────────────────
function fmtM(v) {
  if (v >= 1) return '€' + v + 'M';
  return '€' + (v * 1000).toFixed(0) + 'K';
}

function fmtNum(v, dec = 2) {
  return Number(v).toFixed(dec);
}

function posBadge(pos) {
  const map = { FW: 'fw', MF: 'mf', DF: 'df', GK: 'gk' };
  const first = pos.split(',')[0].trim();
  const cls = map[first] || 'mf';
  return `<span class="pos-badge pos-${cls}">${first}</span>`;
}

function trendArrow(v) {
  if (v > 0.1) return `<span class="trend up">↑ ${fmtNum(v)}</span>`;
  if (v < -0.1) return `<span class="trend down">↓ ${fmtNum(Math.abs(v))}</span>`;
  return `<span class="trend neutral">→</span>`;
}

// ── SORT TABLE ────────────────────────────────────────────────────────────────
function makeSortable(tableId, data, renderFn) {
  let sortCol = null, sortDir = 1;
  const table = document.getElementById(tableId);
  if (!table) return;
  table.querySelectorAll('th[data-col]').forEach(th => {
    th.addEventListener('click', () => {
      const col = th.dataset.col;
      if (sortCol === col) sortDir *= -1;
      else { sortCol = col; sortDir = -1; }
      table.querySelectorAll('th').forEach(t => t.classList.remove('sorted'));
      th.classList.add('sorted');
      th.querySelector('.sort-icon').textContent = sortDir > 0 ? '↑' : '↓';
      const sorted = [...data].sort((a, b) => {
        const va = a[col] ?? 0, vb = b[col] ?? 0;
        return typeof va === 'string' ? va.localeCompare(vb) * sortDir : (vb - va) * sortDir;
      });
      renderFn(sorted);
    });
  });
}

// ── NAV ACTIVE LINK ───────────────────────────────────────────────────────────
function setActiveNav() {
  const path = location.pathname.split('/').pop();
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === path ||
      (path === '' && a.getAttribute('href') === 'index.html'));
  });
}

document.addEventListener('DOMContentLoaded', setActiveNav);
