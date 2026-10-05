# Matematică pe tablă – clasa a II-a

Aplicație pentru tabla Smart: învățătorul prezintă probleme, copiii interacționează,
iar explicația se rulează animat, cu voce.

## Fișiere
| Fișier | Rol |
|---|---|
| `index.html` | Tabla pentru copii (aceasta este pagina principală) |
| `admin.html` | Administrare: creați și editați probleme, exportați `probleme.js` |
| `probleme.js` | Lista problemelor (se înlocuiește după fiecare export din administrare) |
| `tipuri.js` | Cele 8 tipuri de probleme (metode de rezolvare) |
| `motor.js` | Partea comună: desenele pașilor, calcule |
| `.nojekyll` | Fișier gol, cerut de GitHub Pages ca să servească fișierele ca atare |

Cele 5 fișiere (`index.html`, `admin.html`, `probleme.js`, `tipuri.js`, `motor.js`) trebuie să stea în același folder.

## Publicare pe GitHub Pages
1. Cont gratuit pe github.com.
2. New repository → nume (ex: `matematica-tabla`) → **Public** → Create.
3. Add file → Upload files → trageți fișierele din arhivă (inclusiv `.nojekyll`) → Commit changes.
4. Settings → Pages → Build and deployment → Source: **Deploy from a branch** → Branch: `main`, folder `/ (root)` → Save.
5. După 1–10 minute, aplicația este la: `https://NUME-UTILIZATOR.github.io/matematica-tabla/`
   Administrarea este la: `.../admin.html`

## Adăugarea de probleme noi
1. Deschideți `.../admin.html`, creați problemele, apăsați **Exportă probleme.js** și copiați codul.
2. În GitHub: deschideți `probleme.js` → creionul (Edit) → ștergeți tot, lipiți codul nou → Commit changes.
3. După un minut, `index.html` afișează problemele noi.
