/* ============================================================
   asistent.js – cerculețul asistent și panoul învățătorului
   - Textele vin din documentul „Asistentul virtual – texte pe metode"
     (METODE de mai jos; se corectează aici sau în document, apoi se copiază).
   - Trei trepte: întrebare → indiciu despre instrument → primul pas.
   - Moduri: Oprit / La cerere / Automat (implicit, după 90 s fără atingeri,
     maximum 3 apariții pe problemă). Automat înseamnă doar că cerculețul
     pulsează; vocea pornește abia când cineva îl atinge.
   - Nu reține nume. Observațiile sunt doar numărători pe problemă.
   Depinde de: motor.js (PROG, spokenExpr, normOp). Folosește speak() din pagină, dacă există.
   ============================================================ */
const Asistent = (() => {
  /* ---------- texte pe metode (din document) ---------- */
  const METODE = {
    obiecte: { nume: "Obiecte și jetoane, numărare cu pas",
      t1: ["Ce vrei să afli?", "Ce știi deja din problemă?", "Poți arăta cu jetoane ce se întâmplă în poveste?"],
      t2: ["Când problema vorbește despre lucruri care se pot număra, le poți pune pe tablă ca jetoane.", "Un jeton pentru fiecare lucru din poveste."],
      inc: ["Ai pus jetoanele pe tablă. Acum le poți număra.", "Numără cu voce tare, ca să te audă toți."],
      verb: ["Ce ai făcut cu jetoanele: le-ai adăugat, le-ai scos sau le-ai grupat?"],
      ver: ["Numără jetoanele încă o dată, din 1 în 1. Ies tot atâtea?"] },
    desen: { nume: "Desen cu segmente și bare, axa numerelor",
      t1: ["Despre ce cantități vorbește problema?", "Care cantitate este mai mare? Care este mai mică?", "Ce nu știi încă? Cum ai putea arăta asta?"],
      t2: ["Când problema compară două cantități, poți desena câte un segment pentru fiecare.", "Cantitatea mai mare are segmentul mai lung.", "Pentru ce nu știi, poți folosi o acoladă și un semn de întrebare."],
      inc: ["Pe desen se vede cine are mai mult.", "Ai scris numerele pe segmente. Așa se vede ce știi."],
      verb: ["Unde vezi pe desen ce trebuie să afli?", "Arată pe desen diferența."],
      ver: ["Citește desenul. Se potrivește cu povestea din problemă?"] },
    grupare: { nume: "Grupare: adunare repetată, înmulțire, împărțire",
      t1: ["Sunt mai multe grupe la fel de mari? Câte grupe sunt?", "Câte {obiecte} are fiecare grupă?", "Ce vrei să afli: câte sunt în total, câte grupe sunt sau câte sunt într-o grupă?"],
      t2: ["Când fiecare primește la fel de multe lucruri, poți face grupe egale.", "Pune obiectele în grupe, câte {numar_in_grupa} în fiecare."],
      inc: ["Toate grupele sunt la fel de mari. Bravo!", "Aduni de același număr de mai multe ori. Cum scrii mai scurt?"],
      verb: ["Cum ai aflat: ai adunat, ai înmulțit sau ai numărat?"],
      ver: ["Proba: înmulțește numărul de grupe cu câte sunt într-o grupă. Obții totalul?"] },
    balanta: { nume: "Balanța",
      t1: ["Ce înseamnă semnul = aici? Cât este pe un taler și cât pe celălalt?", "Ce număr nu cunoști încă?"],
      t2: ["Când ai o egalitate cu un număr necunoscut, gândește-te la o balanță.", "Ce scoți de pe un taler, scoți și de pe celălalt, ca să rămână în echilibru."],
      inc: ["Balanța a rămas în echilibru. Foarte bine!"],
      verb: ["Ce ai făcut ca balanța să rămână în echilibru?"],
      ver: ["Pune numărul găsit în locul literei. Balanța rămâne în echilibru?"] },
    inversa: { nume: "Operația inversă, proba, mersul invers",
      t1: ["Cu ce număr ai ajuns la final?", "Ce s-a făcut cu numărul căutat, pe rând?", "Poți să te întorci de la sfârșit spre început?"],
      t2: ["Când știi rezultatul final și cauți numărul de la început, poți merge înapoi, pas cu pas.", "La fiecare pas faci operația opusă: unde s-a adunat, scazi; unde s-a scăzut, aduni."],
      inc: ["Te-ai întors un pas. Mai sunt pași?", "Așa se desface povestea, de la sfârșit."],
      verb: ["Cum ai știut ce operație să faci când te-ai întors?"],
      ver: ["Pornește acum de la numărul găsit și fă pașii din problemă. Ajungi la rezultatul din problemă?"] },
    incercari: { nume: "Încercări sistematice, cu eliminare logică",
      t1: ["Câte variante ai? Poți să le scrii pe toate?", "Ce condiții trebuie să respecte numerele?", "Un număr poate fi folosit de două ori?"],
      t2: ["Când sunt puține numere, le poți încerca pe rând și le verifici.", "Notează ce nu merge, ca să nu încerci din nou aceeași variantă."],
      inc: ["Ai eliminat o variantă care nu merge. Și asta ajută!", "Încercarea ta ne-a arătat ceva nou."],
      verb: ["Ce variante ai încercat? Pe care le-ai eliminat și de ce?"],
      ver: ["Verifică toate condițiile din problemă, pe rând. Se potrivesc toate?"] },
    tabel: { nume: "Tabel și organizarea datelor",
      t1: ["Câte feluri de lucruri apar în problemă?", "Ce numere apar pentru fiecare fel?", "Ai putea să le pui pe rânduri, ca să le vezi mai bine?"],
      t2: ["Când problema are multe date de același fel, un tabel te ajută.", "Pe fiecare rând pui un fel de lucruri, iar pe fiecare coloană un fel de informație."],
      inc: ["Tabelul tău arată clar datele.", "Ai pus fiecare lucru la locul lui."],
      verb: ["Ce ai pus pe rânduri? Ce ai pus pe coloane? Ce ai aflat din tabel?"],
      ver: ["Numără din nou din tabel. Se potrivește cu ce spune problema?"] },
    regularitati: { nume: "Regularități",
      t1: ["Ce se întâmplă de la un număr la următorul?", "Se adaugă ceva, se scade ceva sau se repetă ceva?", "Privește primele două numere. Ce observi?"],
      t2: ["La șiruri poți calcula cât s-a schimbat de la un număr la următorul.", "Dacă se schimbă la fel de fiecare dată, ai găsit regula."],
      inc: ["Ai găsit o regulă! Verifică dacă merge peste tot.", "Ai observat ceva important în șir."],
      verb: ["Care este regula șirului? Spune-o cu cuvintele tale."],
      ver: ["Aplică regula pe tot șirul. Se potrivesc toate numerele?"] },
    logica: { nume: "Logică: „dacă… atunci”",
      t1: ["Ce se întâmplă mai întâi în problemă? Și ce urmează după aceea?", "Ce poți afla din ce știi deja?"],
      t2: ["Gândește în pași: dacă știu asta, atunci pot afla ceva nou.", "Apoi folosești ce ai aflat ca să afli mai departe."],
      inc: ["Ai folosit ce știai ca să afli ceva nou. Așa se rezolvă!"],
      verb: ["Completează: dacă …, atunci …"],
      ver: ["Parcurge pașii de la capăt, cu «dacă… atunci». Se leagă toți?"] },
    transversale: { nume: "Metode transversale: în mai multe moduri, verbalizare, verificare",
      t1: ["Ce vrei să afli?", "Ce știi deja?"], t2: ["Poți rezolva problema și într-un alt mod."],
      inc: ["Așa! Continuă."], verb: ["Spune-ne pe scurt: ce ai făcut mai întâi? Și apoi?"], ver: ["Citește întrebarea. Răspunsul tău se potrivește?"] },
    /* text provizoriu: calcule pe rând (nu există ca metodă separată în document) */
    calcul: { nume: "Calcul pe rând (text provizoriu)",
      t1: ["Ce vrei să afli?", "Ce știi deja din problemă?"],
      t2: ["Poți face pe rând câte un calcul.", "Ce calcul poți face primul?"],
      inc: ["Ai găsit un rezultat. Îl poți folosi în pasul următor."],
      verb: ["Ce calcule ai făcut, în ordine?"],
      ver: ["Citește din nou întrebarea. Răspunsul tău se potrivește cu ce se cere?"] }
  };
  /* ce metodă recomandă și ce metode acceptă programa pentru fiecare tip de problemă */
  const PE_TIP = {
    grupe: { rec: "incercari", alte: ["calcul"] },
    calcul: { rec: "calcul", alte: ["obiecte"] },
    grupare: { rec: "grupare", alte: ["obiecte", "desen"] },
    bare: { rec: "desen", alte: ["calcul"] },
    tabel: { rec: "tabel", alte: ["calcul"] },
    sir: { rec: "regularitati", alte: [] },
    invers: { rec: "inversa", alte: ["desen"] },
    balanta: { rec: "balanta", alte: [] }
  };
  const COMUNE = {
    intro: "Bună! Sunt aici dacă ai nevoie de mine. Vrei ajutor sau mai gândești?",
    gandesc: "Bine. Te las să gândești. Mă întorc puțin mai târziu.",
    dupa3: "Acesta a fost doar primul pas. Continuă tu de aici.",
    final: ["Ai terminat! Vrei să verifici?", "Cum ai rezolvat? Povestește-ne sau alege o imagine."]
  };

  /* ---------- completarea textelor ---------- */
  const fill = (txt, v) => {
    const parts = txt.split(/(?<=[.?!])\s+/);
    return parts.filter(p => !(/\{(\w+)\}/.test(p) && [...p.matchAll(/\{(\w+)\}/g)].some(m => v[m[1]] === undefined || v[m[1]] === null)))
      .map(p => p.replace(/\{(\w+)\}/g, (_, k) => v[k])).join(" ");
  };
  const fillAll = (arr, v) => arr.map(t => fill(t, v)).filter(Boolean);
  const VERB = { "+": "adăugăm", "-": "scădem", "*": "înmulțim cu", "/": "împărțim la" };
  const varsOf = p => {
    const v = {};
    if (p.tip === "grupare") { v.obiecte = p.obiect || "obiecte"; if (p.inGrupa !== null && p.inGrupa !== undefined) v.numar_in_grupa = p.inGrupa; }
    return v;
  };

  /* primul pas, calculat din datele problemei */
  function primulPas(p) {
    const tip = p.tip || "grupe";
    try {
      if (tip === "grupe") { const s = p.sume.find(x => x !== null); return `Primul pas este să scrii toate perechile care dau ${s}. Alegi una și vezi dacă mai poți forma restul grupelor. Continuă tu.`; }
      if (tip === "calcul") {
        const r = String(p.operatii[0] || "").split("|"), q = (r[1] || "").trim();
        return q ? `Primul pas este să afli: ${q} Continuă tu.` : `Primul pas este să calculezi ${spokenExpr(r[0].trim(), null)}. Continuă tu.`;
      }
      if (tip === "grupare") {
        const ob = p.obiect || "obiecte", g = p.grupe, k = p.inGrupa, t = p.total;
        if (t === null || t === undefined) return `Primul pas este să faci o grupă cu ${k} ${ob}. Apoi faci și celelalte grupe la fel. Continuă tu.`;
        if (g === null || g === undefined) return `Primul pas este să iei din cele ${t} ${ob} câte ${k} și să faci o grupă. Continuă tu.`;
        return `Primul pas este să pui câte un obiect în fiecare grupă, până se termină. Continuă tu.`;
      }
      if (tip === "bare") {
        const known = (p.valA === null || p.valA === undefined) ? [p.numeB || "B", p.valB] : [p.numeA || "A", p.valA];
        const other = (p.valA === null || p.valA === undefined) ? (p.numeA || "A") : (p.numeB || "B");
        return `Primul pas este să desenezi un segment pentru ${known[0]} și să scrii ${known[1]} pe el. Segmentul pentru ${other} îl desenezi tu.`;
      }
      if (tip === "tabel") return `Primul pas este să scrii în prima coloană denumirile (${p.randuri.map(r => String(r).split(";")[0].trim()).join(", ")}). În a doua coloană scrii numerele pentru fiecare. Completează tu restul.`;
      if (tip === "sir") {
        if (p.regula === "suma2" || p.regula === "suma3") return `Primul pas este să aduni primele ${p.regula === "suma2" ? "două" : "trei"} numere ale șirului. Ce observi la numărul care urmează? Continuă tu.`;
        const k = p.sir.filter(x => x !== null && x !== undefined);
        return `Primul pas este să afli diferența dintre ${k[0]} și ${k[1]}. Verifici la următoarele două numere. Dacă e la fel, ai regula. Continuă tu.`;
      }
      if (tip === "invers") {
        const m = /^\s*([+\-−–×x*:÷\/])\s*(\d+)\s*$/.exec(p.operatii[p.operatii.length - 1]);
        return `Primul pas este să pornești de la ${p.rezultat}. Ultima operație din problemă a fost „${VERB[normOp(m[1])]} ${m[2]}”. Te întorci cu operația opusă. Continuă tu.`;
      }
      if (tip === "balanta") {
        const [l, r] = String(p.ecuatii[0]).split("=");
        return `Primul pas este să pui pe un taler ${l.trim().replace(/\s*\+\s*/g, " plus ")} și pe celălalt ${r.trim()}. Apoi iei de pe ambele talere ce poți și vezi ce rămâne. Continuă tu.`;
      }
    } catch (e) {}
    return "Primul pas este să citești din nou problema și să alegi ce știi. Continuă tu.";
  }

  function texte(p) {
    const cfg = PE_TIP[p.tip || "grupe"] || { rec: "transversale", alte: [] }, m = METODE[cfg.rec], v = varsOf(p);
    return { rec: cfg.rec, alte: cfg.alte, nume: m.nume, t1: fillAll(m.t1, v), t2: fillAll(m.t2, v), t3: primulPas(p), inc: fillAll(m.inc, v), verb: fillAll(m.verb, v), ver: fillAll(m.ver, v) };
  }

  /* ---------- starea și declanșatorii (independente de ecran) ---------- */
  const PREF_KEY = "matematica.asistent.pref", OBS_KEY = "matematica.obs.v1";
  const MAX_AUTO = 3, PAUZA_NEXT = 120000, PAUZA_MIN = 5 * 60000;
  let pref = { mod: "auto", viteza: 90 };
  try { const q = JSON.parse(localStorage.getItem(PREF_KEY)); if (q) pref = { ...pref, ...q }; } catch (e) {}
  const savePref = () => { try { localStorage.setItem(PREF_KEY, JSON.stringify(pref)); } catch (e) {} };
  let pauzaPana = 0;
  const nou = () => ({ aparitii: 0, treapta: 0, cereri: 0, oprit: false, ultimaAct: Date.now(), nextOk: 0, pulseaza: false, blocat: false, bula: false });
  let S = nou(), P = null, X = null;

  function act(t = Date.now()) { S.ultimaAct = t; S.pulseaza = false; S.blocat = false; }
  function tick(t = Date.now()) {
    if (!P || t < pauzaPana || S.bula) return;
    if ((t - S.ultimaAct) / 1000 >= pref.viteza) S.blocat = true;
    if (S.blocat && pref.mod === "auto" && !S.oprit && S.aparitii < MAX_AUTO && !S.pulseaza && t >= S.nextOk) { S.pulseaza = true; S.aparitii++; S.nextOk = t + PAUZA_NEXT; }
  }
  function mesteGandesc(t = Date.now()) { S.nextOk = t + PAUZA_NEXT; S.ultimaAct = t; S.pulseaza = false; S.blocat = false; }
  function cere() { S.cereri++; S.treapta = Math.min(3, S.treapta + 1); return S.treapta; }

  /* observații (doar numărători, fără nume) */
  const obsAll = () => { try { return JSON.parse(localStorage.getItem(OBS_KEY)) || {}; } catch (e) { return {}; } };
  const obsOf = id => ({ singur: 0, indiciu: 0, ajutor: 0, ...(obsAll()[id] || {}) });
  function obsAdd(k) { const a = obsAll(), id = P.id; a[id] = { ...obsOf(id) }; a[id][k]++; try { localStorage.setItem(OBS_KEY, JSON.stringify(a)); } catch (e) {} }
  function obsClear() { const a = obsAll(); delete a[P.id]; try { localStorage.setItem(OBS_KEY, JSON.stringify(a)); } catch (e) {} }

  /* ---------- interfața ---------- */
  const say = t => { try { if (typeof speak === "function") return speak(t, () => {}); } catch (e) {} return false; };
  const $ = id => document.getElementById(id);
  let root = null, timer = null;
  const esc2 = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

  const CSS = `
.as-circle{position:fixed;right:20px;bottom:calc(104px + env(safe-area-inset-bottom,0px));z-index:25;width:68px;height:68px;border-radius:50%;border:4px solid var(--ink,#1d2b4f);background:var(--panel,#fff);font-size:34px;line-height:1;cursor:pointer;box-shadow:0 6px 0 rgba(0,0,0,.2);display:grid;place-items:center;padding:0}
.as-circle[hidden],.as-bubble[hidden],.as-panel[hidden],.as-dot[hidden]{display:none}
.as-circle.pulse{animation:aspulse 1.6s ease-in-out infinite}
@keyframes aspulse{0%,100%{transform:scale(1);box-shadow:0 6px 0 rgba(0,0,0,.2),0 0 0 0 rgba(255,212,71,.8)}50%{transform:scale(1.07);box-shadow:0 6px 0 rgba(0,0,0,.2),0 0 0 16px rgba(255,212,71,0)}}
@media (prefers-reduced-motion:reduce){.as-circle.pulse{animation:none;outline:6px solid #ffd447}}
.as-bubble{position:fixed;right:20px;bottom:calc(184px + env(safe-area-inset-bottom,0px));z-index:26;width:min(440px,calc(100vw - 40px));max-height:60vh;overflow:auto;background:var(--panel,#fff);color:var(--ink,#1d2b4f);border:4px solid var(--ink,#1d2b4f);border-radius:20px 20px 4px 20px;padding:14px 16px;font:500 22px/1.35 var(--font,sans-serif);box-shadow:0 10px 28px rgba(0,0,0,.28)}
.as-bubble p{margin:0 0 8px}
.as-bubble .as-btns{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
.as-b{font:700 19px/1 var(--font,sans-serif);min-height:50px;padding:0 16px;border-radius:12px;border:3px solid var(--ink,#1d2b4f);background:var(--panel,#fff);color:var(--ink,#1d2b4f);cursor:pointer}
.as-b.main{background:var(--ink,#1d2b4f);color:var(--paper,#f6fbff)}
.as-teacher{position:fixed;left:16px;bottom:calc(104px + env(safe-area-inset-bottom,0px));z-index:25;font:700 15px/1 var(--font,sans-serif);min-height:38px;padding:0 12px;border-radius:19px;border:2px solid var(--muted,#52638a);background:var(--panel,#fff);color:var(--muted,#52638a);cursor:pointer;opacity:.75;position:fixed}
.as-teacher:hover,.as-teacher:focus-visible{opacity:1}
.as-dot{display:inline-block;width:11px;height:11px;border-radius:50%;background:#e4572e;margin-left:7px;vertical-align:middle}
.as-panel{position:fixed;left:16px;bottom:calc(152px + env(safe-area-inset-bottom,0px));z-index:35;width:min(430px,calc(100vw - 32px));max-height:68vh;overflow:auto;background:var(--panel,#fff);color:var(--ink,#1d2b4f);border:3px solid var(--ink,#1d2b4f);border-radius:16px;padding:12px 14px;font:500 18px/1.35 var(--font,sans-serif);box-shadow:0 10px 28px rgba(0,0,0,.3)}
.as-panel p{margin:4px 0}.as-panel hr{border:0;border-top:2px solid var(--line,#b9cde4);margin:10px 0}
.as-ph{display:flex;justify-content:space-between;align-items:center;gap:8px;font-size:20px;margin-bottom:6px}
.as-row{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:6px 0}
.as-row>span{font-weight:700;margin-right:4px}
.as-s{font:700 16px/1 var(--font,sans-serif);min-height:42px;padding:0 12px;border-radius:10px;border:2px solid var(--ink,#1d2b4f);background:var(--panel,#fff);color:var(--ink,#1d2b4f);cursor:pointer}
.as-s[aria-pressed="true"]{background:#ffd447;color:#1d2b4f}
.as-info{color:var(--muted,#52638a);font-size:16px}
.as-circle,.as-teacher,.as-bubble,.as-panel{zoom:var(--ui,1)}
`;
  function init() {
    if (root || typeof document === "undefined") return;
    const st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
    root = document.createElement("div"); root.id = "as-root";
    root.innerHTML = `<button class="as-circle" id="as-circle" aria-label="Asistent: cere ajutor"><span aria-hidden="true">💡</span></button>
<div class="as-bubble" id="as-bubble" role="dialog" aria-live="polite" hidden></div>
<button class="as-teacher" id="as-teacher" aria-label="Panou pentru învățător">Învățător<i class="as-dot" id="as-dot" hidden aria-label="Elevul pare blocat"></i></button>
<div class="as-panel" id="as-panel" hidden></div>`;
    document.body.appendChild(root);
    $("as-circle").addEventListener("click", () => { act(); S.bula ? inchide() : intro(); });
    $("as-bubble").addEventListener("click", e => {
      const b = e.target.closest("[data-as]"); if (!b) return; const a = b.dataset.as;
      if (a === "close") inchide();
      else if (a === "think") { say(COMUNE.gandesc); mesteGandesc(); inchide(); }
      else if (a === "help") { act(); trepta(cere()); }
      else if (a === "listen") say($("as-bubble").dataset.speak || "");
    });
    $("as-teacher").addEventListener("click", () => { const p = $("as-panel"); p.hidden = !p.hidden; if (!p.hidden) panou(); });
    $("as-panel").addEventListener("click", e => {
      const b = e.target.closest("[data-tp]"); if (!b) return; const a = b.dataset.tp, v = b.dataset.v;
      if (a === "close") $("as-panel").hidden = true;
      else if (a === "mod") { pref.mod = v; savePref(); }
      else if (a === "viteza") { pref.viteza = +v; savePref(); }
      else if (a === "pauza") { pauzaPana = pauzaPana > Date.now() ? 0 : Date.now() + PAUZA_MIN; }
      else if (a === "oprit") { S.oprit = !S.oprit; if (S.oprit) inchide(); }
      else if (a === "obs") obsAdd(v);
      else if (a === "obs-clear") obsClear();
      panou(); sync();
    });
    document.addEventListener("keydown", () => act());
    timer = setInterval(() => { tick(); sync(); }, 1000);
  }
  function bubble(html, speakTxt) {
    const b = $("as-bubble"); b.innerHTML = html; b.dataset.speak = speakTxt || ""; b.hidden = false; S.bula = true; S.pulseaza = false; sync();
  }
  function inchide() { $("as-bubble").hidden = true; S.bula = false; sync(); }
  const btns = (...x) => `<div class="as-btns">${x.join("")}</div>`;
  const B = (a, t, main) => `<button class="as-b${main ? " main" : ""}" data-as="${a}">${t}</button>`;
  function intro() { bubble(`<p>${esc2(COMUNE.intro)}</p>${btns(B("think", "Mai gândesc"), B("help", "Ajută-mă", 1))}`, COMUNE.intro); say(COMUNE.intro); }
  function trepta(n) {
    const t = X;
    const lines = n === 1 ? t.t1 : n === 2 ? t.t2 : [t.t3, COMUNE.dupa3];
    const txt = lines.join(" ");
    bubble(`${lines.map(l => `<p>${esc2(l)}</p>`).join("")}${btns(B("think", "Mai gândesc"), n < 3 ? B("help", "Mai mult ajutor", 1) : "", B("listen", "🔊 Ascultă"), B("close", "Închide"))}`, txt);
    say(txt);
  }
  function final() {
    if (!X || !P || pref.mod === "off" || S.oprit) return;
    const lines = [COMUNE.final[0], ...X.ver.slice(0, 1), COMUNE.final[1], ...X.verb.slice(0, 1)];
    bubble(`${lines.map(l => `<p>${esc2(l)}</p>`).join("")}${btns(B("close", "Închide", 1))}`, lines.join(" "));
  }
  function sync() {
    if (!root) return;
    const off = pref.mod === "off" || S.oprit;
    $("as-circle").hidden = off;
    if (off) $("as-bubble").hidden = true;
    $("as-circle").classList.toggle("pulse", !!S.pulseaza && !S.bula);
    $("as-dot").hidden = !(S.blocat && Date.now() >= pauzaPana);
  }
  function panou() {
    if (!P) return;
    const ob = obsOf(P.id), mm = k => METODE[k].nume, pa = pauzaPana > Date.now();
    const seg = (a, items, cur) => items.map(([v, t]) => `<button class="as-s" data-tp="${a}" data-v="${v}" aria-pressed="${String(cur) === String(v)}">${t}</button>`).join("");
    const coduri = (P.program || []).map(c => { const k = codeOf(c); return `${k} ${PROG[k] || ""}`.trim(); });
    $("as-panel").innerHTML = `<div class="as-ph"><b>Metode pentru această problemă</b><button class="as-s" data-tp="close" aria-label="Închide">✕</button></div>
<p><b>Recomandată de programă:</b> ${esc2(mm(X.rec))}</p>
<p><b>Se mai poate rezolva și cu:</b> ${X.alte.length ? esc2(X.alte.map(mm).join("; ")) : "doar metoda recomandată"}</p>
<p class="as-info"><b>Din programă:</b> ${esc2(coduri.join(" · ") || "—")}</p><hr>
<div class="as-row"><span>Asistent:</span>${seg("mod", [["off", "Oprit"], ["cerere", "La cerere"], ["auto", "Automat"]], pref.mod)}</div>
<div class="as-row"><span>Prima apariție după:</span>${seg("viteza", [[60, "60 s"], [90, "90 s"], [120, "120 s"]], pref.viteza)}</div>
<div class="as-row"><button class="as-s" data-tp="pauza" aria-pressed="${pa}">${pa ? "Pauză activă. Reia" : "Pauză 5 minute"}</button><button class="as-s" data-tp="oprit" aria-pressed="${S.oprit}">Fără asistent la această problemă</button></div>
<p class="as-info">Ajutor cerut la această problemă: treapta ${S.treapta} din 3 (${S.cereri} cereri). Apariții automate: ${S.aparitii} din ${MAX_AUTO}.${S.blocat ? " Elevul pare blocat." : ""}</p><hr>
<div class="as-row"><span>Observare (fără nume):</span></div>
<div class="as-row"><button class="as-s" data-tp="obs" data-v="singur">A ales singur</button><button class="as-s" data-tp="obs" data-v="indiciu">A primit un indiciu</button><button class="as-s" data-tp="obs" data-v="ajutor">A avut nevoie de ajutor</button></div>
<p>La această problemă: ${ob.singur} au ales singuri, ${ob.indiciu} au primit un indiciu, ${ob.ajutor} au avut nevoie de ajutor.</p>
<button class="as-s" data-tp="obs-clear">Șterge observațiile</button>`;
  }

  /* ---------- legătura cu pagina ---------- */
  function incarca(problema, tabla) {
    init();
    P = problema; X = texte(problema); S = nou();
    if (typeof document !== "undefined" && root) {
      if (tabla && tabla !== incarca._t) {
        incarca._t = tabla;
        ["pointerdown", "pointerup"].forEach(ev => tabla.addEventListener(ev, () => act(), true));
      }
      $("as-bubble").hidden = true; $("as-panel").hidden = true; sync();
    }
  }
  return { incarca, final, texte, primulPas, METODE, PE_TIP, COMUNE, _act: act, _tick: tick, _cere: cere, _gandesc: mesteGandesc, _state: () => S, _pref: () => pref, _setPref: o => { pref = { ...pref, ...o }; }, _setPauza: t => { pauzaPana = t; }, _obsAdd: obsAdd, _obsOf: obsOf, _load: p => { P = p; X = texte(p); S = nou(); } };
})();
