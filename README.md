# Matematică pe tablă – clasa a II-a

Aplicație pentru tabla Smart. Pagina principală (`index.html`) este un meniu către toate paginile.

## Pagini
| Pagină | Adresă | Rol |
|---|---|---|
| Meniu | `index.html` | Pagina principală, cu butoane către celelalte pagini |
| Whiteboard | `whiteboard.html` | Tablă de desen: segmente, linii, acolade, etichete, creion |
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

## Whiteboard: folosire
- Tabla rămâne liberă: **atingeți un element** ca să apară mini-bara de lângă el (culoare, etichetă, lungime, rotire, duplicare, ștergere). Tragerea unui element nu deschide nimic.
- **Zoom:** ciupire cu două degete, butoanele − / + din bara de sus, rotița mouse-ului. Butonul cu procent (ex. 100%) readuce tabla întreagă. Cu un deget pe fundal gol, tabla se deplasează.
- Meniul „⋯” conține grila, lungimea liberă, ascunderea paletei de elemente, salvarea, ștergerea totală și tema.

## Whiteboard: scena
Desenul se salvează ca JSON (butonul „Salvează / Încarcă”), într-un spațiu de 1600 × 900 de unități, independent de ecran. Se salvează și automat, în browserul curent.
