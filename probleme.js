/* ============================================================
   probleme.js – lista de probleme (adăugați problemele noi din administrare)
   Fiecare problemă are un „tip", care alege metoda de rezolvare și felul
   în care arată pe tablă. Tipuri: grupe, calcul, grupare, bare, tabel,
   sir, invers, balanta.
   Câmpuri comune: id, eticheta, tip, enunt, optiuni, raspuns, program (coduri),
                   metode (metode suplimentare scrise de mână), ajustari
   ============================================================ */
const PROBLEME = [
  {
    id: "42", eticheta: "42", tip: "grupe",
    enunt: "Sisi a împărțit numerele <b>1, 2, 3, 4, 5 și 6</b> în 3 grupe. În fiecare grupă sunt câte 2 numere. Suma numerelor din prima grupă este <b>8</b>, iar cea din a doua grupă este <b>9</b>. Care sunt cele două numere din a treia grupă?",
    optiuni: "A) 4 și 2   B) 3 și 5   C) 2 și 6   D) 3 și 1   E) 4 și 6", raspuns: "D) 3 și 1",
    numere: [1, 2, 3, 4, 5, 6], sume: [8, 9, null], intrebare: "pereche",
    program: ["1.4", "1.5", "1.6", "4.1", "5.2"],
    metode: [{
      nume: "Metoda 2: încercări",
      pasi: [
        { text: "Căutăm perechile care dau 8. Avem 2 plus 6 și 3 plus 5. Perechea 1 plus 7 nu merge, pentru că nu avem numărul 7.", viz: [[{ p: [2, 6], e: "= 8", ok: true }, { p: [3, 5], e: "= 8", ok: true }, { p: [1, 7], e: "= 8", ok: false }]] },
        { text: "Acum căutăm perechile care dau 9. Avem 3 plus 6 și 4 plus 5.", viz: [[{ p: [3, 6], e: "= 9", ok: true }, { p: [4, 5], e: "= 9", ok: true }]] },
        { text: "Încercăm: dacă prima grupă este 3 plus 5, a doua ar fi 3 plus 6 sau 4 plus 5. Dar fiecare număr se folosește o singură dată, iar amândouă perechile au un număr deja luat. Nu se poate!", viz: [[{ p: [3, 5], e: "= 8", ok: true }, "→", { p: [3, 6], e: "= 9", ok: false }, "sau", { p: [4, 5], e: "= 9", ok: false }]] },
        { text: "Deci prima grupă este 2 plus 6. A doua nu poate fi 3 plus 6, pentru că 6 este luat. Rămâne 4 plus 5.", viz: [[{ p: [2, 6], e: "= 8", ok: true }, { p: [3, 6], e: "= 9", ok: false }, { p: [4, 5], e: "= 9", ok: true }]] },
        { text: "Au rămas numerele 1 și 3. A treia grupă este 3 și 1. Proba: 1 plus 3 egal 4, iar 8 plus 9 plus 4 egal 21.", viz: [[{ p: [2, 6], e: "= 8", ok: true }, { p: [4, 5], e: "= 9", ok: true }, { p: [1, 3], e: "= 4", ok: true }], ["8", "+", "9", "+", "4", "=", "21"]], aplica: true }
      ]
    }]
  },
  {
    id: "A", eticheta: "A", tip: "grupe",
    enunt: "Numerele <b>1, 2, 3, 4, 5 și 6</b> se împart în 3 grupe a câte 2 numere. Suma primei grupe este <b>5</b>, iar suma celei de-a doua grupe este <b>11</b>. Ce sumă are a treia grupă?",
    numere: [1, 2, 3, 4, 5, 6], sume: [5, 11, null], intrebare: "suma",
    program: ["1.4", "1.6", "5.2"]
  },
  {
    id: "B", eticheta: "B", tip: "grupe",
    enunt: "Numerele <b>1, 2, 3, 4, 5, 6, 7 și 8</b> se împart în 4 grupe a câte 2 numere. Primele trei grupe au suma <b>9</b> fiecare. Ce sumă are a patra grupă?",
    numere: [1, 2, 3, 4, 5, 6, 7, 8], sume: [9, 9, 9, null], intrebare: "suma",
    program: ["1.4", "1.5", "1.6"]
  },
  {
    id: "21.32", eticheta: "21.32", tip: "calcul",
    enunt: "Albă-ca-Zăpada și cei șapte pitici aveau fiecare câte o farfurie, dar au mai cumpărat încă 15 de rezervă. Câte farfurii au acum?",
    optiuni: "A) 22   B) 32   C) 33   D) 23   E) 24", raspuns: "D) 23",
    operatii: ["1 + 7 | Câte farfurii aveau?", "R + 15 | Câte farfurii au acum?"],
    program: ["1.4", "5.2"]
  },
  {
    id: "21.33", eticheta: "21.33", tip: "grupare",
    enunt: "Diana are două surori și un frate. Mama lor le-a cumpărat tuturor câte două tricouri. Câte tricouri a cumpărat mama în total?",
    optiuni: "A) 4   B) 5   C) 6   D) 8   E) 9", raspuns: "D) 8",
    grupe: 4, inGrupa: 2, total: null, obiect: "tricouri", simbol: "👕",
    program: ["1.5", "5.2"]
  },
  {
    id: "E1", eticheta: "E1", tip: "bare",
    enunt: "Ana are 23 de mărgele. Camelia are cu 12 mărgele mai multe decât Ana. Câte mărgele are Camelia? (problemă-exemplu)",
    numeA: "Ana", valA: 23, numeB: "Camelia", valB: null, dif: 12, maiMult: "B", unitate: "mărgele",
    program: ["1.4", "1.6", "5.2"]
  },
  {
    id: "21.30", eticheta: "21.30", tip: "tabel",
    enunt: "Olivia locuiește în casă cu părinții ei, fratele ei, un papagal, un iepuraș și doi căței. Câte picioare au împreună?",
    optiuni: "A) 22   B) 24   C) 20   D) 26   E) 18", raspuns: "A) 22",
    antet: "Ființe; Câte sunt; Picioare la fiecare",
    randuri: ["Oameni; 4; 2", "Papagal; 1; 2", "Iepuraș; 1; 4", "Căței; 2; 4"], totaluri: "produs",
    program: ["5.1", "5.2", "1.5"]
  },
  {
    id: "18.39", eticheta: "18.39", tip: "sir",
    enunt: "Găsește regula și află numărul care lipsește din următorul șir: 3, 4, 5, 12, 21, □, 71, 130",
    optiuni: "A) 36   B) 38   C) 42   D) 46   E) 53", raspuns: "B) 38",
    sir: [3, 4, 5, 12, 21, null, 71, 130], regula: "suma3",
    program: ["3.1"]
  },
  {
    id: "16.14", eticheta: "16.14", tip: "invers",
    enunt: "Mă gândesc la un număr. Scad din el 25, apoi adaug 12, iar din rezultat scad 16 și obțin 20. La ce număr m-am gândit?",
    optiuni: "A) 49   B) 24   C) 36   D) 41   E) 26", raspuns: "A) 49",
    operatii: ["-25", "+12", "-16"], rezultat: 20,
    program: ["1.4", "1.6", "5.2"]
  },
  {
    id: "18.38", eticheta: "18.38", tip: "balanta",
    enunt: "Dacă a + a = 8, b + b + b = 9 și c + c + 1 = 5, atunci a + b + c este egal cu:",
    optiuni: "A) 10   B) 13   C) 11   D) 9   E) 8", raspuns: "D) 9",
    ecuatii: ["a + a = 8", "b + b + b = 9", "c + c + 1 = 5"], expresie: "a + b + c",
    program: ["1.6", "5.2"]
  }
];
