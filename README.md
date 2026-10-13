# Check-off kalender

Statische kalender voor oktober t/m december 2026. Geen build, geen backend.

- **Datums aanpassen:** `events.js`
- **Plaatjes:** emoji, `"mijter"`, `"geenschool"`, of een bestand in `img/`
- **Lokaal bekijken:** dubbelklik `index.html`

## Publiceren op GitHub Pages

1. Maak een (privé-)account aan op https://github.com en log in.
2. Klik rechtsboven op **+ → New repository**. Naam: `kalender`, zichtbaarheid **Public**
   (GitHub Pages is gratis voor publieke repo's), geen README/.gitignore toevoegen.
3. In de terminal, in deze map:
   ```
   git remote add origin https://github.com/<JOUW-GEBRUIKERSNAAM>/kalender.git
   git push -u origin main
   ```
   (GitHub vraagt om inloggen; gebruik een Personal Access Token met `repo`-rechten als wachtwoord,
   of installeer `gh` en doe `gh auth login`.)
4. In de repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
   branch `main`, map `/ (root)` → **Save**.
5. Na ~1 minuut staat de site op `https://<JOUW-GEBRUIKERSNAAM>.github.io/kalender/`.

## Op de iPad
Open die URL in Safari → Deel-knop → **Zet op beginscherm**.

Let op: afgevinkte dagen staan in de browser van die iPad, gekoppeld aan de URL.
Kies dus eerst de definitieve URL en vink daarna pas dagen af.

## Datums later aanpassen
Open `events.js` op github.com → potloodje → wijzig → **Commit changes**. Binnen een minuut live.

## Toegangscode (gordijntje)
`gate.js` vraagt eenmalig om een code en onthoudt die in localStorage.
- Code wijzigen: pas `SECRET` bovenin `gate.js` aan.
- Eenmalig openen via link: `https://<site>/#k=<code>`
- Dit is geen echte beveiliging: de code en `events.js` staan in de publieke repo.
- Op de iPad: eerst **Zet op beginscherm**, dan de app vanaf het beginscherm openen en
  de code daar invullen. De app op het beginscherm heeft eigen opslag, los van Safari.

## Event-types
Elk event in `events.js` heeft een `type`: `"regular"` (klein regeltje), `"holiday"` (vakantie)
of `"priority"` (valt het meest op en wint van holiday). Optioneel `style: "snow"` voor sneeuw.
