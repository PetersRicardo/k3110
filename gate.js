// Eenmalige toegangscode. Wie de code niet heeft ziet alleen een slotje.
// Let op: dit is een gordijntje, geen kluis. De code en de agenda staan nog
// gewoon in de bestanden van de (publieke) repo.
(function () {
  var SECRET = "e6e99e8e";
  var STORE = "checkoff-access";

  function get() { try { return localStorage.getItem(STORE); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(STORE, v); } catch (e) {} }

  function start() {
    ["events.js", "app.js"].reduce(function (p, src) {
      return p.then(function () {
        return new Promise(function (ok, fail) {
          var s = document.createElement("script");
          s.src = src; s.onload = ok; s.onerror = fail;
          document.body.appendChild(s);
        });
      });
    }, Promise.resolve());
  }

  function lock(wrong) {
    document.body.innerHTML =
      '<div style="margin:auto;text-align:center;max-width:320px">' +
      '<div style="font-size:5rem">🔒</div>' +
      '<h1 style="margin:.2em 0">Deze kalender is privé</h1>' +
      '<form id="g"><input id="c" autocomplete="off" autocapitalize="off" autocorrect="off" ' +
      'placeholder="toegangscode" style="font:inherit;font-size:1.3rem;padding:10px 14px;border:3px solid #e6dcc3;border-radius:14px;width:100%;text-align:center">' +
      '<button style="margin-top:12px;font:inherit;font-size:1.2rem;font-weight:800;padding:10px 24px;border:0;border-radius:14px;background:#ef476f;color:#fff">Openen</button>' +
      (wrong ? '<p style="color:#d62828;font-weight:700">Dat is niet de juiste code.</p>' : '') +
      '</form></div>';
    document.body.style.justifyContent = "center";
    document.getElementById("g").onsubmit = function (e) {
      e.preventDefault();
      var v = document.getElementById("c").value.trim();
      if (v === SECRET) { set(v); location.reload(); } else { lock(true); }
    };
  }

  // Via link: https://.../#k=CODE  (wordt direct uit de adresbalk gehaald)
  var m = /[#&]k=([^&]+)/.exec(location.hash);
  if (m && decodeURIComponent(m[1]) === SECRET) {
    set(SECRET);
    history.replaceState(null, "", location.pathname + location.search);
  }

  if (get() === SECRET) start(); else lock(false);
})();
