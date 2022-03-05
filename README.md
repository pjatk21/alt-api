# Altapi

Twórz zapytania do planu zajęć PJATK w ciągu milisekund. Dobra alternatywa dla orginalnej strony z 2010.

## Feature'y

- JSON API wraz z dokumentacją OpenAPI

- ICS Feed

- Bardzo szybki czas odpowedzi w porównaniu do orginalnego planu zajęć
  
  - Like you know, cacheowanie istnieje
  
  - MongoDB is kinda fast tho

### JSON API

API potrafi odpowiadać na zapytania w stylu *"jakie są zajęcia w planie dla grup x, y, z od dnia do dnia"* lub *"jakie są zajęcia dla wykładowcy x danego dnia"*

Wszystkie endpointy związane z planem zajęć są udokumentowane [tutaj](https://altapi.kpostek.dev/redoc). Jeżeli chcesz potestować sobie ręcznie to polecam pobrać sobie z dokumentacji `OpenAPI schema` i testować zapytania sobie w programie typu Insomnia.

### ICS Feed

Główną różnicę z tym co dostarcza stara stronka, jest możliwość subskrybowania kalendarza. Wtedy każda zmiana jest automatycznie aktualizowana w aplikacji kalendarza bez potrzeby ponownego wgrania planu zajęć.

Również same dane dostarczane przez usługę się różnią:

<img title="" src="https://github.com/pjatk21/alt-api/blob/main/.github/assets/Screenshot%202022-03-05%20at%2001.23.54.png?raw=true" alt="Screenshot 2022-03-05 at 01.23.54.png" width="406">

> Na górze znajdują się wydarzenia dostarczone przez `altapi` a poniżej te dostarczone przez stronę PJATKa

### Wydajność

> Dla kontekstu, CPU: i5-3470S, RAM: 8GB DDR3, Dyski HDD (deadline-mq), Docker, Fedora 35

`no cache, TTFB, cały dzień 07-03-2022`

Altapi: `103.35ms`

`cache, TTFB, cały dzień 07-03-2022`

Altapi: `6.22ms`

Dla tego samego dnia, zapytanie do `https://planzajec.pjwstk.edu.pl/PlanOgolny.aspx` trwało `1.50s` (TTFB). Oznaczało by, że bez cache, `altapi` jest ok. 15 razy szybsze, a z cache 241 razy szybsze.

> Na komputerze deweloperskim: CPU: i5-10600K, RAM 16GB DDR4@3200MHz, Dysk SSD PCIe, Docker Desktop, macOS 12, był w stanie osiągnąć czasy no cache: `44.15ms`, cache: `2.59ms`, co daje 33 razy szybciej bez cache, i **579 razy szybciej** przy użyciu cache.

## Uruchamianie

### W dockerze

Wymagania:

- Docker
- `docker-compose`

```
docker-compose up
```
