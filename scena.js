/* ============================================================
   scena.js – formatul de „scenă" și biblioteca de elemente grafice
   O scenă este un obiect JSON, independent de ecran (spațiu 1600 × 900):
     { format:"scena", v:1, id, w:1600, h:900, elemente:[ ... ] }
   Elemente (câmpul t):
     seg   segment         { x,y,len,o:"h"|"v",c:"#hex",l:"etichetă" }
     lin   linie           { x,y,len,o,c,dash:true|false }
     acol  acoladă         { x,y,len,l,f:true|false }   (orizontală)
     txt   etichetă liberă { x,y,s,c,l }                (x,y = centrul)
     ink   scris de mână   { pts:[[x,y],...],c,w }
   Aceeași bibliotecă va fi folosită de whiteboard, de editorul de
   probleme și de player-ul de explicații.
   ============================================================ */
const SC = (() => {
  const W = 1600, H = 900, U = 40, G = U, B = U, T = 18;   // grosimea segmentului = un pătrățel
  const CULORI = [["#e4202d", "Roșu"], ["#e4572e", "Roșu-portocaliu"], ["#f28c28", "Portocaliu"], ["#e09f1f", "Chihlimbar"], ["#f2d024", "Galben"], ["#9acd32", "Verde deschis"], ["#1f9d55", "Verde"], ["#0e7c3a", "Verde închis"], ["#2a9d8f", "Turcoaz"], ["#2bb5c9", "Cyan"], ["#3f6fd1", "Albastru"], ["#1f4fd8", "Albastru intens"], ["#7a5cc7", "Mov"], ["#9b3fb5", "Violet"], ["#c2418b", "Roz"], ["#f58fb1", "Roz deschis"], ["#8b5a2b", "Maro"], ["#6b7280", "Gri"], ["#bcd7f5", "Albastru pal"], ["#c8e6c9", "Verde pal"], ["#ffe0a3", "Galben pal"], ["#f8c9c4", "Roșu pal"], ["#d9d2f2", "Mov pal"], ["#ffffff", "Alb"], ["ink", "Automat (negru pe luminos, alb pe întunecat)"]];
  const esc = s => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const lum = c => { const m = /^#([0-9a-f]{6})$/i.exec(c); if (!m) return 0; const v = parseInt(m[1], 16); return (0.299 * ((v >> 16) & 255) + 0.587 * ((v >> 8) & 255) + 0.114 * (v & 255)) / 255; };
  const INK = "var(--ink,#1d2b4f)";
  /* „ink" = culoarea textului temei; scrisul și liniile vechi (negru / bleumarin) se adaptează și ele */
  const isInk = c => !c || c === "ink" || c === "#1d2b4f" || c === "#111111";
  const colA = c => isInk(c) ? INK : c;
  const segFill = c => c === "ink" ? INK : c;
  const txtCol = c => c === "ink" ? "var(--paper,#f6fbff)" : (lum(c) > .62 ? "#1d2b4f" : "#ffffff");
  const horiz = e => e.o !== "v";
  const FS = 26;   // mărimea numerelor din segment (încap în grosimea de un pătrățel)
  let nid = 0;
  const newId = () => "e" + Date.now().toString(36) + (nid++).toString(36);
  const nou = () => ({ format: "scena", v: 1, id: "sc-" + Date.now().toString(36), w: W, h: H, elemente: [] });

  /* ---------- geometrie ---------- */
  function ext(e) {
    if (e.t === "seg") return horiz(e) ? { x1: e.x, y1: e.y, x2: e.x + e.len, y2: e.y + G } : { x1: e.x, y1: e.y, x2: e.x + G, y2: e.y + e.len };
    if (e.t === "lin") return horiz(e) ? { x1: e.x, y1: e.y, x2: e.x + e.len, y2: e.y } : { x1: e.x, y1: e.y, x2: e.x, y2: e.y + e.len };
    if (e.t === "acol") return horiz(e) ? { x1: e.x, y1: e.y, x2: e.x + e.len, y2: e.y + B } : { x1: e.x, y1: e.y, x2: e.x + B, y2: e.y + e.len };
    if (e.t === "txt") { const s = e.s || 48, w = Math.max(1, String(e.l || "?").length) * s * .62; return { x1: e.x - w / 2, y1: e.y - s * .7, x2: e.x + w / 2, y2: e.y + s * .45 }; }
    if (e.t === "ink") { const xs = e.pts.map(p => p[0]), ys = e.pts.map(p => p[1]); return { x1: Math.min(...xs), y1: Math.min(...ys), x2: Math.max(...xs), y2: Math.max(...ys) }; }
    return { x1: 0, y1: 0, x2: 0, y2: 0 };
  }
  const axisVals = (e, ax) => { if (e.t === "txt" || e.t === "ink") return []; const b = ext(e); return [...new Set(ax === "x" ? [b.x1, b.x2] : [b.y1, b.y2])]; };
  function best(mine, others, tol = T) {
    let r = null;
    for (const m of mine) for (const o of others) { const d = o - m; if (Math.abs(d) <= tol && (r === null || Math.abs(d) < Math.abs(r.d))) r = { d, at: o }; }
    return r;
  }
  /* mutare: lipește capetele de capetele altor elemente (și aliniază rânduri); altfel, pe grilă */
  function snapMove(e, x, y, altele, grid, tol = T) {
    const t = { ...e, x, y }, others = altele.filter(o => o.id !== e.id);
    const ox = [].concat(...others.map(o => axisVals(o, "x"))), oy = [].concat(...others.map(o => axisVals(o, "y")));
    const bx = best(axisVals(t, "x"), ox, tol), by = best(axisVals(t, "y"), oy, tol), r = { x, y, gx: null, gy: null };
    if (bx) { r.x += bx.d; r.gx = bx.at; } else if (grid) r.x = Math.round(x / U) * U;
    if (by) { r.y += by.d; r.gy = by.at; } else if (grid) r.y = Math.round(y / U) * U;
    const b = ext({ ...e, x: r.x, y: r.y });
    if (b.x1 < 0) r.x -= b.x1; if (b.x2 > W) r.x -= b.x2 - W;
    if (b.y1 < 0) r.y -= b.y1; if (b.y2 > H) r.y -= b.y2 - H;
    return r;
  }
  /* redimensionare: poziția capătului tras */
  function snapEnd(e, pos, altele, grid, tol = T) {
    const ax = horiz(e) ? "x" : "y", others = altele.filter(o => o.id !== e.id), vals = [].concat(...others.map(o => axisVals(o, ax)));
    const b = best([pos], vals, tol);
    if (b) return { pos: pos + b.d, g: b.at, ax };
    return { pos: grid ? Math.round(pos / U) * U : pos, g: null, ax };
  }
  function resize(e, end, pos, min = U) {
    const ax = horiz(e) ? "x" : "y", lim = ax === "x" ? W : H, a = e[ax], b = a + e.len;
    pos = Math.max(0, Math.min(lim, pos));
    if (end === "b") e.len = Math.max(min, pos - a);
    else { const na = Math.min(pos, b - min); e[ax] = na; e.len = b - na; }
  }
  /* capătul (a/b) aflat aproape de punctul p, ca să se poată trage direct de capete */
  function nearEnd(e, p, zone = 40) {
    if (e.t !== "seg" && e.t !== "lin" && e.t !== "acol") return null;
    const ax = horiz(e) ? "x" : "y", a = e[ax], b = a + e.len, z = Math.min(zone, e.len / 3), pos = p[ax];
    if (Math.abs(pos - a) <= z) return "a"; if (Math.abs(pos - b) <= z) return "b"; return null;
  }
  function rotate(e) {
    if (e.t === "seg") { const cx = horiz(e) ? e.x + e.len / 2 : e.x + G / 2, cy = horiz(e) ? e.y + G / 2 : e.y + e.len / 2; e.o = horiz(e) ? "v" : "h"; if (horiz(e)) { e.x = cx - e.len / 2; e.y = cy - G / 2; } else { e.x = cx - G / 2; e.y = cy - e.len / 2; } }
    else if (e.t === "acol") { const cx = horiz(e) ? e.x + e.len / 2 : e.x + B / 2, cy = horiz(e) ? e.y + B / 2 : e.y + e.len / 2; e.o = horiz(e) ? "v" : "h"; if (horiz(e)) { e.x = cx - e.len / 2; e.y = cy - B / 2; } else { e.x = cx - B / 2; e.y = cy - e.len / 2; } }
    else if (e.t === "lin") { const cx = horiz(e) ? e.x + e.len / 2 : e.x, cy = horiz(e) ? e.y : e.y + e.len / 2; e.o = horiz(e) ? "v" : "h"; if (horiz(e)) { e.x = cx - e.len / 2; e.y = cy; } else { e.x = cx; e.y = cy - e.len / 2; } }
    const b = ext(e); if (b.x1 < 0) e.x -= b.x1; if (b.y1 < 0) e.y -= b.y1; if (b.x2 > W) e.x -= b.x2 - W; if (b.y2 > H) e.y -= b.y2 - H;
  }
  function elNou(t, n, c) {
    const x = 120 + (n % 6) * U, y = 120 + (n % 8) * 80, id = newId();
    if (t === "seg") return { id, t, x, y, len: 4 * U, o: "h", c, l: "" };
    if (t === "lin") return { id, t, x, y, len: 6 * U, o: "h", c: "ink", dash: false };
    if (t === "ldot") return { id, t: "lin", x, y, len: 6 * U, o: "h", c: "ink", dash: true };
    if (t === "acol") return { id, t, x, y, len: 6 * U, o: "h", l: "?", f: false, c: "ink" };
    return { id, t: "txt", x: x + 80, y: y + 30, s: 56, c: "ink", l: "?" };
  }

  /* ---------- desenare (SVG) ---------- */
  function brace(e) {
    const col = colA(e.c), f = "font-weight:800;font-family:'Baloo 2',sans-serif;pointer-events:none";
    if (horiz(e)) {
      const x = e.x, x2 = e.x + e.len, mx = (x + x2) / 2, y0 = e.y, yb = e.y + B, ym = e.y + B / 2, r = Math.min(26, e.len / 4);
      const d = `M${x} ${yb}Q${x} ${ym} ${x + r} ${ym}L${mx - r} ${ym}Q${mx} ${ym} ${mx} ${y0}Q${mx} ${ym} ${mx + r} ${ym}L${x2 - r} ${ym}Q${x2} ${ym} ${x2} ${yb}`;
      const tr = e.f ? ` transform="translate(0 ${2 * e.y + B}) scale(1 -1)"` : "";
      const ty = e.f ? e.y + B + 36 : e.y - 12;
      return `<g class="el" data-id="${e.id}"><path d="${d}"${tr} style="fill:none;stroke:${col}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}"${tr} style="fill:none;stroke:transparent" stroke-width="40"/><text x="${mx}" y="${ty}" text-anchor="middle" font-size="36" style="fill:${col};${f}">${esc(e.l)}</text></g>`;
    }
    /* verticală: neîntoarsă = vârful spre stânga ( { ), întoarsă = vârful spre dreapta ( } ) */
    const y = e.y, y2 = e.y + e.len, my = (y + y2) / 2, x0 = e.x, xb = e.x + B, xm = e.x + B / 2, r = Math.min(26, e.len / 4);
    const d = `M${xb} ${y}Q${xm} ${y} ${xm} ${y + r}L${xm} ${my - r}Q${xm} ${my} ${x0} ${my}Q${xm} ${my} ${xm} ${my + r}L${xm} ${y2 - r}Q${xm} ${y2} ${xb} ${y2}`;
    const tr = e.f ? ` transform="translate(${2 * e.x + B} 0) scale(-1 1)"` : "";
    const tx = e.f ? e.x + B + 14 : e.x - 14, an = e.f ? "start" : "end";
    return `<g class="el" data-id="${e.id}"><path d="${d}"${tr} style="fill:none;stroke:${col}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}"${tr} style="fill:none;stroke:transparent" stroke-width="40"/><text x="${tx}" y="${my}" text-anchor="${an}" dominant-baseline="central" font-size="36" style="fill:${col};${f}">${esc(e.l)}</text></g>`;
  }
  function desen(e) {
    if (e.t === "seg") {
      const b = ext(e), cx = (b.x1 + b.x2) / 2, cy = (b.y1 + b.y2) / 2, l = String(e.l ?? "");
      const rect = `<rect x="${b.x1}" y="${b.y1}" width="${b.x2 - b.x1}" height="${b.y2 - b.y1}" rx="5" style="fill:${segFill(e.c)};stroke:${INK}" stroke-width="3"/>`;
      let txt = "";
      if (l) {
        const w = l.length * FS * .66, fits = horiz(e) ? w <= e.len - 14 : w <= G - 8;
        const f = "font-weight:800;font-family:'Baloo 2',sans-serif;pointer-events:none";
        if (fits) txt = `<text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central" font-size="${FS}" style="fill:${txtCol(e.c)};${f}">${esc(l)}</text>`;
        else if (horiz(e)) txt = `<text x="${cx}" y="${b.y1 - 12}" text-anchor="middle" font-size="${FS + 6}" style="fill:${INK};${f}">${esc(l)}</text>`;
        else txt = `<text x="${b.x2 + 14}" y="${cy}" text-anchor="start" dominant-baseline="central" font-size="${FS + 6}" style="fill:${INK};${f}">${esc(l)}</text>`;
      }
      return `<g class="el" data-id="${e.id}">${rect}${txt}</g>`;
    }
    if (e.t === "lin") {
      const b = ext(e);
      return `<g class="el" data-id="${e.id}"><line x1="${b.x1}" y1="${b.y1}" x2="${b.x2}" y2="${b.y2}" style="stroke:${colA(e.c)}" stroke-width="${e.dash ? 7 : 5}" stroke-linecap="round"${e.dash ? ' stroke-dasharray="1 16"' : ""}/><line x1="${b.x1}" y1="${b.y1}" x2="${b.x2}" y2="${b.y2}" style="stroke:transparent" stroke-width="40"/></g>`;
    }
    if (e.t === "acol") return brace(e);
    if (e.t === "txt") {
      const b = ext(e);
      return `<g class="el" data-id="${e.id}"><rect x="${b.x1}" y="${b.y1}" width="${b.x2 - b.x1}" height="${b.y2 - b.y1}" style="fill:transparent"/><text x="${e.x}" y="${e.y}" text-anchor="middle" font-size="${e.s || 48}" font-weight="800" style="fill:${colA(e.c)};font-family:'Baloo 2',sans-serif;pointer-events:none">${esc(e.l)}</text></g>`;
    }
    if (e.t === "ink") return `<path class="ink" data-id="${e.id}" d="M${e.pts.map(p => p[0] + " " + p[1]).join("L")}" style="fill:none;stroke:${colA(e.c)}" stroke-width="${e.w || 6}" stroke-linecap="round" stroke-linejoin="round"/>`;
    return "";
  }
  /* desenează o scenă întreagă, doar pentru afișare (explicații, previzualizări) */
  function svg(scena, o = {}) {
    const els = scena.elemente, ord = [...els.filter(e => e.t !== "ink"), ...els.filter(e => e.t === "ink")];
    return `<svg viewBox="0 0 ${scena.w || W} ${scena.h || H}" style="width:100%;height:auto;display:block">${o.fundal ? `<rect width="${W}" height="${H}" style="fill:${o.fundal}"/>` : ""}${ord.map(desen).join("")}</svg>`;
  }
  return { W, H, U, G, B, T, CULORI, esc, txtCol, isInk, horiz, nou, ext, snapMove, snapEnd, resize, nearEnd, rotate, elNou, desen, svg, newId };
})();
