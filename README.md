<div align="center">
  <img width="340" alt="AltapiHeading" src="https://user-images.githubusercontent.com/30326322/156919789-c4132a16-dc5d-4d17-a13d-02d74a8360f8.png">
  <p>Twórz zapytania do planu zajęć PJATK w ciągu milisekund. Dobra alternatywa dla oryginalnej strony z 2010.</p>
  <img alt="GitHub Workflow Status (branch)" src="https://img.shields.io/github/workflow/status/pjatk21/alt-api/Docker%20CI/main">
  <a href="https://codeclimate.com/github/pjatk21/alt-api"><img alt="Code Climate maintainability" src="https://img.shields.io/codeclimate/maintainability/pjatk21/alt-api"></a>
  <a href="https://codeclimate.com/github/pjatk21/alt-api"><img alt="Code Climate technical debt" src="https://img.shields.io/codeclimate/tech-debt/pjatk21/alt-api"></a>
  <a href="https://github.com/pjatk21/alt-api/search?l=typescript&type=code"><img alt="GitHub top language" src="https://img.shields.io/github/languages/top/pjatk21/alt-api"></a>
  <a href="https://github.com/pjatk21/alt-api/commits/main"><img alt="GitHub commit activity" src="https://img.shields.io/github/commit-activity/m/pjatk21/alt-api"></a>
  <a href="https://wakatime.com/badge/user/304093ee-926f-40f9-980c-65ea3d5a15b7/project/26f543df-5e37-4313-b4c3-42e9216cded4"><img src="https://wakatime.com/badge/user/304093ee-926f-40f9-980c-65ea3d5a15b7/project/26f543df-5e37-4313-b4c3-42e9216cded4.svg" alt="wakatime"></a>
</div>

## Różnice względem oryginalnego planu

- Nowoczesna i szybka aplikacja webowa

- ICS Feed (zamiast pojedyńczych plików ICS)

- JSON API wraz z dokumentacją OpenAPI

- Bardzo szybki czas odpowedzi w porównaniu do orginalnego planu zajęć

### Aplikacja
[<img width="90" alt="AltapiIcon_192" src="https://user-images.githubusercontent.com/30326322/161425352-c9ddceba-d6ea-4437-a9e4-d2da3a12ffbc.png">](https://altapi.kpostek.dev/app)

Moja implementacja vs. implementacja uczelni

<div align="center">
  <img height="520" src="https://user-images.githubusercontent.com/30326322/161425539-9ad1e72d-2286-4199-8ad9-1b2eb902be32.png">
  <img height="520" src="https://user-images.githubusercontent.com/30326322/161425665-6558cfe1-f483-4d81-a3e5-28f61217e32b.png">
  <img height="520" src="https://user-images.githubusercontent.com/30326322/161425698-60944d76-f539-462e-9fe7-d5c759073fea.png">
  <img height="520" src="https://user-images.githubusercontent.com/30326322/161425700-828644da-7afe-4608-8034-275ece33501d.png">
</div>

### ICS Feed

Główną różnicę z tym co dostarcza stara stronka, jest możliwość subskrybowania kalendarza. Wtedy każda zmiana jest automatycznie aktualizowana w aplikacji kalendarza bez potrzeby ponownego wgrania planu zajęć.

Również same dane dostarczane przez usługę się różnią:

![Screenshot 2022-04-03 at 13 32 18](https://user-images.githubusercontent.com/30326322/161425838-889c892d-3d58-4aef-9dff-f13656bc1b7f.png)


> Po prawej znajdują się wydarzenia dostarczone przez `altapi`, a po lewej te dostarczone przez stronę PJATKa

### JSON API

API potrafi odpowiadać na zapytania w stylu *"jakie są zajęcia w planie dla grup x, y, z od dnia do dnia"* lub *"jakie są zajęcia dla wykładowcy x danego dnia"*

Wszystkie endpointy związane z planem zajęć są udokumentowane [tutaj](https://altapi.kpostek.dev/redoc). Jeżeli chcesz potestować sobie ręcznie to polecam pobrać sobie z dokumentacji `OpenAPI schema` i testować zapytania sobie w programie typu Insomnia.

### Wydajność

Po prostu jest szybciej.

Mój timing (infrastruktura infotmatyczna warta 300-400 pln + cloudflare), timing uczelnianego serwera (infrastruktura informatyczna warta spokojnie z mln pln)

<div align="center">
  
  <img src="https://user-images.githubusercontent.com/30326322/161426061-eb376e03-0689-4f95-8b4d-cab0f0f61a6d.png">
  <img src="https://user-images.githubusercontent.com/30326322/161426185-99509af7-321c-40a3-b292-3b61ce8b3843.png">

</div>

> Ciekawostka: W środowisku developerskim udało mi się osiągnąć requesty na poziomie 2.3ms, co daje 391x szybsze zapytania niż oryginalna usługa

## Uruchamianie

### W dockerze

Wymagania:

- Docker
- `docker-compose`

```
docker-compose up
```

## Rozwój projektu

 - Wszystkie zmiany będą akceptowane o ile zostaną wcześniej sformatowane przy pomocy prettier i eslint nie ma zastrzeń
 - Akceptowane są ***wszystkie*** technologie o ile jest możliwość ich implementacji poprzez WASI lub inaczej "natywnie" w Node.js >= 16.x
    - Oczywiście, również jest wymagane dodanie typowania dla TS
 - Zmiany wprowadzone przez spoełeczność nie muszą (ale mogą) być wspierane przez autorów
 - Wymagane jest używanie yarn
 - Można dodawać koeljne dependecies do package.json i do docker-compose.yml
