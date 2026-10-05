/* ============================================================
   tipuri.js – câte un tip de problemă pentru fiecare metodă de rezolvare.
   Fiecare tip definește:
     campuri   – ce se completează în administrare
     nou()     – o problemă nouă, de pornire
     valideaza – verifică datele introduse
     pasi      – explicația animată, generată automat
     tabla     – tabla interactivă văzută de copii
   ============================================================ */
(function () {
  const N = v => v === null || v === undefined;
  const GC = ["var(--g1,#e4572e)", "var(--g2,#2a9d8f)", "var(--g3,#7a5cc7)", "var(--g4,#e09f1f)"];
  const ORD = ["Prima", "A doua", "A treia", "A patra"];
  const bind = (el, fn) => el.addEventListener("click", e => { const b = e.target.closest("[data-a]"); if (b && !b.disabled) fn(b.dataset.a, b); });
  const msgOk = t => `<p class="result ok">${t}</p>`;

  /* =====================================================
     1. GRUPE – încercări și totalul
     ===================================================== */
  function solve(nums, targets) {
    const res = [];
    function go(i, rest) {
      if (i === targets.length) return rest.length === 0;
      for (let a = 0; a < rest.length; a++) for (let b = a + 1; b < rest.length; b++) {
        if (rest[a] + rest[b] === targets[i]) {
          res[i] = [rest[a], rest[b]];
          if (go(i + 1, rest.filter((_, k) => k !== a && k !== b))) return true;
        }
      }
      return false;
    }
    return go(0, nums) ? res.slice() : null;
  }
  function valGrupe(p) {
    const err = [];
    if (!p.numere || p.numere.length < 2) err.push("Introduceți numerele problemei.");
    if (p.numere && new Set(p.numere).size !== p.numere.length) err.push("Numerele trebuie să fie diferite între ele.");
    if (!p.sume || !p.sume.length) err.push("Introduceți sumele grupelor.");
    else {
      if (p.sume.some(v => Number.isNaN(v))) err.push("Sumele conțin o valoare greșită.");
      if (p.sume[p.sume.length - 1] !== null) err.push("Ultima grupă trebuie să fie necunoscută: scrieți ? la final.");
      if (p.sume.slice(0, -1).some(v => v === null)) err.push("Doar ultima grupă poate fi „?”.");
      if (p.numere && p.numere.length !== 2 * p.sume.length) err.push(`Pentru ${p.sume.length} grupe sunt necesare ${2 * p.sume.length} numere (acum sunt ${p.numere.length}).`);
    }
    if (!err.length) {
      const T = sum(p.numere), K = sum(p.sume.filter(v => v !== null)), u = T - K;
      if (u <= 0) err.push("Sumele cunoscute depășesc totalul numerelor.");
      else if (!solve(p.numere.slice(), p.sume.map(v => v === null ? u : v))) err.push("Nu există nicio împărțire în grupe care să respecte aceste sume.");
    }
    return err;
  }
  function pasiGrupe(p) {
    const n = p.numere, T = sum(n), known = p.sume.filter(x => x !== null), K = sum(known), u = T - K, nG = p.sume.length, S = [];
    S.push({ text: `Avem numerele ${listRo(n)}. Trebuie să le împărțim în ${nG} grupe, câte două numere în fiecare grupă.`, viz: [n] });
    const half = n.length / 2, ps = []; let sym = n.length % 2 === 0;
    for (let i = 0; sym && i < half; i++) { ps.push([n[i], n[n.length - 1 - i]]); if (ps[i][0] + ps[i][1] !== ps[0][0] + ps[0][1]) sym = false; }
    if (sym) {
      const s0 = ps[0][0] + ps[0][1];
      S.push({ text: `Aflăm totalul, adică suma tuturor numerelor. Le adunăm pe perechi, ca să fie mai ușor: ${ps.map(([a, b]) => `${a} plus ${b} egal ${a + b}`).join(", ")}. Avem ${ps.length} perechi de câte ${s0}, adică ${ps.length} ori ${s0}, egal ${T}.`, viz: [ps.map(([a, b]) => ({ p: [a, b], e: "= " + s0 })), [String(ps.length), "×", String(s0), "=", String(T)]] });
    } else S.push({ text: `Aflăm totalul, adică suma tuturor numerelor: ${n.join(" plus ")} egal ${T}.`, viz: [[...eqRow(n, "+"), "=", String(T)]] });
    const cnt = ["", "Prima grupă", "Primele două grupe", "Primele trei grupe", "Primele patru grupe"][known.length] || "Grupele cunoscute";
    const allEq = known.length > 1 && known.every(x => x === known[0]);
    S.push({ text: `${cnt} au sumele ${listRo(known)}. Împreună: ${known.join(" plus ")} egal ${K}${allEq ? `, adică ${known.length} ori ${known[0]}` : ""}.`, viz: [[...eqRow(known, "+"), "=", String(K)]] });
    S.push({ text: `Ce a rămas pentru ultima grupă? Scădem din total: ${T} minus ${K} egal ${u}. Numărul ${T} este descăzutul, ${K} este scăzătorul, iar ${u} este diferența.`, viz: [[{ lab: T, t: "descăzut" }, "−", { lab: K, t: "scăzător" }, "=", { lab: u, t: "diferență" }]] });
    const sums = p.sume.map(x => x === null ? u : x);
    if (p.intrebare === "pereche") {
      const cand = []; for (const a of n) for (const b of n) if (a < b && a + b === u) cand.push([a, b]);
      const h2 = u / 2, bad = (u % 2 === 0 && n.includes(h2));
      S.push({ text: `Căutăm două numere diferite, dintre ${listRo(n)}, care adunate dau ${u}. ${cand.map(([a, b]) => `${a} plus ${b} egal ${u}`).join("; ")}.${bad ? ` Perechea ${h2} plus ${h2} nu merge, pentru că avem un singur ${h2}.` : ""}`, viz: [[...cand.map(([a, b]) => ({ p: [a, b], e: "= " + u, ok: true })), ...(bad ? [{ p: [h2, h2], e: "= " + u, ok: false }] : [])]] });
    } else S.push({ text: `Deci ultima grupă are suma ${u}.`, viz: [[{ lab: u, t: "suma ultimei grupe" }]] });
    const sol = solve(n.slice(), sums), L = sol ? sol[sol.length - 1] : null;
    S.push({ text: p.intrebare === "pereche" && L ? `Facem proba: ${sums.join(" plus ")} egal ${T}, adică exact totalul. Răspunsul este: ${L[0]} și ${L[1]}.` : `Facem proba: ${sums.join(" plus ")} egal ${T}, adică exact totalul. Iată o împărțire în grupe care merge.`, viz: [(sol || []).map((g, i) => ({ p: g, e: "= " + sums[i], ok: true })), [...eqRow(sums, "+"), "=", String(T)]], aplica: true });
    return S;
  }
  function tablaGrupe(p, el, api) {
    let groups = p.sume.map(() => [null, null]), pool = p.numere.slice(), sel = null, drag = null;
    const tgt = i => p.sume[i] === null ? sum(p.numere) - sum(p.sume.filter(x => x !== null)) : p.sume[i];
    const tok = (n, cls = "") => `<div class="tok ${cls}${sel === n ? " sel" : ""}" data-n="${n}" style="background:${tokColor(n)}">${n}</div>`;
    function render() {
      el.innerHTML = `<div class="pool">${pool.slice().sort((a, b) => a - b).map(n => tok(n)).join("") || `<span class="muted">Toate numerele au fost așezate</span>`}</div>
      <div class="groups">${groups.map((g, gi) => {
        const unk = p.sume[gi] === null, full = g[0] !== null && g[1] !== null, ok = full && g[0] + g[1] === tgt(gi);
        return `<div class="group" style="--gc:${GC[gi % 4]}"><h3>${ORD[gi]} grupă${unk ? "" : ` (suma ${p.sume[gi]})`}</h3>
          <div class="slots">${[0, 1].map(si => `${si ? '<span class="plus">+</span>' : ""}<div class="slot" data-g="${gi}" data-s="${si}">${g[si] !== null ? tok(g[si], "inslot") : ""}</div>`).join("")}</div>
          <div class="sum ${full ? (ok ? "ok" : "bad") : ""}">${full ? `${g[0]} + ${g[1]} = ${g[0] + g[1]} ${ok ? "✓" : "✗"}` : (unk ? '<span class="q">?</span>' : `= ${p.sume[gi]}`)}</div></div>`;
      }).join("")}</div>`;
    }
    const rm = n => { pool = pool.filter(x => x !== n); groups.forEach(g => g.forEach((x, i) => { if (x === n) g[i] = null; })); };
    function place(n, gi, si) { const prev = groups[gi][si]; rm(n); if (prev !== null && prev !== n) pool.push(prev); groups[gi][si] = n; sel = null; api.mesaj(""); render(); }
    function toPool(n) { rm(n); pool.push(n); sel = null; api.mesaj(""); render(); }
    const slotAt = (x, y) => { for (const e of document.elementsFromPoint(x, y)) { const s = e.closest && e.closest(".slot"); if (s) return s; } return null; };
    function mv(e) {
      if (!drag || e.pointerId !== drag.id) return;
      if (!drag.moved && Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) > 8) {
        drag.moved = true;
        const g = document.createElement("div"); g.className = "tok ghost"; g.textContent = drag.n; g.style.background = tokColor(drag.n);
        el.appendChild(g); drag.ghost = g; drag.el.style.opacity = ".3";
      }
      if (drag.moved) {
        drag.ghost.style.left = (e.clientX - drag.ghost.offsetWidth / 2) + "px"; drag.ghost.style.top = (e.clientY - drag.ghost.offsetHeight / 2) + "px";
        el.querySelectorAll(".slot.hover").forEach(s => s.classList.remove("hover"));
        const s = slotAt(e.clientX, e.clientY); if (s) s.classList.add("hover");
      }
    }
    function up(e) {
      window.removeEventListener("pointermove", mv);
      if (!drag) return;
      const d = drag; drag = null;
      if (d.ghost) d.ghost.remove();
      el.querySelectorAll(".slot.hover").forEach(s => s.classList.remove("hover"));
      if (d.moved) {
        const s = slotAt(e.clientX, e.clientY);
        if (s) place(d.n, +s.dataset.g, +s.dataset.s);
        else if (d.inSlot && e.type === "pointerup") toPool(d.n); else render();
      } else if (d.inSlot) toPool(d.n);
      else { sel = sel === d.n ? null : d.n; render(); }
    }
    el.addEventListener("pointerdown", e => {
      const t = e.target.closest(".tok"); if (!t) return;
      drag = { n: +t.dataset.n, el: t, inSlot: t.classList.contains("inslot"), x0: e.clientX, y0: e.clientY, moved: false, ghost: null, id: e.pointerId };
      window.addEventListener("pointermove", mv);
      window.addEventListener("pointerup", up, { once: true });
      window.addEventListener("pointercancel", up, { once: true });
    });
    el.addEventListener("click", e => { const s = e.target.closest(".slot"); if (s && sel !== null && !e.target.closest(".tok")) place(sel, +s.dataset.g, +s.dataset.s); });
    render();
    return {
      verifica() {
        if (!groups.every(g => g[0] !== null && g[1] !== null)) { api.mesaj(`<p class="result">Mai avem numere de așezat în grupe.</p>`); return; }
        const ok = groups.every((g, i) => g[0] + g[1] === tgt(i)), L = groups[groups.length - 1];
        api.mesaj(ok ? msgOk(`Bravo! Toate grupele au suma corectă. ${p.intrebare === "pereche" ? `Ultima grupă: <b>${L[0]} și ${L[1]}</b>.` : `Ultima grupă are suma <b>${tgt(groups.length - 1)}</b>.`}`) : `<p class="result bad">Mai încercăm! Uită-te la grupele marcate cu ✗.</p>`);
      },
      arataSolutia() {
        const sol = solve(p.numere.slice(), p.sume.map((_, i) => tgt(i)));
        if (sol) { groups = sol; pool = []; sel = null; render(); }
      }
    };
  }
  inregistreazaTip({
    id: "grupe", nume: "Grupe de numere (încercări și total)", metoda: "calculăm totalul", numeMetoda: "Metoda 1: calculăm totalul",
    program: ["1.4", "1.6", "5.2"],
    campuri: [
      { k: "numere", e: "Numerele de împărțit", t: "numere", a: "Separate prin virgulă, toate diferite." },
      { k: "sume", e: "Sumele grupelor", t: "sume", a: "Ultima grupă este necunoscută: scrieți ?" },
      { k: "intrebare", e: "Ce se cere?", t: "alege", o: [["pereche", "Care sunt cele două numere?"], ["suma", "Ce sumă are ultima grupă?"]] }
    ],
    nou: () => ({ numere: [1, 2, 3, 4, 5, 6], sume: [7, 9, null], intrebare: "pereche" }),
    valideaza: valGrupe, pasi: pasiGrupe, tabla: tablaGrupe
  });

  /* =====================================================
     2. CALCUL ÎN LANȚ – operații succesive
     ===================================================== */
  function calcRows(p) {
    let R = null;
    return (p.operatii || []).map(line => {
      const parts = String(line).split("|"), ex = parts[0].trim(), q = (parts[1] || "").trim();
      const v = evalExpr(ex, R), r = { ex, q, v, prev: R }; R = v; return r;
    });
  }
  function valCalcul(p) {
    if (!p.operatii || !p.operatii.length) return ["Scrieți cel puțin un calcul."];
    try {
      const rows = calcRows(p), bad = rows.findIndex(r => !Number.isInteger(r.v) || r.v < 0);
      if (bad >= 0) return [`Calculul ${bad + 1} nu dă un număr natural.`];
    } catch (e) { return ["Calcul greșit (" + e.message + "). Folosiți numere, + − × : și R pentru rezultatul rândului de mai sus."]; }
    return [];
  }
  function pasiCalcul(p) {
    const rows = calcRows(p), S = [], n = rows.length;
    S.push({ text: `Citim cu atenție problema. Ca să o rezolvăm, facem ${n === 1 ? "un calcul" : n === 2 ? "două calcule" : n + " calcule"}.`, viz: rows.map(r => [...vizExpr(r.ex, r.prev === null ? null : "▢"), "=", "?"]) });
    rows.forEach(r => S.push({ text: `${r.q ? r.q + " " : ""}Calculăm: ${spokenExpr(r.ex, r.prev)} egal ${r.v}.`, viz: [[...vizExpr(r.ex, r.prev), "=", String(r.v)]] }));
    const L = rows[n - 1];
    S.push({ text: `Răspunsul problemei este ${L.v}.`, viz: [[{ lab: L.v, t: "răspuns" }]], aplica: true });
    return S;
  }
  function tablaCalcul(p, el, api) {
    const rows = calcRows(p), open = new Set();
    function draw() {
      el.innerHTML = `<div class="calc">${rows.map((r, i) => `<div class="cc">${r.q ? `<div class="cq">${esc(r.q)}</div>` : ""}<div class="ceq">${toks(r.ex, r.prev).map(x => x.o ? `<span class="op">${SIM[x.o]}</span>` : `<span class="nm">${x.r && !open.has(i - 1) ? "▢" : x.n}</span>`).join("")}<span class="op">=</span><button class="blank${open.has(i) ? " rev" : ""}" data-a="r" data-i="${i}">${open.has(i) ? r.v : "?"}</button></div></div>`).join("")}</div>`;
    }
    bind(el, (a, b) => { const i = +b.dataset.i; open.has(i) ? open.delete(i) : open.add(i); draw(); });
    draw();
    const all = () => { rows.forEach((_, i) => open.add(i)); draw(); api.mesaj(msgOk(`Răspuns: <b>${rows[rows.length - 1].v}</b>`)); };
    return { verifica: all, arataSolutia: all };
  }
  inregistreazaTip({
    id: "calcul", nume: "Calcul în lanț (adunări și scăderi)", metoda: "calculăm pe rând", numeMetoda: "Metoda 1: calculăm pe rând",
    program: ["1.4", "1.6", "5.2"],
    campuri: [{ k: "operatii", e: "Calculele, câte unul pe rând", t: "linii", a: "Fiecare rând: operația, apoi | și întrebarea. R = rezultatul rândului de mai sus. Exemplu: R + 15 | Câte farfurii au acum?" }],
    nou: () => ({ operatii: ["1 + 7 | Câte farfurii aveau?", "R + 15 | Câte farfurii au acum?"] }),
    valideaza: valCalcul, pasi: pasiCalcul, tabla: tablaCalcul
  });

  /* =====================================================
     3. GRUPARE – adunare repetată, înmulțire, împărțire
     ===================================================== */
  const gr = p => { const g = p.grupe, k = p.inGrupa, t = p.total; return { g: N(g) ? t / k : g, k: N(k) ? t / g : k, t: N(t) ? g * k : t, unk: N(t) ? "total" : N(g) ? "grupe" : "inGrupa" }; };
  function valGrupare(p) {
    if ([p.grupe, p.inGrupa, p.total].filter(N).length !== 1) return ["Lăsați exact o valoare necunoscută (scrieți ?)."];
    if ([p.grupe, p.inGrupa, p.total].some(v => !N(v) && (!Number.isInteger(v) || v <= 0))) return ["Valorile trebuie să fie numere naturale mai mari ca 0."];
    const c = gr(p);
    if (!Number.isInteger(c.g) || !Number.isInteger(c.k)) return ["Împărțirea nu e exactă."];
    if (c.g > 12 || c.k > 12 || c.t > 60) return ["Numerele sunt prea mari pentru desen (maximum 12 grupe, 12 în grupă, 60 în total)."];
    return [];
  }
  function pasiGrupare(p) {
    const { g, k, t, unk } = gr(p), sy = p.simbol || "🔵", ob = p.obiect || "obiecte", S = [];
    const boxes = () => Array.from({ length: g }, () => ({ obj: sy, n: k }));
    if (unk === "total") {
      S.push({ text: `Avem ${g} grupe, în fiecare grupă câte ${k} ${ob}. Vrem să aflăm câte ${ob} sunt în total.`, viz: [boxes()] });
      S.push({ text: `Adunăm grupele una câte una: ${Array(g).fill(k).join(" plus ")} egal ${t}. Este o adunare repetată.`, viz: [[...eqRow(Array(g).fill(k), "+"), "=", String(t)]] });
      S.push({ text: `Putem scrie mai scurt: ${g} ori ${k} egal ${t}. Rezultatul unei înmulțiri se numește produs.`, viz: [[String(g), "×", String(k), "=", String(t)]] });
      S.push({ text: `Răspuns: în total sunt ${t} ${ob}.`, viz: [[{ lab: t, t: "în total" }]], aplica: true });
    } else if (unk === "grupe") {
      S.push({ text: `Avem ${t} ${ob}. Le punem în grupe de câte ${k}. Câte grupe se formează?`, viz: [[{ obj: sy, n: t }]] });
      const eqs = Array.from({ length: g }, (_, i) => [String(t - i * k), "−", String(k), "=", String(t - (i + 1) * k)]);
      S.push({ text: `Scoatem câte ${k}, pe rând, până nu mai rămâne nimic: ${eqs.map(r => `${r[0]} minus ${r[2]} egal ${r[4]}`).join("; ")}. Este o scădere repetată.`, viz: eqs });
      S.push({ text: `Am scos grupe de ${k} de ${g} ori. Deci se formează ${g} grupe. Proba: ${g} ori ${k} egal ${t}.`, viz: [boxes(), [String(g), "×", String(k), "=", String(t)]], aplica: true });
    } else {
      S.push({ text: `Avem ${t} ${ob}, pe care le împărțim în ${g} grupe egale. Câte ${ob} vor fi în fiecare grupă?`, viz: [[{ obj: sy, n: t }]] });
      S.push({ text: `Punem pe rând câte un obiect în fiecare grupă, până se termină. În fiecare grupă ajung ${k}.`, viz: [boxes()] });
      S.push({ text: `Proba: ${g} ori ${k} egal ${t}. Deci în fiecare grupă sunt ${k}.`, viz: [[String(g), "×", String(k), "=", String(t)]], aplica: true });
    }
    return S;
  }
  function tablaGrupare(p, el, api) {
    const { g, k, t, unk } = gr(p), sy = p.simbol || "🔵", end = unk === "inGrupa" ? k : g;
    let n = 0;
    const box = (cnt, i, act) => `<div class="gbox${cnt ? "" : " empty"}"${act ? ` data-a="fill" data-i="${i}"` : ""}>${cnt ? esc(sy).repeat(cnt) : "Atinge"}</div>`;
    function draw() {
      let h = "";
      if (unk === "total") {
        h = `<div class="gboxes">${Array.from({ length: g }, (_, i) => box(i < n ? k : 0, i, i === n)).join("")}</div>
          <div class="geq">${n ? Array(n).fill(k).join(" + ") : "Atinge o grupă ca să o umpli"}${n === g ? ` = <b>${t}</b>` : ""}</div>`;
      } else if (unk === "grupe") {
        const left = t - n * k;
        h = `<div class="tray">${left ? esc(sy).repeat(left) : "<span class='muted'>Nu a mai rămas nimic</span>"}</div>
          <div class="gboxes">${Array.from({ length: n }, () => box(k, 0, false)).join("")}</div>
          <button class="btn2" data-a="take"${left ? "" : " disabled"}>Ia câte ${k}</button>
          <div class="geq">Grupe formate: <b>${n}</b></div>`;
      } else {
        const left = t - n * g;
        h = `<div class="tray">${left ? esc(sy).repeat(left) : "<span class='muted'>Nu a mai rămas nimic</span>"}</div>
          <div class="gboxes">${Array.from({ length: g }, () => box(n, 0, false)).join("")}</div>
          <button class="btn2" data-a="step"${left ? "" : " disabled"}>Pune câte unul în fiecare grupă</button>
          <div class="geq">În fiecare grupă: <b>${n}</b></div>`;
      }
      el.innerHTML = `<div class="gr">${h}</div>`;
    }
    bind(el, a => { if (n < end) n++; api.mesaj(""); draw(); });
    draw();
    const fin = () => { n = end; draw(); api.mesaj(msgOk(unk === "total" ? `În total: <b>${t}</b>` : unk === "grupe" ? `Grupe: <b>${g}</b>` : `În fiecare grupă: <b>${k}</b>`)); };
    return { verifica: fin, arataSolutia: fin };
  }
  inregistreazaTip({
    id: "grupare", nume: "Grupare (adunare repetată, înmulțire, împărțire)", metoda: "grupăm și adunăm repetat", numeMetoda: "Metoda 1: grupăm obiectele",
    program: ["1.5", "5.2"],
    campuri: [
      { k: "grupe", e: "Numărul de grupe", t: "numar", a: "Scrieți ? la valoarea care se cere (una singură)." },
      { k: "inGrupa", e: "Câte obiecte într-o grupă", t: "numar" },
      { k: "total", e: "Total de obiecte", t: "numar" },
      { k: "obiect", e: "Cum se numesc obiectele (ex: tricouri)", t: "text" },
      { k: "simbol", e: "Desenul obiectelor", t: "alege", o: [["🔵", "🔵 cerc"], ["🍎", "🍎 mere"], ["⚽", "⚽ mingi"], ["🍬", "🍬 bomboane"], ["🎈", "🎈 baloane"], ["👕", "👕 tricouri"], ["⭐", "⭐ stele"], ["🐟", "🐟 pești"]] }
    ],
    nou: () => ({ grupe: 4, inGrupa: 2, total: null, obiect: "tricouri", simbol: "👕" }),
    valideaza: valGrupare, pasi: pasiGrupare, tabla: tablaGrupare
  });

  /* =====================================================
     4. COMPARARE cu bare (desen / schemă)
     ===================================================== */
  function cmp(p) {
    const more = p.maiMult === "B" ? "B" : "A", unk = N(p.valA) ? "A" : N(p.valB) ? "B" : "d";
    let a = p.valA, b = p.valB, d = p.dif;
    if (unk === "d") d = Math.abs(b - a);
    else if (unk === "A") a = more === "B" ? b - d : b + d;
    else b = more === "B" ? a + d : a - d;
    return { a, b, d, more, unk };
  }
  function valBare(p) {
    if ([p.valA, p.valB, p.dif].filter(N).length !== 1) return ["Lăsați exact o valoare necunoscută (scrieți ?)."];
    if ([p.valA, p.valB, p.dif].some(v => !N(v) && (!Number.isInteger(v) || v < 0))) return ["Valorile trebuie să fie numere naturale."];
    const c = cmp(p);
    if (c.a < 0 || c.b < 0) return ["Cu aceste date, una dintre cantități ar fi negativă."];
    if (c.d <= 0) return ["Diferența trebuie să fie mai mare ca 0."];
    if (c.unk === "d" && ((c.more === "B" && !(c.b > c.a)) || (c.more === "A" && !(c.a > c.b)))) return ["Valorile nu se potrivesc cu „cine are mai mult”."];
    return [];
  }
  function barsEl(p, c, rev) {
    const nA = p.numeA || "A", nB = p.numeB || "B", moreW = c.a > c.b ? "A" : "B", lessW = moreW === "A" ? "B" : "A";
    const lessV = Math.min(c.a, c.b), mk = who => {
      const name = who === "A" ? nA : nB, val = who === "A" ? c.a : c.b, hide = !rev && c.unk === who, label = `${name}: ${hide ? "?" : val}`;
      if (who === moreW) return { e: label, parts: [{ v: lessV, c: "#3f6fd1", t: !rev && c.unk === lessW ? "?" : lessV }, { v: c.d, c: "#e09f1f", t: "+" + c.d, q: !rev && c.unk === "d" }] };
      return { e: label, parts: [{ v: lessV, c: "#3f6fd1", t: hide ? "?" : lessV }] };
    };
    return { bars: [mk("A"), mk("B")] };
  }
  function pasiBare(p) {
    const c = cmp(p), nA = p.numeA || "A", nB = p.numeB || "B", u = p.unitate || "unități", S = [];
    const moreW = c.a > c.b ? "A" : "B", lessW = moreW === "A" ? "B" : "A", name = w => w === "A" ? nA : nB, val = w => w === "A" ? c.a : c.b;
    const less = Math.min(c.a, c.b), more = Math.max(c.a, c.b), d = c.d;
    let intro;
    if (c.unk === "d") intro = `${nA} are ${c.a} ${u}, iar ${nB} are ${c.b} ${u}. Aflăm cu cât are mai mult unul decât celălalt.`;
    else {
      const kw = c.unk === "A" ? "B" : "A";
      intro = `${name(kw)} are ${val(kw)} ${u}. ${name(moreW)} are ${d} ${u} în plus față de ${name(lessW)}. Câte ${u} are ${name(c.unk)}?`;
    }
    S.push({ text: intro, viz: [[barsEl(p, c, false)]] });
    if (c.unk === "d") S.push({ text: `Diferența se află scăzând: ${more} minus ${less} egal ${d}. ${more} este descăzutul, ${less} este scăzătorul, iar ${d} este diferența.`, viz: [[barsEl(p, c, true)], [{ lab: more, t: "descăzut" }, "−", { lab: less, t: "scăzător" }, "=", { lab: d, t: "diferență" }]] });
    else if (c.unk === moreW) S.push({ text: `Cine are mai mult are cât are celălalt, plus diferența. Adunăm: ${less} plus ${d} egal ${more}.`, viz: [[barsEl(p, c, true)], [String(less), "+", String(d), "=", String(more)]] });
    else S.push({ text: `Cine are mai puțin are cât are celălalt, minus diferența. Scădem: ${more} minus ${d} egal ${less}.`, viz: [[barsEl(p, c, true)], [{ lab: more, t: "descăzut" }, "−", { lab: d, t: "scăzător" }, "=", { lab: less, t: "diferență" }]] });
    S.push({ text: `Facem proba: ${less} plus ${d} egal ${more}. Se potrivește!`, viz: [[String(less), "+", String(d), "=", String(more)]], aplica: true });
    return S;
  }
  function tablaBare(p, el, api) {
    const c = cmp(p); let rev = false;
    function draw() { el.innerHTML = `<div class="cmpbox">${renderViz([[barsEl(p, c, rev)]])}<button class="btn2" data-a="r">${rev ? "Ascunde răspunsul" : "Arată răspunsul"}</button></div>`; }
    bind(el, () => { rev = !rev; draw(); });
    draw();
    const fin = () => { rev = true; draw(); api.mesaj(msgOk(`Răspuns: <b>${c.unk === "A" ? c.a : c.unk === "B" ? c.b : c.d}</b>`)); };
    return { verifica: fin, arataSolutia: fin };
  }
  inregistreazaTip({
    id: "bare", nume: "Comparare cu bare (desen / schemă)", metoda: "desenăm bare", numeMetoda: "Metoda 1: desenăm cu bare",
    program: ["1.4", "1.6", "5.2"],
    campuri: [
      { k: "numeA", e: "Prima persoană/lucru", t: "text" },
      { k: "valA", e: "Cât are prima", t: "numar", a: "Scrieți ? la valoarea care se cere (una singură)." },
      { k: "numeB", e: "A doua persoană/lucru", t: "text" },
      { k: "valB", e: "Cât are a doua", t: "numar" },
      { k: "dif", e: "Diferența (în plus)", t: "numar" },
      { k: "maiMult", e: "Cine are mai mult?", t: "alege", o: [["A", "Prima"], ["B", "A doua"]] },
      { k: "unitate", e: "Ce se numără (ex: mărgele)", t: "text" }
    ],
    nou: () => ({ numeA: "Ana", valA: 23, numeB: "Camelia", valB: null, dif: 12, maiMult: "B", unitate: "mărgele" }),
    valideaza: valBare, pasi: pasiBare, tabla: tablaBare
  });

  /* =====================================================
     5. TABEL – sortare, înregistrare, calcul pe rânduri/coloane
     ===================================================== */
  const numCell = s => /^-?\d+$/.test(s) ? +s : NaN;
  function tabelData(p) {
    const h = String(p.antet || "").split(";").map(s => s.trim()).filter(Boolean);
    const rows = (p.randuri || []).map(l => String(l).split(";").map(s => s.trim()));
    const mode = p.totaluri || "niciunul", comp = [];  // comp: {r,c,v}
    const g = { h: h.slice(), rows: rows.map(r => r.slice()), mode, comp, vals: [] };
    if (mode === "suma-rand") {
      g.h.push("Total");
      rows.forEach((r, i) => { const v = sum(r.slice(1).map(numCell)); g.rows[i].push(String(v)); comp.push({ r: i, c: h.length, v }); });
    } else if (mode === "suma-coloana") {
      const last = rows.length, row = ["Total"];
      for (let c = 1; c < h.length; c++) { const v = sum(rows.map(r => numCell(r[c]))); row.push(String(v)); comp.push({ r: last, c, v }); }
      g.rows.push(row);
    } else if (mode === "produs") {
      g.h.push("Total");
      let T = 0;
      rows.forEach((r, i) => { const v = numCell(r[1]) * numCell(r[2]); T += v; g.rows[i].push(String(v)); comp.push({ r: i, c: h.length, v }); });
      const last = rows.length, row = ["Total"]; for (let c = 1; c <= h.length; c++) row.push("");
      row[h.length] = String(T); g.rows.push(row); comp.push({ r: last, c: h.length, v: T });
      g.T = T;
    }
    return g;
  }
  function valTabel(p) {
    const h = String(p.antet || "").split(";").map(s => s.trim()).filter(Boolean);
    if (h.length < 2) return ["Antetul are nevoie de cel puțin 2 coloane, separate prin ;"];
    if (!p.randuri || !p.randuri.length) return ["Adăugați cel puțin un rând."];
    const rows = p.randuri.map(l => String(l).split(";").map(s => s.trim()));
    if (rows.some(r => r.length !== h.length)) return [`Fiecare rând trebuie să aibă ${h.length} celule, separate prin ;`];
    if ((p.totaluri || "niciunul") !== "niciunul" && rows.some(r => r.slice(1).some(c => Number.isNaN(numCell(c))))) return ["Pentru calcule, toate celulele (în afară de prima coloană) trebuie să fie numere."];
    if (p.totaluri === "produs" && h.length < 3) return ["Pentru produs sunt necesare cel puțin 3 coloane."];
    return [];
  }
  const tabViz = (g, show) => ({ tab: { h: g.h, r: g.rows.map((row, r) => row.map((c, ci) => { const k = g.comp.find(x => x.r === r && x.c === ci); return k ? (show ? { v: c, hl: true } : { v: "", q: true }) : c; })) } });
  function pasiTabel(p) {
    const g = tabelData(p), S = [], rows = g.rows, nr = (p.randuri || []).length;
    S.push({ text: `Citim tabelul cu atenție. Are ${g.h.length - (g.mode === "suma-rand" || g.mode === "produs" ? 1 : 0)} coloane și ${nr} rânduri.`, viz: [[tabViz({ ...g, comp: [] }, false)]] });
    if (g.mode === "niciunul") S.push({ text: "Folosim datele din tabel ca să răspundem la întrebare.", viz: [[tabViz(g, true)]], aplica: true });
    else if (g.mode === "suma-rand") S.push({ text: `Adunăm pe fiecare rând: ${rows.map(r => `${r[0]}: ${r.slice(1, -1).join(" plus ")} egal ${r[r.length - 1]}`).join("; ")}.`, viz: [[tabViz(g, true)]], aplica: true });
    else if (g.mode === "suma-coloana") S.push({ text: `Adunăm fiecare coloană: ${g.h.slice(1).map((c, i) => `${c}: ${rows.slice(0, -1).map(r => r[i + 1]).join(" plus ")} egal ${rows[rows.length - 1][i + 1]}`).join("; ")}.`, viz: [[tabViz(g, true)]], aplica: true });
    else {
      const prods = rows.slice(0, -1).map(r => r[r.length - 1]);
      S.push({ text: `Pe fiecare rând înmulțim: ${rows.slice(0, -1).map(r => `${r[0]}: ${r[1]} ori ${r[2]} egal ${r[r.length - 1]}`).join("; ")}.`, viz: [[tabViz({ ...g, comp: g.comp.filter(x => x.r < nr) }, true)]] });
      S.push({ text: `Adunăm rezultatele: ${prods.join(" plus ")} egal ${g.T}.`, viz: [[tabViz(g, true)], [...eqRow(prods, "+"), "=", String(g.T)]], aplica: true });
    }
    return S;
  }
  function tablaTabel(p, el, api) {
    const g = tabelData(p), open = new Set();
    function draw() {
      el.innerHTML = `<div class="tb"><table><thead><tr>${g.h.map(c => `<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>${g.rows.map((row, r) => `<tr>${row.map((c, ci) => { const k = g.comp.find(x => x.r === r && x.c === ci); if (!k) return `<td>${esc(c)}</td>`; const key = r + "," + ci; return `<td><button class="blank${open.has(key) ? " rev" : ""}" data-a="c" data-k="${key}">${open.has(key) ? esc(c) : "?"}</button></td>`; }).join("")}</tr>`).join("")}</tbody></table></div>`;
    }
    bind(el, (a, b) => { const k = b.dataset.k; open.has(k) ? open.delete(k) : open.add(k); draw(); });
    draw();
    const fin = () => { g.comp.forEach(x => open.add(x.r + "," + x.c)); draw(); if (g.T !== undefined) api.mesaj(msgOk(`Total: <b>${g.T}</b>`)); };
    return { verifica: fin, arataSolutia: fin };
  }
  inregistreazaTip({
    id: "tabel", nume: "Tabel (organizarea datelor)", metoda: "organizăm datele în tabel", numeMetoda: "Metoda 1: citim și calculăm din tabel",
    program: ["5.1", "5.2", "1.5"],
    campuri: [
      { k: "antet", e: "Antetul tabelului", t: "text", a: "Coloanele separate prin ; Exemplu: Ființe; Câte sunt; Picioare" },
      { k: "randuri", e: "Rândurile tabelului", t: "linii", a: "Un rând pe linie, celulele separate prin ; Exemplu: Oameni; 4; 2" },
      { k: "totaluri", e: "Ce calculăm", t: "alege", o: [["niciunul", "Nimic (doar afișăm tabelul)"], ["suma-rand", "Suma pe fiecare rând"], ["suma-coloana", "Suma pe fiecare coloană"], ["produs", "Înmulțim coloanele 2 și 3, apoi adunăm"]] }
    ],
    nou: () => ({ antet: "Ființe; Câte sunt; Picioare la fiecare", randuri: ["Oameni; 4; 2", "Papagal; 1; 2", "Iepuraș; 1; 4", "Căței; 2; 4"], totaluri: "produs" }),
    valideaza: valTabel, pasi: pasiTabel, tabla: tablaTabel
  });

  /* =====================================================
     6. ȘIR – regularități
     ===================================================== */
  const dlt = x => (x >= 0 ? "+" : "−") + Math.abs(x);
  function sirComplet(p) {
    const a = p.sir || [], n = a.length; if (n < 4 || !a.some(N)) return null;
    const fit = f => f.every((v, i) => N(a[i]) || a[i] === v);
    if (p.regula === "suma2" || p.regula === "suma3") {
      const k = p.regula === "suma2" ? 2 : 3, f = a.slice();
      for (let i = k; i < n; i++) {
        const prev = f.slice(i - k, i);
        if (prev.some(N)) { if (N(f[i])) return null; continue; }
        const s = sum(prev); if (N(f[i])) f[i] = s; else if (f[i] !== s) return null;
      }
      return f.some(N) ? null : { full: f, tip: "suma", k };
    }
    const first = a.findIndex(x => !N(x)), nk = a.filter(x => !N(x)).length;
    if (nk >= 2) for (let d = -60; d <= 60; d++) { if (!d) continue; const f = a.map((_, i) => a[first] + (i - first) * d); if (f.every(v => v >= 0) && fit(f)) return { full: f, tip: "dif", d }; }
    if (nk >= 2) for (let r = 2; r <= 10; r++) {
      const f = a.map((_, i) => { const e = i - first; if (e >= 0) return a[first] * r ** e; const dv = a[first] / r ** (-e); return Number.isInteger(dv) ? dv : NaN; });
      if (f.every(Number.isFinite) && fit(f)) return { full: f, tip: "raport", r };
    }
    if (nk >= 3) for (let c = -10; c <= 10; c++) { if (!c) continue; for (let d0 = -60; d0 <= 60; d0++) {
      const f = a.map((_, i) => a[first] + (i - first) * d0 + c * (i * (i - 1) / 2 - first * (first - 1) / 2));
      if (f.every(v => v >= 0) && fit(f)) return { full: f, tip: "dif2", d0, c };
    } }
    return null;
  }
  const arcsOf = (r, n) => Array.from({ length: n - 1 }, (_, i) => r.tip === "dif" ? dlt(r.d) : r.tip === "raport" ? "×" + r.r : r.tip === "dif2" ? dlt(r.d0 + r.c * i) : "");
  function regulaText(r) {
    if (r.tip === "dif") return `Din fiecare număr la următorul ${r.d > 0 ? "adăugăm" : "scădem"} ${Math.abs(r.d)}.`;
    if (r.tip === "raport") return `Fiecare număr se înmulțește cu ${r.r}.`;
    if (r.tip === "dif2") return `Diferențele dintre numere sunt ${listRo(r.full.slice(1).map((v, i) => String(Math.abs(v - r.full[i]))))}: ${r.c > 0 ? "cresc" : "scad"} cu ${Math.abs(r.c)} de fiecare dată.`;
    return `Fiecare număr este suma celor ${r.k === 2 ? "două" : "trei"} numere dinaintea lui.`;
  }
  function valSir(p) {
    if (!p.sir || p.sir.length < 4) return ["Șirul trebuie să aibă cel puțin 4 termeni."];
    if (p.sir.some(v => Number.isNaN(v))) return ["Șirul conține o valoare greșită (folosiți numere și ?)."];
    if (!p.sir.some(N)) return ["Lăsați cel puțin un termen necunoscut (scrieți ?)."];
    if (!sirComplet(p)) return ["Nu se găsește nicio regulă potrivită. Încercați alt tip de regulă sau mai mulți termeni cunoscuți."];
    return [];
  }
  function pasiSir(p) {
    const r = sirComplet(p), a = p.sir, S = [], n = a.length, miss = a.map((v, i) => N(v) ? i : -1).filter(i => i >= 0);
    S.push({ text: `Avem un șir de numere, în care ${miss.length === 1 ? "un număr lipsește" : "lipsesc " + miss.length + " numere"}. Căutăm regula șirului.`, viz: [[{ seq: { t: a } }]] });
    if (r.tip === "suma") {
      let i = r.k; while (i < n && (N(a[i]) || a.slice(i - r.k, i).some(N))) i++;
      const terms = a.slice(i - r.k, i);
      S.push({ text: `${regulaText(r)} De exemplu: ${terms.join(" plus ")} egal ${a[i]}.`, viz: [[...eqRow(terms, "+"), "=", String(a[i])]] });
    } else {
      const arcs = arcsOf(r, n).map((x, i) => (N(a[i]) || N(a[i + 1])) ? "?" : x);
      S.push({ text: regulaText(r), viz: [[{ seq: { t: a, arcs } }]] });
    }
    S.push({ text: `Folosim regula și aflăm ${miss.length === 1 ? "numărul lipsă" : "numerele lipsă"}: ${listRo(miss.map(i => String(r.full[i])))}.`, viz: [[{ seq: { t: r.full, hl: miss, arcs: arcsOf(r, n) } }]], aplica: true });
    const i = miss[0];
    if (i + 1 < n) {
      let t, row;
      if (r.tip === "suma") { const tt = r.full.slice(i + 1 - r.k, i + 1); if (i + 1 - r.k >= 0) { t = `${tt.join(" plus ")} egal ${r.full[i + 1]}`; row = [...eqRow(tt, "+"), "=", String(r.full[i + 1])]; } }
      else if (r.tip === "raport") { t = `${r.full[i]} ori ${r.r} egal ${r.full[i + 1]}`; row = [String(r.full[i]), "×", String(r.r), "=", String(r.full[i + 1])]; }
      else { const dd = r.tip === "dif" ? r.d : r.d0 + r.c * i; t = `${r.full[i]} ${dd >= 0 ? "plus" : "minus"} ${Math.abs(dd)} egal ${r.full[i + 1]}`; row = [String(r.full[i]), dd >= 0 ? "+" : "−", String(Math.abs(dd)), "=", String(r.full[i + 1])]; }
      if (t) S.push({ text: `Facem proba: ${t}. Se potrivește!`, viz: [row] });
    }
    return S;
  }
  function tablaSir(p, el, api) {
    const r = sirComplet(p), a = p.sir, n = a.length, arcs = arcsOf(r, n); const op = { termen: false, regula: false };
    function draw() {
      el.innerHTML = `<div class="sqw"><div class="sq">${a.map((v, i) => `${i ? `<span class="sa"><small>${op.regula ? esc(arcs[i - 1]) : ""}</small>→</span>` : ""}<span class="sb${N(v) ? (op.termen ? " rev" : " q") : ""}">${N(v) ? (op.termen ? r.full[i] : "?") : v}</span>`).join("")}</div>
        ${op.regula ? `<div class="rule">${esc(regulaText(r))}</div>` : ""}
        <div class="btns"><button class="btn2" data-a="regula">${op.regula ? "Ascunde regula" : "Care este regula?"}</button><button class="btn2" data-a="termen">${op.termen ? "Ascunde numărul" : "Arată numărul lipsă"}</button></div></div>`;
    }
    bind(el, a2 => { op[a2] = !op[a2]; draw(); });
    draw();
    const fin = () => { op.termen = true; op.regula = true; draw(); const miss = a.map((v, i) => N(v) ? r.full[i] : null).filter(x => x !== null); api.mesaj(msgOk(`Număr lipsă: <b>${miss.join(", ")}</b>`)); };
    return { verifica: fin, arataSolutia: fin };
  }
  inregistreazaTip({
    id: "sir", nume: "Șir de numere (regularități)", metoda: "căutăm regula șirului", numeMetoda: "Metoda 1: descoperim regula",
    program: ["3.1"],
    campuri: [
      { k: "sir", e: "Șirul de numere", t: "sume", a: "Separate prin virgulă; scrieți ? la termenul care lipsește. Exemplu: 3, 4, 5, 12, 21, ?, 71, 130" },
      { k: "regula", e: "Regula", t: "alege", o: [["auto", "Descoperă singură (adaug același număr, înmulțesc, diferențe care cresc)"], ["suma2", "Fiecare număr = suma celor 2 dinainte"], ["suma3", "Fiecare număr = suma celor 3 dinainte"]] }
    ],
    nou: () => ({ sir: [3, 4, 5, 12, 21, null, 71, 130], regula: "suma3" }),
    valideaza: valSir, pasi: pasiSir, tabla: tablaSir
  });

  /* =====================================================
     7. MERS INVERS – de la rezultat spre început
     ===================================================== */
  const INV = { "+": "-", "-": "+", "*": "/", "/": "*" };
  const VPREZ = { "+": "adăugăm", "-": "scădem", "*": "înmulțim cu", "/": "împărțim la" };
  function parseOps(p) {
    return (p.operatii || []).map(l => {
      const m = /^\s*([+\-−–×x*:÷\/])\s*(\d+)\s*$/.exec(l);
      if (!m) throw new Error(`„${l}” nu este o operație (exemple: -25, +12, ×2, :3)`);
      return { o: normOp(m[1]), n: +m[2] };
    });
  }
  function inv(p) {
    const ops = parseOps(p), n = ops.length, vals = Array(n + 1); vals[n] = p.rezultat;
    for (let i = n - 1; i >= 0; i--) {
      const { o, n: k } = ops[i], v = vals[i + 1]; let x;
      if (o === "+") x = v - k; else if (o === "-") x = v + k;
      else if (o === "*") { if (k === 0 || v % k) throw new Error("împărțire inexactă la mersul invers"); x = v / k; }
      else x = v * k;
      if (!Number.isInteger(x) || x < 0) throw new Error("numărul gândit nu este natural");
      vals[i] = x;
    }
    return { ops, vals };
  }
  function valInvers(p) {
    if (!p.operatii || !p.operatii.length) return ["Scrieți cel puțin o operație."];
    if (!Number.isInteger(p.rezultat) || p.rezultat < 0) return ["Rezultatul trebuie să fie un număr natural."];
    try { inv(p); } catch (e) { return ["Problemă: " + e.message + "."]; }
    return [];
  }
  function pasiInvers(p) {
    const { ops, vals } = inv(p), n = ops.length, S = [];
    const chain = [{ lab: "?", t: "număr gândit" }]; ops.forEach((x, i) => { chain.push({ arr: SIM[x.o] + " " + x.n }); chain.push(i === n - 1 ? { lab: vals[n], t: "rezultat" } : { lab: "?", t: "" }); });
    S.push({ text: `Pornim de la un număr necunoscut. Cu el facem pe rând: ${ops.map(x => `${VPREZ[x.o]} ${x.n}`).join(", apoi ")}. La sfârșit obținem ${vals[n]}. Care a fost numărul?`, viz: [chain] });
    for (let j = 0; j < n; j++) {
      const i = n - 1 - j, { o, n: k } = ops[i];
      S.push({ text: `${j === 0 ? "Mergem invers, de la rezultat spre început. " : ""}Pasul ${i + 1} a fost „${VPREZ[o]} ${k}”. Ne întoarcem cu operația opusă: ${vals[i + 1]} ${CUV[INV[o]]} ${k} egal ${vals[i]}.`, viz: [[String(vals[i + 1]), SIM[INV[o]], String(k), "=", String(vals[i])]] });
    }
    S.push({ text: `Numărul gândit este ${vals[0]}. Facem proba, de la început: ${ops.map((x, i) => `${vals[i]} ${CUV[x.o]} ${x.n} egal ${vals[i + 1]}`).join("; ")}.`, viz: ops.map((x, i) => [String(vals[i]), SIM[x.o], String(x.n), "=", String(vals[i + 1])]), aplica: true });
    return S;
  }
  function tablaInvers(p, el, api) {
    const { ops, vals } = inv(p), n = ops.length; let r = 0;
    const shown = i => i === n || i >= n - r;
    function draw() {
      el.innerHTML = `<div class="iw"><div class="ich">${vals.map((v, i) => `${i ? `<span class="ia"><small>${SIM[ops[i - 1].o]} ${ops[i - 1].n}</small>→</span>` : ""}<span class="ib${shown(i) ? " rev" : ""}">${shown(i) ? v : "?"}</span>`).join("")}</div>
        <div class="irv">${ops.map((_, j) => { const i = n - 1 - j, o = ops[i]; return `<button class="btn2" data-a="s" data-j="${j}"${j !== r ? " disabled" : ""}>${j < r ? `${vals[i + 1]} ${SIM[INV[o.o]]} ${o.n} = ${vals[i]}` : `${vals[i + 1]} ${SIM[INV[o.o]]} ${o.n} = ?`}</button>`; }).join("")}</div></div>`;
    }
    bind(el, () => { if (r < n) r++; api.mesaj(""); draw(); });
    draw();
    const fin = () => { r = n; draw(); api.mesaj(msgOk(`Numărul gândit: <b>${vals[0]}</b>`)); };
    return { verifica: fin, arataSolutia: fin };
  }
  inregistreazaTip({
    id: "invers", nume: "Mers invers (de la rezultat spre început)", metoda: "mergem invers", numeMetoda: "Metoda 1: mergem invers",
    program: ["1.4", "1.6", "5.2"],
    campuri: [
      { k: "operatii", e: "Operațiile făcute cu numărul gândit, în ordine", t: "linii", a: "Câte una pe linie. Exemple: -25   +12   ×2   :3" },
      { k: "rezultat", e: "Rezultatul final", t: "numar" }
    ],
    nou: () => ({ operatii: ["-25", "+12", "-16"], rezultat: 20 }),
    valideaza: valInvers, pasi: pasiInvers, tabla: tablaInvers
  });

  /* =====================================================
     8. BALANȚĂ – egalități cu litere
     ===================================================== */
  const parseTerms = s => String(s).split("+").map(t => t.trim()).filter(Boolean).map(t => /^\d+$/.test(t) ? { n: +t } : /^[a-zA-Z]$/.test(t) ? { l: t } : null);
  function parseEc(line) {
    const parts = String(line).split("=");
    if (parts.length !== 2) throw new Error(`„${line}” trebuie să aibă un singur =`);
    const lt = parseTerms(parts[0]), rt = parseTerms(parts[1]);
    if (!lt.length || lt.includes(null) || !rt.length || rt.includes(null)) throw new Error(`„${line}” conține ceva ce nu pot citi (folosiți litere, numere și +)`);
    if (rt.some(x => x.l)) throw new Error(`În „${line}”, partea dreaptă trebuie să fie un număr`);
    return { lt, R: sum(rt.map(x => x.n)) };
  }
  function rezBalanta(p) {
    const eqs = (p.ecuatii || []).map(parseEc), vals = {}, steps = [], done = new Set();
    let prog = true;
    while (prog && done.size < eqs.length) {
      prog = false;
      eqs.forEach((e, i) => {
        if (done.has(i)) return;
        const un = [...new Set(e.lt.filter(t => t.l && !(t.l in vals)).map(t => t.l))];
        if (un.length !== 1) return;
        const L = un[0], k = e.lt.filter(t => t.l === L).length, subst = [...new Set(e.lt.filter(t => t.l && t.l in vals).map(t => t.l))];
        const m = sum(e.lt.map(t => t.n !== undefined ? t.n : (t.l !== L ? vals[t.l] : 0))), R2 = e.R - m;
        if (R2 < 0 || R2 % k) throw new Error(`Ecuația ${i + 1} nu are soluție printre numerele naturale`);
        vals[L] = R2 / k; steps.push({ i, L, k, m, R: e.R, R2, x: vals[L], subst, e }); done.add(i); prog = true;
      });
    }
    if (done.size < eqs.length) throw new Error("Nu pot afla toate literele. Fiecare ecuație trebuie să aibă o singură literă necunoscută, după ce le înlocuim pe cele deja aflate");
    const ex = parseTerms(p.expresie || "");
    if (!ex.length || ex.includes(null)) throw new Error("Scrieți expresia cerută, de exemplu a + b + c");
    ex.forEach(t => { if (t.l && !(t.l in vals)) throw new Error(`Litera ${t.l} din expresie nu are valoare`); });
    return { eqs, vals, steps, ex, total: sum(ex.map(t => t.n !== undefined ? t.n : vals[t.l])) };
  }
  function valBalanta(p) {
    if (!p.ecuatii || !p.ecuatii.length) return ["Scrieți cel puțin o ecuație."];
    try { rezBalanta(p); } catch (e) { return [e.message + "."]; }
    return [];
  }
  const balEl = (lt, R) => ({ bal: { st: lt.map(t => t.l ?? t.n), dr: [R] } });
  function pasiBalanta(p) {
    const { vals, steps, ex, total } = rezBalanta(p), S = [];
    steps.forEach(s => {
      const subLt = s.e.lt.map(t => t.l && t.l in vals && t.l !== s.L ? { n: vals[t.l] } : t);
      const descr = s.e.lt.map(t => t.l ?? t.n).join(" plus ");
      const rows = [[balEl(s.e.lt, s.R)]];
      if (s.subst.length) rows.push(["înlocuim", balEl(subLt, s.R)]);
      S.push({ text: `Pe un taler avem ${descr}, iar pe celălalt taler ${s.R}. Balanța este în echilibru.${s.subst.length ? ` Știm deja ${s.subst.map(l => `${l} egal ${vals[l]}`).join(", ")}, deci înlocuim.` : ""}`, viz: rows });
      if (s.m > 0) S.push({ text: `Luăm ${s.m} de pe fiecare taler, ca balanța să rămână în echilibru: ${s.R} minus ${s.m} egal ${s.R2}.`, viz: [[{ bal: { st: Array(s.k).fill(s.L), dr: [s.R2] } }], [String(s.R), "−", String(s.m), "=", String(s.R2)]] });
      if (s.k > 1) S.push({ text: `${s.k} de ${s.L} înseamnă ${s.R2}. Împărțim în ${s.k} părți egale: ${s.R2} împărțit la ${s.k} egal ${s.x}. Deci ${s.L} este ${s.x}.`, viz: [[String(s.k), "×", { v: s.L }, "=", String(s.R2)], [{ v: s.L }, "=", String(s.R2), ":", String(s.k), "=", String(s.x)]] });
      else S.push({ text: `Deci ${s.L} este ${s.x}.`, viz: [[{ v: s.L }, "=", String(s.x)]] });
    });
    const first = [], second = [];
    ex.forEach((t, i) => { if (i) { first.push("+"); second.push("+"); } first.push(t.l ? { v: t.l } : String(t.n)); second.push(String(t.l ? vals[t.l] : t.n)); });
    S.push({ text: `Acum calculăm expresia: ${ex.map(t => t.l ?? t.n).join(" plus ")} înseamnă ${ex.map(t => t.l ? vals[t.l] : t.n).join(" plus ")}, egal ${total}.`, viz: [[...first, "=", ...second, "=", String(total)]], aplica: true });
    return S;
  }
  function tablaBalanta(p, el, api) {
    const R = rezBalanta(p), open = new Set(); let fin = false;
    function draw() {
      el.innerHTML = `<div class="bq">${R.eqs.map((e, i) => { const st = R.steps.find(s => s.i === i); return `<div class="bcard">${renderViz([[balEl(e.lt, e.R)]])}<button class="btn2" data-a="v" data-l="${st.L}">${st.L} = ${open.has(st.L) ? st.x : "?"}</button></div>`; }).join("")}
        <div class="bcard"><div class="bex">${R.ex.map(t => t.l ?? t.n).join(" + ")} = </div><button class="btn2" data-a="f">${fin ? R.total : "?"}</button></div></div>`;
    }
    bind(el, (a, b) => { if (a === "v") { const l = b.dataset.l; open.has(l) ? open.delete(l) : open.add(l); } else fin = !fin; draw(); });
    draw();
    const all = () => { Object.keys(R.vals).forEach(l => open.add(l)); fin = true; draw(); api.mesaj(msgOk(`${R.ex.map(t => t.l ?? t.n).join(" + ")} = <b>${R.total}</b>`)); };
    return { verifica: all, arataSolutia: all };
  }
  inregistreazaTip({
    id: "balanta", nume: "Balanță (egalități cu litere)", metoda: "folosim balanța", numeMetoda: "Metoda 1: folosim balanța",
    program: ["1.6", "5.2"],
    campuri: [
      { k: "ecuatii", e: "Egalitățile, câte una pe linie", t: "linii", a: "Exemplu: a + a = 8   sau   c + c + 1 = 5. Fiecare egalitate trebuie să aibă o singură literă necunoscută (după ce le înlocuim pe cele aflate)." },
      { k: "expresie", e: "Ce se cere să calculăm", t: "text", a: "Exemplu: a + b + c" }
    ],
    nou: () => ({ ecuatii: ["a + a = 8", "b + b + b = 9", "c + c + 1 = 5"], expresie: "a + b + c" }),
    valideaza: valBalanta, pasi: pasiBalanta, tabla: tablaBalanta
  });

  /* =====================================================
     Stilurile tablei (dimensiunea se reglează cu --s pe .tabla)
     ===================================================== */
  const STIL = `
.muted{color:var(--muted,#52638a);font-size:${S(.8)}}
.pool{display:flex;flex-wrap:wrap;gap:${S(.6)};justify-content:center;align-items:center;min-height:${S(4.2)};padding:${S(.4)};border:${S(.12)} dashed var(--line,#b9cde4);border-radius:${S(.8)}}
.tok{width:${S(3.4)};height:${S(3.4)};border-radius:50%;display:grid;place-items:center;font:800 ${S(1.8)}/1 var(--font,sans-serif);color:#fff;background:#3f6fd1;cursor:grab;touch-action:none;border:${S(.15)} solid rgba(0,0,0,.22);box-shadow:0 ${S(.2)} 0 rgba(0,0,0,.25);transition:transform .12s;user-select:none}
.tok.sel{transform:translateY(-6px) scale(1.1);outline:${S(.2)} solid #ffd447;outline-offset:2px}
.tok.ghost{position:fixed;z-index:50;pointer-events:none;transform:scale(1.15);box-shadow:0 14px 20px rgba(0,0,0,.3)}
.tok.inslot{width:${S(3.8)};height:${S(3.8)};font-size:${S(2)};box-shadow:none}
.groups{display:flex;flex-wrap:wrap;gap:${S(.8)};justify-content:center;margin-top:${S(.6)}}
.group{background:var(--panel,#fff);border:${S(.17)} solid var(--gc);border-radius:${S(.9)};padding:${S(.5)} ${S(.7)} ${S(.6)};display:flex;flex-direction:column;align-items:center;gap:${S(.35)};min-width:${S(11)}}
.group h3{margin:0;font:800 ${S(1.05)}/1.1 var(--font,sans-serif);color:var(--gc)}
.slots{display:flex;align-items:center;gap:${S(.45)}}
.plus{font:800 ${S(1.8)}/1 var(--font,sans-serif);color:var(--muted,#52638a)}
.slot{width:${S(4.2)};height:${S(4.2)};border-radius:50%;border:${S(.17)} dashed var(--gc);display:grid;place-items:center;cursor:pointer}
.slot.hover{background:rgba(255,212,71,.35)}
.sum{font:800 ${S(1.5)}/1 var(--font,sans-serif);min-height:${S(2.1)};display:flex;align-items:center;padding:${S(.1)} ${S(.7)};border-radius:${S(.5)};background:var(--paper,#f6fbff);border:${S(.12)} solid var(--line,#b9cde4)}
.sum.ok{border-color:var(--ok,#1f9d55);color:var(--ok,#1f9d55)} .sum.bad{border-color:var(--bad,#d64545);color:var(--bad,#d64545)}
.sum .q{font-size:${S(1.8)};color:var(--gc)}
.btn2{font:700 ${S(.95)}/1 var(--font,sans-serif);min-height:${S(2.5)};padding:0 ${S(.9)};border-radius:${S(.6)};border:${S(.12)} solid var(--ink,#1d2b4f);background:var(--panel,#fff);color:var(--ink,#1d2b4f);cursor:pointer}
.btn2[disabled]{opacity:.45;cursor:default}
.calc{display:flex;flex-direction:column;gap:${S(.6)}}
.cc{background:var(--panel,#fff);border:${S(.12)} solid var(--line,#b9cde4);border-radius:${S(.7)};padding:${S(.5)} ${S(.8)}}
.cq{font:600 ${S(.95)}/1.2 var(--font,sans-serif);color:var(--muted,#52638a);margin-bottom:${S(.3)}}
.ceq{display:flex;align-items:center;gap:${S(.5)};flex-wrap:wrap;font:800 ${S(1.9)}/1 var(--font,sans-serif)}
.ceq .op{color:var(--muted,#52638a)}
.blank{min-width:${S(2.8)};height:${S(2.6)};font:800 ${S(1.7)}/1 var(--font,sans-serif);border-radius:${S(.5)};border:${S(.14)} dashed var(--ink,#1d2b4f);background:transparent;color:var(--ink,#1d2b4f);cursor:pointer}
.blank.rev{border-style:solid;background:#ffd447;color:#1d2b4f}
.gr{display:flex;flex-direction:column;gap:${S(.7)};align-items:center}
.gboxes{display:flex;flex-wrap:wrap;gap:${S(.6)};justify-content:center}
.gbox{min-width:${S(5.5)};max-width:${S(8)};min-height:${S(3.4)};padding:${S(.4)};border:${S(.14)} solid var(--ink,#1d2b4f);border-radius:${S(.7)};display:flex;flex-wrap:wrap;justify-content:center;align-items:center;font-size:${S(1.3)};line-height:1.15;background:var(--panel,#fff)}
.gbox.empty{border-style:dashed;color:var(--muted,#52638a);font:600 ${S(.9)}/1 var(--font,sans-serif);cursor:pointer}
.tray{display:flex;flex-wrap:wrap;justify-content:center;gap:${S(.1)};font-size:${S(1.4)};line-height:1.2;min-height:${S(2)};max-width:${S(20)}}
.geq{font:800 ${S(1.4)}/1.2 var(--font,sans-serif)}
.cmpbox{display:flex;flex-direction:column;gap:${S(.8)};align-items:center}
.tb table{border-collapse:collapse;margin:0 auto;font:700 ${S(1.1)}/1.2 var(--font,sans-serif);background:var(--panel,#fff)}
.tb th,.tb td{border:${S(.09)} solid var(--line,#b9cde4);padding:${S(.35)} ${S(.9)};text-align:center}
.tb th{background:var(--ink,#1d2b4f);color:var(--paper,#f6fbff)}
.tb .blank{min-width:${S(2.2)};height:${S(1.9)};font-size:${S(1.2)}}
.sqw,.iw{display:flex;flex-direction:column;gap:${S(.8)};align-items:center}
.sq,.ich{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:center;gap:${S(.2)}}
.sa,.ia{display:inline-flex;flex-direction:column;align-items:center;font:700 ${S(1.3)}/1 var(--font,sans-serif);color:var(--muted,#52638a)}
.sa small,.ia small{font-size:${S(.9)};color:var(--ink,#1d2b4f);min-height:${S(1.1)};font-weight:800}
.sb,.ib{min-width:${S(3)};height:${S(3)};padding:0 ${S(.5)};display:inline-grid;place-items:center;font:800 ${S(1.6)}/1 var(--font,sans-serif);border:${S(.14)} solid var(--ink,#1d2b4f);border-radius:${S(.6)};background:var(--panel,#fff)}
.sb.q,.ib:not(.rev){border-style:dashed;color:var(--muted,#52638a)} .sb.rev,.ib.rev{background:#ffd447;color:#1d2b4f}
.rule{font:700 ${S(1.1)}/1.3 var(--font,sans-serif);padding:${S(.4)} ${S(.8)};border-radius:${S(.5)};background:var(--panel,#fff);border:${S(.1)} solid var(--line,#b9cde4)}
.btns,.irv{display:flex;flex-wrap:wrap;gap:${S(.5)};justify-content:center}
.bq{display:flex;flex-wrap:wrap;gap:${S(.7)};justify-content:center}
.bcard{display:flex;flex-direction:column;align-items:center;gap:${S(.5)};padding:${S(.6)} ${S(.8)};background:var(--panel,#fff);border:${S(.12)} solid var(--line,#b9cde4);border-radius:${S(.8)}}
.bex{font:800 ${S(1.4)}/1.2 var(--font,sans-serif)}
.result{font-weight:800;margin:6px 0}.result.ok{color:var(--ok,#1f9d55)}.result.bad{color:var(--bad,#d64545)}
`;
  if (typeof document !== "undefined") { const st = document.createElement("style"); st.textContent = STIL; document.head.appendChild(st); }
})();
