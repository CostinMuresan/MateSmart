/* ============================================================
   numere.js – logica pentru axa numerelor și numărătoarea de poziționare
   (fără interfață, ca să poată fi verificată prin teste)
   Programa clasei a II-a (0–1000): scriere cu litere, comparare, ordonare,
   vecini, rotunjire la zeci și sute, zeci / sute / unități, numere pare și impare.
   ============================================================ */
const NUM = (() => {
  const UN = ["zero", "unu", "doi", "trei", "patru", "cinci", "șase", "șapte", "opt", "nouă", "zece", "unsprezece", "doisprezece", "treisprezece", "paisprezece", "cincisprezece", "șaisprezece", "șaptesprezece", "optsprezece", "nouăsprezece"];
  const ZECI = ["", "", "douăzeci", "treizeci", "patruzeci", "cincizeci", "șaizeci", "șaptezeci", "optzeci", "nouăzeci"];
  const SUTE = ["", "o sută", "două sute", "trei sute", "patru sute", "cinci sute", "șase sute", "șapte sute", "opt sute", "nouă sute"];

  /* numărul scris cu litere (0–1000) */
  function cuvinte(n) {
    n = Math.round(n);
    if (!(n >= 0 && n <= 1000)) return "";
    if (n === 1000) return "o mie";
    if (n < 20) return UN[n];
    const s = Math.floor(n / 100), r = n % 100, parts = [];
    if (s) parts.push(SUTE[s]);
    if (r > 0) {
      if (r < 20) parts.push(UN[r]);
      else { const z = Math.floor(r / 10), u = r % 10; parts.push(ZECI[z] + (u ? " și " + UN[u] : "")); }
    }
    return parts.join(" ");
  }

  /* gradarea axei: din cât în cât se pun liniuțe (minor) și etichete (label) */
  const NICE = [1, 2, 5, 10, 20, 50, 100, 200, 500];
  function ticks(lo, hi) {
    const span = Math.max(1, hi - lo);
    const minor = NICE.find(m => span / m <= 110) || 1000;
    const maxL = span <= 20 ? 22 : 12;   // etichete mai rare pe axele lungi, ca să rămână lizibile
    const label = NICE.find(L => L >= minor && L % minor === 0 && span / L <= maxL) || 1000;
    return { minor, label };
  }

  /* rotunjire: la jumătate se rotunjește în sus (35 → 40) */
  const rotunjeste = (n, la) => Math.floor((n + la / 2) / la) * la;
  const valoare = b => 100 * b.h + 10 * b.t + b.u;
  const canonic = n => ({ h: Math.floor(n / 100), t: Math.floor((n % 100) / 10), u: n % 10 });
  /* 10 unități → 1 zece, 10 zeci → 1 sută */
  function regrupeaza(b) {
    let { h, t, u } = b;
    t += Math.floor(u / 10); u %= 10;
    h += Math.floor(t / 10); t %= 10;
    return { h, t, u };
  }
  const esteCanonic = b => b.u < 10 && b.t < 10 && (b.h < 10 || (b.h === 10 && b.t === 0 && b.u === 0));
  const cmp = (a, b) => a < b ? "<" : a > b ? ">" : "=";
  const parImpar = n => n % 2 === 0 ? "par" : "impar";
  const vecini = n => [n - 1, n + 1].filter(x => x >= 0 && x <= 1000);

  /* expresia pe ordine: 300 + 40 + 5 = 345 */
  function descompunere(b) {
    const v = valoare(b), parts = [];
    if (b.h) parts.push(String(b.h * 100));
    if (b.t) parts.push(String(b.t * 10));
    if (b.u) parts.push(String(b.u));
    return parts.length ? parts.join(" + ") + (parts.length > 1 ? " = " + v : "") : "0";
  }
  return { cuvinte, ticks, rotunjeste, valoare, canonic, regrupeaza, esteCanonic, cmp, parImpar, vecini, descompunere, NICE };
})();
