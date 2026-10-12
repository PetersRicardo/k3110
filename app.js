(function () {
  const { year, months, events } = window.CALENDAR;
  const MONTH_NAMES = ["januari", "februari", "maart", "april", "mei", "juni", "juli",
                       "augustus", "september", "oktober", "november", "december"];
  const STORAGE_KEY = "checkoff-" + year;

  const MIJTER = '<svg viewBox="0 0 64 64" aria-label="mijter"><path d="M14 58 L20 22 Q32 -2 44 22 L50 58 Z" fill="#d62828" stroke="#8d0801" stroke-width="2"/><rect x="14" y="50" width="36" height="8" fill="#ffd166"/><path d="M32 14v22M24 24h16" stroke="#ffd166" stroke-width="5" stroke-linecap="round"/></svg>';

  const pad = (n) => String(n).padStart(2, "0");
  const key = (y, m, d) => `${y}-${pad(m)}-${pad(d)}`;
  const dayNumber = (s) => { const [y, m, d] = s.split("-").map(Number); return Date.UTC(y, m - 1, d) / 864e5; };
  const todayKey = () => { const t = new Date(); return key(t.getFullYear(), t.getMonth() + 1, t.getDate()); };

  // --- opslag: welke dagen zijn afgevinkt ---
  let done = {};
  try { done = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch (e) {}
  const save = () => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(done)); } catch (e) {} };

  // --- events uitrollen naar losse dagen ---
  const byDay = {};
  events.forEach((ev) => {
    const first = dayNumber(ev.start), last = dayNumber(ev.end || ev.start);
    for (let n = first; n <= last; n++) {
      const d = new Date(n * 864e5);
      byDay[key(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate())] = { ev, isFirst: n === first };
    }
  });

  function iconHtml(token) {
    if (token === "mijter") return MIJTER;
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
      const hit = byDay[k];
      const el = document.createElement("button");
      el.type = "button";
      el.className = "day" + (hit ? " has-event" : "") + (k === today ? " today" : "")
        + (k > today ? " future" : "") + (done[k] ? " done" : "");
      if (hit) el.style.setProperty("--c", hit.ev.color || "#999");
      el.innerHTML =
        `<div class="num">${d}</div>` +
        `<div class="icons">${hit ? hit.ev.icons.map(iconHtml).join("") : ""}</div>` +
        `<div class="label">${hit && hit.isFirst ? hit.ev.title : ""}</div>` +
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
    const upcoming = events
      .filter((e) => (e.end || e.start) >= today)
      .sort((a, b) => (a.start < b.start ? -1 : 1))[0];
    if (!upcoming) { box.textContent = "🎉 Alles is geweest!"; return; }
    const icon = upcoming.icons.find((i) => i !== "mijter" && !/\.\w+$/.test(i)) || "⭐";
    if (upcoming.start <= today) { box.innerHTML = `${icon} Nu bezig: <b>${upcoming.title}</b>`; return; }
    const n = dayNumber(upcoming.start) - dayNumber(today);
    box.innerHTML = n === 1
      ? `${icon} Morgen: <b>${upcoming.title}</b>!`
      : `${icon} Nog <b>${n}</b> dagen tot <b>${upcoming.title}</b>`;
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
