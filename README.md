<h1 align="center">
  <a href="https://altapi.kpostek.dev/" target="blank"><img src="https://github.com/pjatk21/alt-api/blob/main/.github/assets/Screenshot%202022-02-21%20at%2016.24.13.png?raw=true" width="320" alt="Altapi Logo" /></a>
</h1>

Alternatywne API dla stron PJATK, otwarte, szybkie i troszkę niestabilne...

## Uruchamianie

### Klasycznie

Wymagania:
 - MongoDB
 - Nodejs w wersji 16.x
 - [`pja-scrapper`](https://github.com/pjatk21/pja-scrapper)
 - yarn (opcjonalnie)

```
yarn install && yarn start
```

lub dla npm

```
npm install -D && npm start
```

### W dockerze

Wymagania:
 - Docker
 - `docker-compose`

```
docker-compose up
```

## Selfhosting

Dla `pja-scrapper` zmień zmienną środowiskową `ALTAPI_URL` na URL twojego serwera altapi. Możliwe, że ten URL będzie trzeba zmienić w aplikacjach.

## Wydajność
No cache, TTFB (dla dnia 07-03-2022):
 - Orginalny plan zajęć: ~1950ms
 - Altapi: 130.20ms

Werdykt: Altapi jest ok. 15 razy szybsze niż orginalny plan zajęć.
