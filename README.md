# Matematică pe tablă – clasa a II-a

Aplicație pentru tabla Smart. Pagina principală (`index.html`) este un meniu către toate paginile.

## Pagini
| Pagină | Adresă | Rol |
|---|---|---|
| Meniu | `index.html` | Pagina principală, cu butoane către celelalte pagini |
| Whiteboard | `whiteboard.html` | Tablă de desen: segmente, linii, acolade, etichete, creion |
| Numere | `numere.html` | Axa numerelor (marcaje, salturi, ascunderea numerelor) și blocuri pentru sute, zeci, unități (regrupare, comparare, rotunjire) |
| Flipchart | `flipchart.html` | Foi de scris și de desenat (segmente, linii, săgeți, acolade, text, forme), cu colțuri pentru foaia următoare / anterioară, bandă de miniaturi, zoom și prezentare |
| Probleme | `probleme.html` | Rezolvarea problemelor pe metode, cu explicații animate și voce |
| Administrare | `admin.html` | Crearea problemelor și exportul lui `probleme.js` |

Fiecare pagină are butonul „🏠 Acasă” și comutatorul de temă (Automat / Luminos / Întunecat).
Pagini noi se adaugă în lista `PAGINI` din `index.html`.

## Fișiere de cod (comune)
| Fișier | Rol |
|---|---|
| `probleme.js` | Lista problemelor (se înlocuiește după fiecare export din administrare) |
| `tipuri.js` | Tipurile de probleme (metodele de rezolvare) |
| `motor.js` | Partea comună pentru probleme: desenele pașilor, calcule |
| `scena.js` | Formatul de scenă și elementele grafice ale whiteboardului |
| `asistent.js` | Cerculețul asistent și panoul învățătorului (texte pe metode, 3 trepte de ajutor) |
| `numere.js` | Logica paginii „Numere”: numerele cu litere, gradarea axei, rotunjire, regrupare |
| `uisize.js` | Mărimea uneltelor (10%–150%), comună paginilor cu bară de unelte |
| `tema.js` | Comutatorul de temă, comun tuturor paginilor |
| `.nojekyll` | Fișier gol, cerut de GitHub Pages |

Toate fișierele trebuie să stea în același folder.

## Publicare pe GitHub Pages
1. Cont gratuit pe github.com.
2. New repository, nume (ex: `matematica-tabla`), **Public**, Create.
3. Dezarhivați `matematica-tabla.zip`: rezultă un folder `matematica-tabla`. Add file, Upload files: trageți **conținutul folderului** (toate fișierele, inclusiv `.nojekyll`, nu folderul în sine), apoi Commit changes.
4. Settings, Pages, Build and deployment: Source **Deploy from a branch**, Branch `main`, folder `/ (root)`, Save.
5. După 1–10 minute: `https://NUME-UTILIZATOR.github.io/matematica-tabla/` (se deschide meniul).

## Actualizarea problemelor
Administrare, Exportă probleme.js, Copiază; în GitHub deschideți `probleme.js`, Edit (creionul), lipiți codul, Commit changes.
Problemele nepublicate încă se pot vedea pe tablă la `probleme.html#ciorna` (același browser).

## Mărimea uneltelor
Browserul nu poate afla diagonala ecranului, așa că mărimea barelor de unelte se reglează manual: Meniu ⋯ → **Mărimea uneltelor** (glisor de la 10% la 150%, plus butoane rapide 50 / 75 / 100 / 125%). La pagina de probleme, butonul **Aa** din bara de jos. Scara se aplică la eliberarea glisorului, se reține pe fiecare dispozitiv și afectează bara de unelte, mini-bara, ferestrele mici, colțurile flipchartului și asistentul. Butonul de meniu nu coboară sub 50%, ca să poată fi atins oricând. Foaia și obiectele nu se scalează.

## Numere: folosire
- **Axa numerelor:** intervale 0–10, 0–20, 0–100, 0–1000 sau orice interval între 0 și 1000. Marcaje (atingere pe axă, apoi tragere), salturi (butoane +/− sau tragere de la un număr la altul, cu unealta „Salt”), „Din k în k”, ascunderea numerelor (atingeți o etichetă ca să o dezvăluiți) și vecinii unui număr.
- **Blocuri:** coloane Sute / Zeci / Unități, cu blocuri sau jetoane. Schimbarea manuală a 10 unități cu 1 zece (și invers), regrupare automată opțională, număr scris cu cifre, descompus și cu litere, informații (par/impar, vecini, rotunjire la zeci și sute), „Pune numărul…”, ascunderea numărului și compararea a două numere.
- Starea se păstrează cât timp rămâne deschisă fereastra browserului.

## Flipchart: folosire
- **Scris:** creion, marker transparent și radieră (pe porțiuni sau trăsătură întreagă), cu 8 culori plus orice altă culoare.
- **Obiecte:** Segment, Linie, Săgeată, Acoladă, Text, Dreptunghi și Elipsă. Se desenează trăgând pe foaie și **unealta rămâne activă**, ca să desenați mai multe la rând. Segmentele se lipesc de capetele celorlalte (și de pătrățele, dacă foaia are fundal cu pătrățele). Liniile se îndreaptă singure când sunt aproape orizontale, verticale sau la 45°.
- **Alege** (butonul închis la culoare, mereu în bară): atingeți un obiect ca să-l selectați; trageți de mijloc ca să-l mutați și de capete (sau de mânerele galbene) ca să-l redimensionați. O atingere deschide mini-bara (culoare, etichetă, lungime, rotire, umplere, adu în față / în spate, duplicare, ștergere). Trăgând pe foaia goală încercuiți mai multe obiecte (și scris) și le mutați, recolorați sau ștergeți împreună.
- **Text:** atingeți foaia, scrieți în fereastra mică (și apăsați Gata). Textul gol se șterge.
- **Radiera** șterge doar scrisul. Din meniul ⋯ se poate activa „Radiera șterge și obiectele”.
- **Zoom:** ciupire cu două degete, butoanele − / + sau rotița mouse-ului; butonul „Mână” deplasează foaia mărită. Procentul readuce foaia întreagă.
- **Prezentare** (butonul ⛶): ascunde bara de unelte și banda de foi; ✕ iese din prezentare.
- **Foi:** colțul din dreapta jos trece la foaia următoare sau adaugă una nouă (pulsează când scrisul ajunge în colț); colțul din stânga jos întoarce foaia. Banda de miniaturi (stânga, jos sau ascunsă) permite saltul direct.
- Foile se păstrează cât timp rămâne deschisă fereastra browserului, inclusiv la reîncărcarea paginii. Pentru păstrare mai lungă: Meniu ⋯ → Salvează / Încarcă (JSON).
- Dacă se folosește stiloul, atingerile cu palma sunt ignorate la scris.

## Asistentul din pagina de probleme
- Cerculețul 💡 din colț oferă ajutor în 3 trepte: întrebare, indiciu despre instrument, primul pas. Vocea citește textul doar când cineva atinge cerculețul.
- Panoul **Învățător** (butonul mic din stânga-jos) arată metoda recomandată de programă, alte metode acceptate, competențele și setările asistentului: Oprit / La cerere / Automat (implicit, cerculețul pulsează după 90 s fără atingeri, maximum 3 ori pe problemă), pauză 5 minute, oprire pe o problemă. Un punct roșu semnalează „elevul pare blocat”.
- Observațiile („a ales singur / a primit un indiciu / a avut nevoie de ajutor”) sunt doar numărători pe problemă, fără nume, salvate în browser.
- Textele se află în `asistent.js` (obiectul METODE) și provin din documentul de texte.

## Whiteboard: folosire
- Tabla rămâne liberă: **atingeți un element** ca să apară mini-bara de lângă el (culoare, etichetă, lungime, rotire, duplicare, ștergere). Tragerea unui element nu deschide nimic.
- **Zoom:** ciupire cu două degete, butoanele − / + din bara de sus, rotița mouse-ului. Butonul cu procent (ex. 100%) readuce tabla întreagă. Cu un deget pe fundal gol, tabla se deplasează.
- **Bara de unelte se poate muta sus sau jos** cu butonul ▼ / ▲ de lângă meniul „⋯” (utilă pe table mari). Poziția se reține.
- Meniul „⋯” conține grila, lungimea liberă, ascunderea paletei de elemente, salvarea, ștergerea totală și tema.

## Whiteboard: scena
Desenul se salvează ca JSON (butonul „Salvează / Încarcă”), într-un spațiu de 1600 × 900 de unități, independent de ecran. Se salvează și automat, în browserul curent.
