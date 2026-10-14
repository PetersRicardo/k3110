(function () {
  const { year, months, events, recurring = [] } = window.CALENDAR;
  const MONTH_NAMES = ["januari", "februari", "maart", "april", "mei", "juni", "juli",
                       "augustus", "september", "oktober", "november", "december"];
  const STORAGE_KEY = "checkoff-" + year;

  const MIJTER = '<svg viewBox="0 0 64 64" aria-label="mijter"><path d="M14 58 L20 22 Q32 -2 44 22 L50 58 Z" fill="#d62828" stroke="#8d0801" stroke-width="2"/><rect x="14" y="50" width="36" height="8" fill="#ffd166"/><path d="M32 14v22M24 24h16" stroke="#ffd166" stroke-width="5" stroke-linecap="round"/></svg>';

  // School: breed gebouw met klokkentoren en vlag (zodat het geen huisje lijkt)
  const SCHOOL_INNER = '<rect x="2" y="30" width="60" height="6" fill="#8d3b2a"/><rect x="4" y="34" width="56" height="24" fill="#e07a5f" stroke="#8d3b2a" stroke-width="2"/><rect x="24" y="12" width="16" height="20" fill="#e07a5f" stroke="#8d3b2a" stroke-width="2"/><polygon points="21,13 32,3 43,13" fill="#8d3b2a"/><circle cx="32" cy="21" r="5.5" fill="#fff" stroke="#333" stroke-width="1.5"/><path d="M32 17.5V21l3 2" fill="none" stroke="#333" stroke-width="1.5" stroke-linecap="round"/><line x1="9" y1="12" x2="9" y2="30" stroke="#555" stroke-width="2"/><polygon points="9,12 20,15.5 9,19" fill="#ffd166"/><rect x="8" y="39" width="8" height="8" fill="#ffd166" stroke="#8d3b2a" stroke-width="1.5"/><rect x="19" y="39" width="8" height="8" fill="#ffd166" stroke="#8d3b2a" stroke-width="1.5"/><rect x="37" y="39" width="8" height="8" fill="#ffd166" stroke="#8d3b2a" stroke-width="1.5"/><rect x="48" y="39" width="8" height="8" fill="#ffd166" stroke="#8d3b2a" stroke-width="1.5"/><rect x="27" y="44" width="10" height="14" fill="#5c3d2e"/>';
  const SCHOOL = `<svg viewBox="0 0 64 64" aria-label="school">${SCHOOL_INNER}</svg>`;
  const GEEN_SCHOOL = `<svg viewBox="0 0 64 64" aria-label="geen school">${SCHOOL_INNER}<circle cx="32" cy="32" r="28" fill="none" stroke="#e63946" stroke-width="7"/><line x1="12" y1="52" x2="52" y2="12" stroke="#e63946" stroke-width="7" stroke-linecap="round"/></svg>`;
  const BUILTIN = { mijter: MIJTER, geenschool: GEEN_SCHOOL, school: SCHOOL };

  const pad = (n) => String(n).padStart(2, "0");
  const key = (y, m, d) => `${y}-${pad(m)}-${pad(d)}`;
  const dayNumber = (s) => { const [y, m, d] = s.split("-").map(Number); return Date.UTC(y, m - 1, d) / 864e5; };
  const todayKey = () => { const t = new Date(); return key(t.getFullYear(), t.getMonth() + 1, t.getDate()); };

  // --- opslag: welke dagen zijn afgevinkt ---
  let done = {};
  try { done = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch (e) {}
  const save = () => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(done)); } catch (e) {} };

  // --- events uitrollen naar losse dagen ---
  // type: "regular" (klein regeltje), "holiday" (vakantie), "priority" (belangrijk).
  // Per dag bepaalt het hoogste type het uiterlijk van het vakje: priority > holiday.
  // Bij gelijk type wint het kortste event, bij gelijke lengte het latere in de lijst.
  // Regular-events komen er als klein regeltje bij, ongeacht wat het vakje verder toont.
  const RANK = { regular: 0, holiday: 1, priority: 2 };
  const typeOf = (ev) => (RANK[ev.type] !== undefined ? ev.type : "regular");
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const keyOf = (n) => { const d = new Date(n * 864e5); return key(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate()); };
  // --- terugkerende items uitrollen naar losse events ---
  // { title, weekdays: ["ma","wo"], from?, to?, except?: ["JJJJ-MM-DD"], type, icons }
  const WEEKDAYS = { zo: 0, ma: 1, di: 2, wo: 3, do: 4, vr: 5, za: 6 };
  const rangeFirst = dayNumber(key(year, months[0], 1));
  const rangeLast = Date.UTC(year, months[months.length - 1], 0) / 864e5; // laatste dag van laatste maand
  const expanded = [];
  recurring.forEach((r) => {
    const days = (r.weekdays || []).map((w) => WEEKDAYS[String(w).toLowerCase()]);
    const from = Math.max(rangeFirst, r.from ? dayNumber(r.from) : rangeFirst);
    const to = Math.min(rangeLast, r.to ? dayNumber(r.to) : rangeLast);
    const skip = new Set(r.except || []);
    for (let n = from; n <= to; n++) {
      const k = keyOf(n);
      if (days.includes(new Date(n * 864e5).getUTCDay()) && !skip.has(k)) {
        expanded.push({ title: r.title, type: r.type, icons: r.icons, color: r.color, start: k });
      }
    }
  });

  const byDay = {};
  events.concat(expanded).forEach((ev) => {
    const type = typeOf(ev);
    const first = dayNumber(ev.start), last = dayNumber(ev.end || ev.start);
    const span = last - first;
    for (let n = first; n <= last; n++) {
      const k = keyOf(n);
      const day = byDay[k] || (byDay[k] = { primary: null, regulars: [] });
      if (type === "regular") { day.regulars.push(ev); continue; }
      const p = day.primary;
      if (!p || RANK[type] > RANK[p.type] || (RANK[type] === RANK[p.type] && span <= p.span)) {
        day.primary = { ev, type, span, isFirst: n === first };
      }
    }
  });

  // klein regeltje: eerste gewone emoji als icoontje, anders een bolletje
  const regIcon = (r) => (r.icons || []).find((i) => !BUILTIN[i] && !/\.\w+$/.test(i)) || "•";

  function iconHtml(token) {
    if (BUILTIN[token]) return BUILTIN[token];
    if (/\.(png|jpe?g|svg|gif|webp)$/i.test(token)) return `<img src="${token}" alt="">`;
    return `<span>${token}</span>`;
  }

  // --- tabs + maand ---
  const tabs = document.getElementById("tabs");
  const grid = document.getElementById("grid");
  let current = (() => {
    const t = new Date();
    return t.getFullYear() === year && months.includes(t.getMonth() + 1) ? t.getMonth() + 1 : months[0];
  })();

  function renderTabs() {
    tabs.innerHTML = "";
    months.forEach((m) => {
      const b = document.createElement("button");
      b.textContent = MONTH_NAMES[m - 1];
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", String(m === current));
      b.onclick = () => { current = m; render(); };
      tabs.appendChild(b);
    });
  }

  function renderGrid() {
    grid.innerHTML = "";
    const today = todayKey();
    const offset = (new Date(year, current - 1, 1).getDay() + 6) % 7; // week begint op maandag
    const daysInMonth = new Date(year, current, 0).getDate();

    for (let i = 0; i < offset; i++) {
      const e = document.createElement("div");
      e.className = "day empty";
      grid.appendChild(e);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const k = key(year, current, d);
      const day = byDay[k];
      const p = day && day.primary;
      const el = document.createElement("button");
      el.type = "button";
      el.className = "day" + (p ? ` has-event ${p.type}` : "") + (p && p.ev.style ? ` ${p.ev.style}` : "")
        + (k === today ? " today" : "") + (k > today ? " future" : "") + (done[k] ? " done" : "");
      if (p) el.style.setProperty("--c", p.ev.color || "#999");
      // vakantie: titel op de eerste zichtbare dag van een reeks (ook na een onderbreking of maandwissel)
      const prev = byDay[keyOf(dayNumber(k) - 1)];
      const startsRun = d === 1 || !prev || !prev.primary || (p && prev.primary.ev !== p.ev);
      const showLabel = p && (p.type === "priority" || startsRun);
      el.innerHTML =
        `<div class="num">${d}</div>` +
        `<div class="icons">${p ? (p.ev.icons || []).map(iconHtml).join("") : ""}</div>` +
        `<div class="label">${showLabel ? esc(p.ev.title) : ""}</div>` +
        (day && day.regulars.length
          ? `<div class="regs">${day.regulars.map((r) => `<div class="reg">${regIcon(r)} ${esc(r.title)}</div>`).join("")}</div>`
          : "") +
        `<div class="stamp">✓</div>`;
      el.onclick = () => {
        if (k > today) { // toekomst: nog niet afvinken
          el.classList.remove("nope"); void el.offsetWidth; el.classList.add("nope");
          return;
        }
        if (done[k]) delete done[k]; else done[k] = true;
        save();
        el.classList.toggle("done", !!done[k]);
      };
      grid.appendChild(el);
    }
  }

  function renderNext() {
    const box = document.getElementById("next");
    const today = todayKey();
    const open = events.filter((e) => (e.end || e.start) >= today)
      .sort((a, b) => (a.start < b.start ? -1 : 1));
    const upcoming = open.find((e) => typeOf(e) === "priority") || open.find((e) => typeOf(e) === "holiday");
    if (!upcoming) { box.textContent = "🎉 Alles is geweest!"; return; }
    const icon = (upcoming.icons || []).find((i) => !BUILTIN[i] && !/\.\w+$/.test(i)) || "⭐";
    if (upcoming.start <= today) { box.innerHTML = `${icon} Nu bezig: <b>${esc(upcoming.title)}</b>`; return; }
    const n = dayNumber(upcoming.start) - dayNumber(today);
    box.innerHTML = n === 1
      ? `${icon} Morgen: <b>${esc(upcoming.title)}</b>!`
      : `${icon} Nog <b>${n}</b> dagen tot <b>${esc(upcoming.title)}</b>`;
  }

  function render() { renderTabs(); renderGrid(); renderNext(); }
  render();

  // vernieuw als de iPad een dag verder is
  let shownDay = todayKey();
  setInterval(() => { if (todayKey() !== shownDay) { shownDay = todayKey(); render(); } }, 60000);

  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
})();
