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
  config.json        – peker på live-endepunkt + fallback
  git.json           – git-cheats som kort
  tools.json         – hurtigverktøylenker
scripts/
  app.js             – laster JSON og renderer UI
styles/
  main.css           – CodeFront-spesifikke tweaks
```

## MVP-funksjoner
- **Nyhetsmiks**: prøver først `news-dev-hub` (konfigureres i `data/config.json`),
  og faller tilbake til `data/feed.json`.
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
1. (Valgfritt) Start backend (`news-dev-hub/backend npm run dev`) for live-feed.
2. Åpne `index.html` i nettleser. All logikk kjører i klienten. Endre JSON-filer og refreshe siden.
   Når backend kjører lokalt, CodeFront henter feeden fra `http://localhost:4010/api/feed`.

## Deploy
Push til `main` – GitHub Pages server `main`-roten.
