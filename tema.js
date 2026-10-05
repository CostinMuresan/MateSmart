/* ============================================================
   tema.js – comutator de temă: Automat / Luminos / Întunecat
   Se aplică înainte de desenarea paginii (fără clipire) și se reține în
   browser, deci toate paginile aplicației au aceeași temă.
   Orice buton cu id="bTema" devine comutatorul.
   ============================================================ */
(function () {
  const KEY = "matematica.tema", ORD = ["auto", "light", "dark"];
  const ET = { auto: "🌓 Automat", light: "☀️ Luminos", dark: "🌙 Întunecat" };
  const get = () => { try { const v = localStorage.getItem(KEY); return ORD.includes(v) ? v : "auto"; } catch (e) { return "auto"; } };
  function apply(t) {
    const r = document.documentElement;
    if (t === "auto") r.removeAttribute("data-theme"); else r.setAttribute("data-theme", t);
    r.style.colorScheme = t === "auto" ? "light dark" : t;
  }
  function upd() {
    const b = document.getElementById("bTema"); if (!b) return;
    const t = get(); b.textContent = ET[t];
    b.setAttribute("aria-label", "Tema: " + ET[t] + ". Apasă ca să schimbi."); b.title = "Schimbă tema";
  }
  function set(t) { try { localStorage.setItem(KEY, t); } catch (e) {} apply(t); upd(); }
  apply(get());
  document.addEventListener("DOMContentLoaded", () => {
    const b = document.getElementById("bTema");
    if (b) { b.onclick = () => set(ORD[(ORD.indexOf(get()) + 1) % ORD.length]); upd(); }
  });
  window.Tema = { get, set };
})();
