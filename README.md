# Matematică pe tablă – clasa a II-a

Aplicație pentru tabla Smart, cu trei părți:
1. **Whiteboard** (`whiteboard.html`): tablă de desen cu segmente, linii, acolade, etichete și creion.
2. **Rezolvarea problemelor** (`index.html`): probleme pe tipuri (metode), cu explicații animate și voce.
3. **Administrare** (`admin.html`): crearea problemelor și exportul lui `probleme.js`.

## Fișiere
| Fișier | Rol |
|---|---|
| `index.html` | Tabla pentru copii (pagina principală) |
| `whiteboard.html` | Whiteboard cu elemente grafice (segmente etc.) |
| `admin.html` | Administrare probleme |
| `probleme.js` | Lista problemelor (se înlocuiește după fiecare export din administrare) |
| `tipuri.js` | Tipurile de probleme (metodele de rezolvare) |
| `motor.js` | Partea comună pentru probleme: desenele pașilor, calcule |
| `scena.js` | Formatul de scenă și elementele grafice ale whiteboardului |
| `tema.js` | Comutatorul de temă (automat / luminos / întunecat), comun tuturor paginilor |
| `.nojekyll` | Fișier gol, cerut de GitHub Pages |

Toate fișierele trebuie să stea în același folder.

## Publicare pe GitHub Pages
1. Cont gratuit pe github.com.
2. New repository, nume (ex: `matematica-tabla`), **Public**, Create.
3. Add file, Upload files: trageți toate fișierele din arhivă (inclusiv `.nojekyll`), apoi Commit changes.
4. Settings, Pages, Build and deployment: Source **Deploy from a branch**, Branch `main`, folder `/ (root)`, Save.
5. După 1–10 minute: `https://NUME-UTILIZATOR.github.io/matematica-tabla/`
   Whiteboard: `.../whiteboard.html` · Administrare: `.../admin.html`

## Actualizarea problemelor
Administrare, Exportă probleme.js, Copiază; în GitHub deschideți `probleme.js`, Edit (creionul), lipiți codul, Commit changes.

## Whiteboard: scena
Desenul de pe whiteboard se salvează ca JSON (butonul „Salvează / Încarcă"), într-un spațiu de 1600 × 900 de unități, independent de ecran. Se salvează și automat, în browserul curent.
