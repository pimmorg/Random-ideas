/* ============================================================
   PlannerCraft — app.js
   ============================================================ */

'use strict';

// ── State ─────────────────────────────────────────────────────
const state = {
  view:      'daily',
  theme:     'rose',
  dark:      false,
  density:   'normal',
  font:      'Inter, sans-serif',
  timeFormat: '12',
  startHour: 6,
  endHour:   21,
  cursor:    new Date(),
  sections: {
    priorities: true,
    schedule:   true,
    habits:     true,
    notes:      true,
    goals:      true,
    gratitude:  false,
    water:      false,
    mood:       false,
  },
  habits: ['Exercise', 'Read', 'Meditate', 'No junk food'],
  // keyed by ISO date string → { tasks:[], notes:'', priorities:[], ... }
  dayData: {},
};

// ── Helpers ───────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const el = (tag, cls, html) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
};

function isoDate(d) {
  return d.toISOString().slice(0, 10);
}

function today() { return new Date(); }

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth()    === b.getMonth()    &&
         a.getDate()     === b.getDate();
}

function formatHour(h) {
  if (state.timeFormat === '24') return `${String(h).padStart(2,'0')}:00`;
  const ampm = h < 12 ? 'AM' : 'PM';
  const h12  = h % 12 || 12;
  return `${h12} ${ampm}`;
}

function getDayData(date) {
  const key = isoDate(date);
  if (!state.dayData[key]) {
    state.dayData[key] = {
      priorities: ['', '', ''],
      priorityDone: [false, false, false],
      schedule: {},          // hour → text
      notes: '',
      goals: ['', '', ''],
      gratitude: ['', '', ''],
      water: 0,              // 0-8
      mood: null,
      habits: {},            // habitIndex → bool
      weekTasks: [],
    };
  }
  return state.dayData[key];
}

const DAYS_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

// ── Title ─────────────────────────────────────────────────────
function updateTitle() {
  const c = state.cursor;
  let title = '';
  if (state.view === 'daily') {
    title = `${DAYS_SHORT[c.getDay()]}, ${MONTHS[c.getMonth()]} ${c.getDate()}, ${c.getFullYear()}`;
  } else if (state.view === 'weekly') {
    // week start (Sun)
    const ws = new Date(c);
    ws.setDate(ws.getDate() - ws.getDay());
    const we = new Date(ws); we.setDate(we.getDate() + 6);
    title = `${MONTHS[ws.getMonth()]} ${ws.getDate()} – ${ws.getMonth() !== we.getMonth() ? MONTHS[we.getMonth()]+' ' : ''}${we.getDate()}, ${we.getFullYear()}`;
  } else {
    title = `${MONTHS[c.getMonth()]} ${c.getFullYear()}`;
  }
  $('planner-title').textContent = title;
}

// ── Navigation ────────────────────────────────────────────────
function navigate(dir) {
  const c = state.cursor;
  if (state.view === 'daily') {
    c.setDate(c.getDate() + dir);
  } else if (state.view === 'weekly') {
    c.setDate(c.getDate() + dir * 7);
  } else {
    c.setMonth(c.getMonth() + dir);
  }
  render();
}

// ── Render dispatcher ─────────────────────────────────────────
function render() {
  updateTitle();
  const content = $('planner-content');
  content.innerHTML = '';
  if (state.view === 'daily')        renderDaily(content);
  else if (state.view === 'weekly')  renderWeekly(content);
  else                               renderMonthly(content);
}

// ── Daily view ─────────────────────────────────────────────────
function renderDaily(container) {
  const data = getDayData(state.cursor);
  const layout = el('div', 'daily-layout');
  container.appendChild(layout);

  const active = Object.entries(state.sections)
    .filter(([,v]) => v)
    .map(([k]) => k);

  for (const sec of active) {
    const card = buildSection(sec, data, state.cursor);
    if (sec === 'schedule' || sec === 'notes') {
      card.classList.add('col-full');
    }
    layout.appendChild(card);
  }
}

// ── Section builder ───────────────────────────────────────────
function buildSection(sec, data, date) {
  const card = el('div', 'planner-card');

  const icons = {
    priorities: '★', schedule: '⏱', habits: '✓',
    notes: '✏', goals: '◎', gratitude: '♥',
    water: '💧', mood: '◉',
  };
  const labels = {
    priorities: 'Top Priorities',  schedule:  'Schedule',
    habits:     'Habit Tracker',   notes:     'Notes',
    goals:      'Goals',           gratitude: 'Gratitude',
    water:      'Water Intake',    mood:      'Mood',
  };

  const title = el('div', 'card-title', `${icons[sec]} ${labels[sec]}`);
  const body  = el('div', 'card-body');
  card.append(title, body);

  switch (sec) {
    case 'priorities': buildPriorities(body, data, date); break;
    case 'schedule':   buildSchedule(body, data, date);   break;
    case 'habits':     buildHabits(body, data, date);     break;
    case 'notes':      buildNotes(body, data, date);      break;
    case 'goals':      buildGoals(body, data, date);      break;
    case 'gratitude':  buildGratitude(body, data, date);  break;
    case 'water':      buildWater(body, data, date);      break;
    case 'mood':       buildMood(body, data, date);       break;
  }
  return card;
}

function buildPriorities(body, data, date) {
  const list = el('div', 'priority-list');
  data.priorities.forEach((val, i) => {
    const row = el('div', 'priority-item');
    const num = el('div', 'priority-num', i + 1);
    const inp = el('input');
    inp.type = 'text';
    inp.className = 'priority-input';
    inp.placeholder = `Priority ${i + 1}…`;
    inp.value = val;
    inp.addEventListener('input', () => {
      data.priorities[i] = inp.value;
    });
    const chk = el('input');
    chk.type = 'checkbox';
    chk.className = 'priority-check';
    chk.checked = data.priorityDone[i];
    chk.addEventListener('change', () => {
      data.priorityDone[i] = chk.checked;
      inp.style.textDecoration = chk.checked ? 'line-through' : '';
      inp.style.opacity = chk.checked ? '.45' : '';
    });
    if (data.priorityDone[i]) {
      inp.style.textDecoration = 'line-through';
      inp.style.opacity = '.45';
    }
    row.append(num, inp, chk);
    list.appendChild(row);
  });
  body.appendChild(list);
}

function buildSchedule(body, data, date) {
  for (let h = state.startHour; h <= state.endHour; h++) {
    const row = el('div', 'time-block-row');
    const lbl = el('div', 'time-label', formatHour(h));
    const inp = el('textarea', 'time-input');
    inp.placeholder = '—';
    inp.rows = 1;
    inp.value = data.schedule[h] || '';
    inp.addEventListener('input', () => {
      data.schedule[h] = inp.value;
      inp.style.height = 'auto';
      inp.style.height = inp.scrollHeight + 'px';
    });
    if (inp.value) {
      setTimeout(() => {
        inp.style.height = 'auto';
        inp.style.height = inp.scrollHeight + 'px';
      }, 0);
    }
    row.append(lbl, inp);
    body.appendChild(row);
  }
}

function buildHabits(body, data, date) {
  if (!state.habits.length) {
    body.innerHTML = '<p style="color:var(--text-muted);font-size:12px;">No habits added yet. Add some in the sidebar!</p>';
    return;
  }
  const days = state.view === 'weekly'
    ? DAYS_SHORT
    : [DAYS_SHORT[date.getDay()]];

  const table = el('table', 'habits-table');
  const thead = el('tr');
  thead.appendChild(el('th', '', 'Habit'));
  days.forEach(d => thead.appendChild(el('th', '', d)));
  const head = el('thead');
  head.appendChild(thead);
  table.appendChild(head);

  const tbody = el('tbody');
  state.habits.forEach((habit, hi) => {
    const tr = el('tr');
    tr.appendChild(el('td', '', habit || `Habit ${hi+1}`));
    days.forEach((d, di) => {
      const td = el('td');
      const dot = el('button', 'habit-dot');
      const key = hi + '-' + di;
      if (data.habits[key]) dot.classList.add('done');
      dot.addEventListener('click', () => {
        data.habits[key] = !data.habits[key];
        dot.classList.toggle('done');
      });
      td.appendChild(dot);
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  body.appendChild(table);
}

function buildNotes(body, data, date) {
  const ta = el('textarea', 'notes-area');
  ta.placeholder = 'Write your notes here…';
  ta.value = data.notes;
  ta.addEventListener('input', () => { data.notes = ta.value; });
  body.appendChild(ta);
}

function buildGoals(body, data, date) {
  data.goals.forEach((val, i) => {
    const row = el('div', 'goal-item');
    const icon = el('span', 'goal-icon', ['🎯','⚡','🌱'][i]);
    const inp = el('input');
    inp.type = 'text';
    inp.className = 'goal-input';
    inp.placeholder = ['Long-term goal…','Short-term goal…','Today\'s focus…'][i];
    inp.value = val;
    inp.addEventListener('input', () => { data.goals[i] = inp.value; });
    row.append(icon, inp);
    body.appendChild(row);
  });
}

function buildGratitude(body, data, date) {
  data.gratitude.forEach((val, i) => {
    const row = el('div', 'gratitude-item');
    const bullet = el('span', 'gratitude-bullet', '♥');
    const inp = el('input');
    inp.type = 'text';
    inp.className = 'gratitude-input';
    inp.placeholder = `I am grateful for…`;
    inp.value = val;
    inp.addEventListener('input', () => { data.gratitude[i] = inp.value; });
    row.append(bullet, inp);
    body.appendChild(row);
  });
}

function buildWater(body, data, date) {
  const cups = el('div', 'water-cups');
  for (let i = 0; i < 8; i++) {
    const cup = el('span', 'cup' + (i < data.water ? ' filled' : ''), '💧');
    cup.title = `${i + 1} cup${i ? 's' : ''}`;
    cup.addEventListener('click', () => {
      data.water = (data.water === i + 1) ? 0 : i + 1;
      body.innerHTML = '';
      buildWater(body, data, date);
    });
    cups.appendChild(cup);
  }
  const label = el('div', '', '');
  label.style.cssText = 'font-size:11px;color:var(--text-muted);margin-top:4px;';
  label.textContent = `${data.water} / 8 cups`;
  body.append(cups, label);
}

function buildMood(body, data, date) {
  const moods = ['😄','😊','😐','😔','😢'];
  const labels = ['Great','Good','Okay','Low','Bad'];
  const opts = el('div', 'mood-options');
  moods.forEach((m, i) => {
    const btn = el('button', 'mood-btn' + (data.mood === i ? ' selected' : ''), m);
    btn.title = labels[i];
    btn.addEventListener('click', () => {
      data.mood = (data.mood === i) ? null : i;
      body.innerHTML = '';
      buildMood(body, data, date);
    });
    opts.appendChild(btn);
  });
  if (data.mood !== null && data.mood !== undefined) {
    const lbl = el('div', '');
    lbl.style.cssText = 'font-size:12px;color:var(--text-muted);margin-top:6px;';
    lbl.textContent = `Feeling: ${labels[data.mood]}`;
    body.append(opts, lbl);
  } else {
    body.appendChild(opts);
  }
}

// ── Weekly view ───────────────────────────────────────────────
function renderWeekly(container) {
  const c = state.cursor;
  const ws = new Date(c);
  ws.setDate(ws.getDate() - ws.getDay());

  const grid = el('div', 'weekly-grid');

  for (let i = 0; i < 7; i++) {
    const day = new Date(ws);
    day.setDate(ws.getDate() + i);
    const isToday = sameDay(day, today());
    const data = getDayData(day);

    const card = el('div', 'week-day-card' + (isToday ? ' today' : ''));
    const header = el('div', 'week-day-header');
    header.appendChild(el('div', 'week-day-name', DAYS_SHORT[day.getDay()]));
    header.appendChild(el('div', 'week-day-num', day.getDate()));
    card.appendChild(header);

    const taskList = el('div', 'week-task-list');

    // Ensure 5 task slots
    while (data.weekTasks.length < 5) data.weekTasks.push({ text: '', done: false });

    data.weekTasks.slice(0, 5).forEach((task, ti) => {
      const row = el('div', 'week-task-row');
      const chk = el('input');
      chk.type = 'checkbox';
      chk.className = 'week-task-check';
      chk.checked = task.done;

      const inp = el('input');
      inp.type = 'text';
      inp.className = 'week-task-input' + (task.done ? ' done' : '');
      inp.placeholder = 'Add task…';
      inp.value = task.text;

      chk.addEventListener('change', () => {
        task.done = chk.checked;
        inp.classList.toggle('done', chk.checked);
      });
      inp.addEventListener('input', () => { task.text = inp.value; });

      row.append(chk, inp);
      taskList.appendChild(row);
    });

    card.appendChild(taskList);

    // Mini habit tracker
    if (state.sections.habits && state.habits.length) {
      const hSection = el('div', '');
      hSection.style.cssText = 'padding:6px 8px;border-top:1px solid var(--border);';
      state.habits.slice(0, 4).forEach((habit, hi) => {
        const row = el('div', '');
        row.style.cssText = 'display:flex;align-items:center;gap:6px;padding:2px 0;';
        const dot = el('button', 'habit-dot');
        dot.style.cssText = 'width:14px;height:14px;flex-shrink:0;';
        const key = hi + '-0';
        if (data.habits[key]) dot.classList.add('done');
        dot.addEventListener('click', () => {
          data.habits[key] = !data.habits[key];
          dot.classList.toggle('done');
        });
        const lbl = el('span', '');
        lbl.style.cssText = 'font-size:10px;color:var(--text-muted);overflow:hidden;white-space:nowrap;text-overflow:ellipsis;';
        lbl.textContent = habit;
        row.append(dot, lbl);
        hSection.appendChild(row);
      });
      card.appendChild(hSection);
    }

    grid.appendChild(card);
  }

  container.appendChild(grid);
}

// ── Monthly view ──────────────────────────────────────────────
function renderMonthly(container) {
  const c = state.cursor;
  const year = c.getFullYear(), month = c.getMonth();

  // Day-of-week headers
  const headerRow = el('div', 'month-header-row');
  DAYS_SHORT.forEach(d => headerRow.appendChild(el('div', 'month-day-label', d)));
  container.appendChild(headerRow);

  const grid = el('div', 'monthly-grid');

  const firstDay = new Date(year, month, 1);
  const lastDay  = new Date(year, month + 1, 0);

  // Pad start
  let start = firstDay.getDay();
  for (let i = 0; i < start; i++) {
    const d = new Date(year, month, 1 - (start - i));
    grid.appendChild(makeMonthCell(d, true));
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    const day = new Date(year, month, d);
    grid.appendChild(makeMonthCell(day, false));
  }

  // Pad end
  const remaining = 7 - ((start + lastDay.getDate()) % 7);
  if (remaining < 7) {
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      grid.appendChild(makeMonthCell(d, true));
    }
  }

  container.appendChild(grid);
}

function makeMonthCell(date, otherMonth) {
  const isToday = sameDay(date, today());
  const data = getDayData(date);
  const cell = el('div', 'month-cell' + (isToday ? ' today' : '') + (otherMonth ? ' other-month' : ''));

  const num = el('div', 'month-cell-num', date.getDate());
  cell.appendChild(num);

  // Show up to 2 priorities as events
  data.priorities.filter(p => p).slice(0, 2).forEach(p => {
    const ev = el('div', 'month-event', p);
    cell.appendChild(ev);
  });

  // Click → jump to daily
  cell.addEventListener('click', () => {
    state.cursor = new Date(date);
    state.view = 'daily';
    document.querySelectorAll('#view-selector .pill').forEach(p => {
      p.classList.toggle('active', p.dataset.view === 'daily');
    });
    render();
  });

  return cell;
}

// ── Sidebar controls ──────────────────────────────────────────
function initControls() {

  // Collapse sidebar
  $('toggle-sidebar').addEventListener('click', () => {
    $('sidebar').classList.toggle('collapsed');
  });

  // View selector
  $('view-selector').addEventListener('click', e => {
    const btn = e.target.closest('.pill');
    if (!btn) return;
    state.view = btn.dataset.view;
    document.querySelectorAll('#view-selector .pill').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    $('time-range-group').style.display = state.view === 'daily' ? '' : 'none';
    render();
  });

  // Theme
  $('theme-selector').addEventListener('click', e => {
    const btn = e.target.closest('.swatch');
    if (!btn) return;
    state.theme = btn.dataset.theme;
    document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
    btn.classList.add('active');
    document.body.dataset.theme = state.theme;
  });

  // Dark mode
  $('dark-toggle').addEventListener('change', e => {
    state.dark = e.target.checked;
    document.body.classList.toggle('dark', state.dark);
  });

  // Font
  $('font-selector').addEventListener('change', e => {
    state.font = e.target.value;
    document.body.style.fontFamily = state.font;
  });

  // Density
  $('density-selector').addEventListener('click', e => {
    const btn = e.target.closest('.pill');
    if (!btn) return;
    state.density = btn.dataset.density;
    document.querySelectorAll('#density-selector .pill').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.body.dataset.density = state.density;
  });

  // Section toggles
  $('section-toggles').addEventListener('change', e => {
    const chk = e.target;
    const sec = chk.dataset.section;
    if (sec) {
      state.sections[sec] = chk.checked;
      const habitNameGroup = $('habit-names-group');
      if (sec === 'habits') habitNameGroup.style.display = chk.checked ? '' : 'none';
      render();
    }
  });

  // Time range
  $('start-hour').addEventListener('change', e => { state.startHour = +e.target.value; render(); });
  $('end-hour').addEventListener('change',   e => { state.endHour   = +e.target.value; render(); });

  // Time format
  $('time-format-selector').addEventListener('click', e => {
    const btn = e.target.closest('.pill');
    if (!btn) return;
    state.timeFormat = btn.dataset.format;
    document.querySelectorAll('#time-format-selector .pill').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    render();
  });

  // Habits
  renderHabitList();
  $('add-habit').addEventListener('click', () => {
    state.habits.push('');
    renderHabitList();
    render();
  });

  // Navigation
  $('prev-btn').addEventListener('click', () => navigate(-1));
  $('next-btn').addEventListener('click', () => navigate(1));
  $('today-btn').addEventListener('click', () => {
    state.cursor = new Date();
    render();
  });

  // Print
  $('print-btn').addEventListener('click', () => window.print());

  // Reset
  $('reset-btn').addEventListener('click', () => {
    if (!confirm('Reset all settings to defaults?')) return;
    Object.assign(state, {
      view: 'daily', theme: 'rose', dark: false,
      density: 'normal', font: 'Inter, sans-serif',
      timeFormat: '12', startHour: 6, endHour: 21,
      sections: {
        priorities: true, schedule: true, habits: true,
        notes: true, goals: true, gratitude: false,
        water: false, mood: false,
      },
      habits: ['Exercise', 'Read', 'Meditate', 'No junk food'],
    });
    applyState();
    render();
  });
}

function renderHabitList() {
  const list = $('habit-list');
  list.innerHTML = '';
  state.habits.forEach((h, i) => {
    const row = el('div', 'habit-item');
    const inp = el('input');
    inp.type = 'text';
    inp.placeholder = `Habit ${i + 1}`;
    inp.value = h;
    inp.addEventListener('input', () => {
      state.habits[i] = inp.value;
      render();
    });
    const rm = el('button', 'rm-btn', '×');
    rm.title = 'Remove';
    rm.addEventListener('click', () => {
      state.habits.splice(i, 1);
      renderHabitList();
      render();
    });
    row.append(inp, rm);
    list.appendChild(row);
  });
}

function applyState() {
  document.body.dataset.theme   = state.theme;
  document.body.dataset.density = state.density;
  document.body.classList.toggle('dark', state.dark);
  document.body.style.fontFamily = state.font;

  $('dark-toggle').checked = state.dark;
  $('font-selector').value = state.font;

  document.querySelectorAll('#view-selector .pill').forEach(p =>
    p.classList.toggle('active', p.dataset.view === state.view));
  document.querySelectorAll('#density-selector .pill').forEach(p =>
    p.classList.toggle('active', p.dataset.density === state.density));
  document.querySelectorAll('#time-format-selector .pill').forEach(p =>
    p.classList.toggle('active', p.dataset.format === state.timeFormat));
  document.querySelectorAll('.swatch').forEach(s =>
    s.classList.toggle('active', s.dataset.theme === state.theme));
  document.querySelectorAll('#section-toggles input[type=checkbox]').forEach(chk => {
    const sec = chk.dataset.section;
    if (sec) chk.checked = !!state.sections[sec];
  });

  $('start-hour').value = state.startHour;
  $('end-hour').value   = state.endHour;
  $('time-range-group').style.display = state.view === 'daily' ? '' : 'none';
  $('habit-names-group').style.display = state.sections.habits ? '' : 'none';
  renderHabitList();
}

// ── Boot ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  state.cursor = new Date();
  applyState();
  initControls();
  render();
});
