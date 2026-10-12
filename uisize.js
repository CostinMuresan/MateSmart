/* ============================================================
   uisize.js – mărimea uneltelor (10% – 150%), reținută pe fiecare dispozitiv
   - Setează variabilele CSS --ui (scara) și --ui-menu (scara relativă a
     butonului de meniu, care nu coboară sub 50% ca să rămână la îndemână).
   - Paginile aplică scara cu `zoom:var(--ui,1)` pe barele de unelte.
   - Orice <input type="range" id="uiRange"> și <b id="uiVal"> din pagină sunt
     legate automat; butoanele cu data-ui="75" setează direct 75%.
   - Se încarcă în <head>, ca scara să se aplice înainte de desenarea paginii.
   ============================================================ */
const UISIZE = (() => {
  const KEY = "matematica.ui.scala", MIN = .1, MAX = 1.5, FLOOR_MENU = .5;
  let z = 1;
  try { const v = parseFloat(localStorage.getItem(KEY)); if (v >= MIN && v <= MAX) z = v; } catch (e) {}
  const root = document.documentElement;
  function css() {
    root.style.setProperty("--ui", String(z));
    root.style.setProperty("--ui-menu", String(Math.max(z, FLOOR_MENU) / z));
  }
  css();
  function sync() {
    const r = document.getElementById("uiRange"), l = document.getElementById("uiVal"), p = Math.round(z * 100);
    if (r) r.value = String(p);
    if (l) l.textContent = p + "%";
    document.querySelectorAll("[data-ui]").forEach(b => b.setAttribute("aria-pressed", String(p === +b.dataset.ui)));
  }
  function set(v) {
    z = Math.min(MAX, Math.max(MIN, Math.round(v * 100) / 100));
    try { localStorage.setItem(KEY, String(z)); } catch (e) {}
    css(); sync(); window.dispatchEvent(new Event("uisize"));
  }
  /* poziționează o fereastră fixă (meniu) lângă un buton: dedesubt sau deasupra, după loc */
  function place(el, anchor) {
    const r = anchor.getBoundingClientRect(), jos = (r.top + r.bottom) / 2 < innerHeight / 2;
    el.style.position = "fixed"; el.style.left = "auto"; el.style.right = Math.max(8, Math.min(innerWidth - r.right, innerWidth - 320)) + "px";
    if (jos) { el.style.top = (r.bottom + 8) + "px"; el.style.bottom = "auto"; }
    else { el.style.bottom = (innerHeight - r.top + 8) + "px"; el.style.top = "auto"; }
    el.style.maxHeight = Math.max(160, (jos ? innerHeight - r.bottom : r.top) - 16) + "px";
  }
  function bind() {
    sync();
    const r = document.getElementById("uiRange");
    if (r) {
      r.addEventListener("input", () => { const l = document.getElementById("uiVal"); if (l) l.textContent = r.value + "%"; });   // se aplică la eliberare
      r.addEventListener("change", () => set(+r.value / 100));
    }
    document.addEventListener("click", e => { const b = e.target.closest && e.target.closest("[data-ui]"); if (b) set(+b.dataset.ui / 100); });
  }
  document.addEventListener("DOMContentLoaded", bind);
  return { get: () => z, set, place, sync, bind, MIN, MAX };
})();
