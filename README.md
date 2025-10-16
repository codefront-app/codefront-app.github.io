# CodeFront

Rolig startside for utviklere. CodeFront samler nyhetsfeeds, git-hurtigkort og verktøysnarveier i én statisk GitHub Pages-app.

## Struktur

```
index.html
assets/
  styles/
    base.css         – mørk kontrollrom-palett og reset
    components.css   – hero, seksjoner, feedkort, knapper
  scripts/
    utils.js         – små hjelpefunksjoner (datoformat, DOM)
data/
  feed.json          – cachede feed-poster (HN/Reddit/Tek.no)
  git.json           – git-cheats som kort
  tools.json         – hurtigverktøylenker
scripts/
  app.js             – laster JSON og renderer UI
styles/
  main.css           – CodeFront-spesifikke tweaks
```

## MVP-funksjoner
- **Nyhetsmiks**: `data/feed.json` vises som én rolig feedliste.
- **Git-cheats**: Kort med kommando, kategori og forklaring.
- **Hurtigverktøy**: Knapper til regex/json/cron/diff eller egne favoritter.

## Videre roadmap
- Hurtigfiltre (AI/Frontend/Backend/DevOps) som filter-chips over feeden.
- Daglig teller: "Les 2/dag" + enkel streak.
- Cache/oppdateringsskript som henter feeds og skriver til `data/*.json`.
- Personlige snarveier (lagres i localStorage) og søk etter favoritter.
- Miniredaktør i Warpedev-huben for å oppdatere `data/*.json` herfra.
- Delte komponenter/stiler via Warpedev-assets slik at looks holdes synkron.

## Lokal testing
Bare åpne `index.html` i nettleser. All logikk kjører i klienten. Endre JSON-filer og refreshe siden.

## Deploy
Push til `main` – GitHub Pages server `main`-roten.
