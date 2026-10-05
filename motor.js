/* ============================================================
   motor.js – partea comună (aplicație + administrare)
   - registrul de tipuri de probleme (câte un tip pentru fiecare metodă)
   - evaluator pentru operații simple (+ − × :)
   - renderViz: desenează pașii animați ai explicațiilor
   ============================================================ */
const sum = a => a.reduce((x, y) => x + y, 0);
const esc = s => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const tokColor = n => ["#3f6fd1", "#e4572e", "#2a9d8f", "#7a5cc7", "#d98e04", "#c2418b", "#2b8aa8", "#6b8e23"][(Math.abs(n) - 1 + 80) % 8];
const LCOL = ["#e4572e", "#2a9d8f", "#7a5cc7", "#d98e04", "#c2418b", "#2b8aa8"];
const letterColor = c => LCOL[(String(c).toLowerCase().charCodeAt(0) - 97 + 60) % LCOL.length];
const listRo = a => a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " și " + a[a.length - 1];
const eqRow = (items, op) => { const r = []; items.forEach((x, i) => { if (i) r.push(op); r.push(String(x)); }); return r; };

/* legătura cu programa clasei a II-a (MEN 3418/2013) */
const PROG = {
  "1.1": "numere naturale până la 1000: citire, scriere, formare",
  "1.2": "compararea numerelor",
  "1.3": "ordonare, estimare, rotunjire",
  "1.4": "adunări și scăderi în concentrul 0–1000, proba",
  "1.5": "înmulțirea și împărțirea ca adunare/scădere repetată",
  "1.6": "termeni matematici: sumă, total, diferență, produs, cât; metoda balanței",
  "3.1": "regularități, algoritm, verbalizarea rezolvării",
  "4.1": "operatorii logici „și”, „sau”, „nu”",
  "5.1": "sortarea și înregistrarea datelor în tabele",
  "5.2": "rezolvarea problemelor în mai multe moduri"
};
const codeOf = s => String(s).split(" ")[0];

/* ---------- registrul de tipuri ---------- */
const TIPURI = {};
function inregistreazaTip(d) { TIPURI[d.id] = d; }
const tipDe = p => TIPURI[p.tip || "grupe"];

/* ---------- operații simple ---------- */
const normOp = c => /[-−–]/.test(c) ? "-" : /[×x*]/.test(c) ? "*" : /[:÷\/]/.test(c) ? "/" : "+";
const SIM = { "+": "+", "-": "−", "*": "×", "/": ":" };
const CUV = { "+": "plus", "-": "minus", "*": "ori", "/": "împărțit la" };
function toks(ex, R) {
  const t = String(ex).replace(/\s+/g, ""), out = [], re = /R|\d+|[+\-−–×x*:÷\/]/g; let m;
  while ((m = re.exec(t))) out.push(m[0] === "R" ? { n: R, r: true } : /^\d+$/.test(m[0]) ? { n: +m[0] } : { o: normOp(m[0]) });
  return out;
}
function evalExpr(ex, R) {
  const t = toks(ex, R); let i = 0;
  const num = () => { const x = t[i++]; if (!x || x.n === undefined || x.n === null || Number.isNaN(x.n)) throw new Error("număr lipsă"); return x.n; };
  const term = () => { let v = num(); while (t[i] && (t[i].o === "*" || t[i].o === "/")) { const o = t[i++].o, r = num(); if (o === "*") v *= r; else { if (r === 0 || v % r !== 0) throw new Error("împărțire inexactă"); v /= r; } } return v; };
  const e = () => { let v = term(); while (t[i] && (t[i].o === "+" || t[i].o === "-")) { const o = t[i++].o, r = term(); v = o === "+" ? v + r : v - r; } return v; };
  const v = e(); if (i !== t.length) throw new Error("expresie greșită"); return v;
}
const vizExpr = (ex, R) => toks(ex, R).map(x => x.o ? SIM[x.o] : String(x.n));
const spokenExpr = (ex, R) => toks(ex, R).map(x => x.o ? CUV[x.o] : String(x.n)).join(" ");

/* ---------- metodele de rezolvare ale unei probleme ---------- */
function metodeFor(p) {
  const T = tipDe(p), auto = T.pasi(p);
  if (p.ajustari) Object.keys(p.ajustari).forEach(k => { if (auto[k] && p.ajustari[k]) auto[k].text = p.ajustari[k]; });
  return [{ nume: T.numeMetoda || ("Metoda 1: " + T.metoda), pasi: auto }, ...(p.metode || [])];
}

/* ---------- desenarea pașilor ---------- */
function renderViz(rows) {
  let d = 0; const STEP = .38;
  const dl = () => `--d:${(d++ * STEP).toFixed(2)}s`;
  const tk = (n, cls = "") => `<span class="vtok ${cls}" style="background:${tokColor(n)}">${n}</span>`;
  const chip = (c, cls = "") => `<span class="vchip ${cls}" style="background:${letterColor(c)}">${esc(c)}</span>`;
  const item = x => typeof x === "number" ? tk(x, "mini") : /^[a-zA-Z]$/.test(x) ? chip(x, "mini") : `<span class="vsym sm">${esc(x)}</span>`;
  return (rows || []).map(r => `<div class="vrow">${r.map(el => {
    const st = dl();
    if (typeof el === "number") return `<span class="vtok pop" style="${st};background:${tokColor(el)}">${el}</span>`;
    if (typeof el === "string") return `<span class="vsym pop" style="${st}">${esc(el)}</span>`;
    if (el.v !== undefined) return `<span class="vchip pop" style="${st};background:${letterColor(el.v)}">${esc(el.v)}</span>`;
    if (el.lab !== undefined) return `<span class="vlab pop" style="${st}"><b>${esc(el.lab)}</b><small>${esc(el.t || "")}</small></span>`;
    if (el.p) return `<span class="vpair pop ${el.ok === true ? "yes" : el.ok === false ? "no" : ""}" style="${st}">${tk(el.p[0], "mini")}<span class="pl">+</span>${tk(el.p[1], "mini")}<span>${esc(el.e || "")}</span><span class="mk">${el.ok === true ? "✓" : el.ok === false ? "✗" : ""}</span></span>`;
    if (el.arr !== undefined) return `<span class="varr pop" style="${st}"><small>${esc(el.arr)}</small><i>→</i></span>`;
    if (el.obj) return `<span class="vgrup pop" style="${st}"><span class="vg">${Array(el.n).fill(esc(el.obj)).join("")}</span>${el.e ? `<b>${esc(el.e)}</b>` : ""}</span>`;
    if (el.bal) return `<span class="vbal pop" style="${st}"><span class="pan">${el.bal.st.map(item).join("")}</span><span class="fulc">⚖️</span><span class="pan">${el.bal.dr.map(item).join("")}</span></span>`;
    if (el.bars) {
      const mx = Math.max(1, ...el.bars.map(b => sum(b.parts.map(x => x.v))));
      return `<span class="vbars pop" style="${st}">${el.bars.map(b => {
        const tot = sum(b.parts.map(x => x.v));
        return `<span class="vbr"><b class="bl">${esc(b.e)}</b><span class="bw" style="width:${(tot / mx * 100).toFixed(1)}%">${b.parts.map(x => `<span class="bp${x.q ? " q" : ""}" style="flex:${Math.max(x.v, .0001)};background:${x.q ? "transparent" : x.c}">${x.q ? "?" : esc(x.t ?? x.v)}</span>`).join("")}</span></span>`;
      }).join("")}</span>`;
    }
    if (el.seq) {
      const { t, arcs = [], hl = [] } = el.seq;
      return `<span class="vseq pop" style="${st}">${t.map((x, i) => `${i ? `<span class="va"><small>${esc(arcs[i - 1] ?? "")}</small>→</span>` : ""}<span class="vb${x === null ? " q" : ""}${hl.includes(i) ? " hl" : ""}">${x === null ? "?" : x}</span>`).join("")}</span>`;
    }
    if (el.tab) {
      const { h, r } = el.tab;
      return `<span class="vtab pop" style="${st}"><table><thead><tr>${h.map(c => `<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>${r.map(row => `<tr>${row.map(c => { const o = (c && typeof c === "object") ? c : { v: c }; return `<td class="${o.hl ? "hl" : ""}${o.q ? " q" : ""}">${esc(o.q ? "?" : o.v)}</td>`; }).join("")}</tr>`).join("")}</tbody></table></span>`;
    }
    return "";
  }).join("")}</div>`).join("");
}

/* ---------- stilurile desenelor (dimensiunea se reglează cu --s pe .stage) ---------- */
const S = k => `calc(var(--s,24px)*${k})`;
const STIL_VIZ = `
.vrow{display:flex;flex-wrap:wrap;gap:${S(.4)};align-items:center;justify-content:center}
.vtok{width:${S(2.1)};height:${S(2.1)};border-radius:50%;display:inline-grid;place-items:center;font:800 ${S(1.1)}/1 var(--font,sans-serif);color:#fff;border:${S(.12)} solid rgba(0,0,0,.22)}
.vtok.mini{width:${S(1.6)};height:${S(1.6)};font-size:${S(.85)};border-width:${S(.09)}}
.vchip{min-width:${S(2)};height:${S(2)};padding:0 ${S(.4)};border-radius:${S(.5)};display:inline-grid;place-items:center;font:800 ${S(1.1)}/1 var(--font,sans-serif);color:#fff;border:${S(.1)} solid rgba(0,0,0,.2)}
.vchip.mini{min-width:${S(1.5)};height:${S(1.5)};font-size:${S(.85)}}
.vsym{font:800 ${S(1.6)}/1 var(--font,sans-serif);color:var(--ink,#1d2b4f)}
.vsym.sm{font-size:${S(1)}}
.vpair{display:inline-flex;align-items:center;gap:${S(.2)};padding:${S(.2)} ${S(.5)} ${S(.2)} ${S(.25)};border:${S(.12)} solid var(--line,#b9cde4);border-radius:${S(1.4)};background:var(--paper,#f6fbff);font:800 ${S(.95)}/1 var(--font,sans-serif)}
.vpair .pl{font-size:${S(.8)};color:var(--muted,#52638a)}
.vpair.yes{border-color:var(--ok,#1f9d55)} .vpair.yes .mk{color:var(--ok,#1f9d55)}
.vpair.no{border-color:var(--bad,#d64545);background:repeating-linear-gradient(135deg,transparent 0 ${S(.3)},rgba(214,69,69,.12) ${S(.3)} ${S(.6)})} .vpair.no .mk{color:var(--bad,#d64545)}
.vlab{display:inline-flex;flex-direction:column;align-items:center;line-height:1}
.vlab b{font:800 ${S(1.9)}/1 var(--font,sans-serif)}
.vlab small{font:700 ${S(.7)}/1.2 var(--font,sans-serif);color:var(--muted,#52638a);margin-top:${S(.1)}}
.varr{display:inline-flex;flex-direction:column;align-items:center;line-height:1}
.varr small{font:800 ${S(.9)}/1 var(--font,sans-serif)} .varr i{font:700 ${S(1.6)}/1 var(--font,sans-serif);font-style:normal;color:var(--muted,#52638a)}
.vgrup{display:inline-flex;flex-direction:column;align-items:center;gap:${S(.1)};padding:${S(.3)} ${S(.5)};border:${S(.1)} solid var(--line,#b9cde4);border-radius:${S(.6)};background:var(--paper,#f6fbff);max-width:${S(7)}}
.vgrup .vg{display:flex;flex-wrap:wrap;gap:${S(.05)};justify-content:center;font-size:${S(1)};line-height:1.15}
.vgrup b{font:800 ${S(.8)}/1 var(--font,sans-serif)}
.vbal{display:inline-flex;align-items:flex-end;gap:${S(.3)}}
.vbal .pan{display:flex;flex-wrap:wrap;gap:${S(.2)};align-items:center;justify-content:center;min-width:${S(3.2)};min-height:${S(2)};padding:${S(.3)};border-bottom:${S(.18)} solid var(--ink,#1d2b4f);border-radius:0 0 ${S(.8)} ${S(.8)};background:var(--paper,#f6fbff)}
.vbal .fulc{font-size:${S(2)};line-height:1}
.vbars{display:flex;flex-direction:column;gap:${S(.35)};width:min(100%,${S(18)})}
.vbr{display:flex;flex-direction:column;gap:${S(.1)}} .vbr .bl{font:800 ${S(.8)}/1.1 var(--font,sans-serif)}
.vbr .bw{display:flex;border-radius:${S(.3)};overflow:hidden;border:${S(.08)} solid rgba(0,0,0,.25);min-width:${S(1)}}
.vbr .bp{display:grid;place-items:center;min-height:${S(1.6)};font:800 ${S(.9)}/1 var(--font,sans-serif);color:#fff;border-right:${S(.06)} solid rgba(255,255,255,.7)}
.vbr .bp.q{border:${S(.1)} dashed var(--ink,#1d2b4f);color:var(--ink,#1d2b4f)}
.vseq{display:inline-flex;flex-wrap:wrap;align-items:flex-end;gap:${S(.1)};justify-content:center}
.vseq .va{display:inline-flex;flex-direction:column;align-items:center;font:700 ${S(1)}/1 var(--font,sans-serif);color:var(--muted,#52638a)} .vseq .va small{font-size:${S(.65)};color:var(--ink,#1d2b4f);min-height:${S(.8)}}
.vb{min-width:${S(1.9)};height:${S(1.9)};padding:0 ${S(.3)};display:inline-grid;place-items:center;font:800 ${S(1)}/1 var(--font,sans-serif);border:${S(.1)} solid var(--ink,#1d2b4f);border-radius:${S(.35)};background:var(--panel,#fff)}
.vb.q{border-style:dashed;color:var(--muted,#52638a)} .vb.hl{background:#ffd447;color:#1d2b4f}
.vtab table{border-collapse:collapse;font:700 ${S(.85)}/1.2 var(--font,sans-serif)}
.vtab th,.vtab td{border:${S(.07)} solid var(--line,#b9cde4);padding:${S(.2)} ${S(.5)};text-align:center}
.vtab th{background:var(--ink,#1d2b4f);color:var(--paper,#f6fbff)} .vtab td.hl{background:#ffd447;color:#1d2b4f} .vtab td.q{color:var(--muted,#52638a)}
.pop{opacity:0;animation:pop .5s cubic-bezier(.2,1.4,.4,1) var(--d,0s) forwards}
@keyframes pop{from{opacity:0;transform:scale(.55) translateY(10px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.pop{animation:none;opacity:1}}
`;
if (typeof document !== "undefined") {
  const st = document.createElement("style"); st.textContent = STIL_VIZ; document.head.appendChild(st);
}
