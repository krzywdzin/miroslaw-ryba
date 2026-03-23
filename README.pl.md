> **[Read in English](README.md)** | Przeczytaj po polsku (aktualny)

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-purple.svg)](https://vite.dev/)

# Miroslaw Ryba

Nowoczesny frontend React dla [MiroFish](https://github.com/666ghj/MiroFish) -- platformy symulacji spolecznych opartej na LLM do prognozowania i analizy. Zastepuje oryginalny chinski interfejs Vue czystym polsko-angielskim SPA w React.

## Funkcje

- 5-etapowy potok predykcji (Graf -> Srodowisko -> Symulacja -> Raporty -> Czat)
- Interaktywna wizualizacja grafu wiedzy z filtrowaniem encji
- Monitorowanie symulacji w czasie rzeczywistym na dwoch platformach (Twitter + Reddit)
- Eksport raportow do PDF i Markdown
- Rozmowy z agentami AI (ReportAgent i agenci symulowani)
- Tryb ciemny z wykrywaniem preferencji systemu
- Skroty klawiszowe do czestych akcji
- Dwujezyczny interfejs (polski / angielski)
- Pelny panel konfiguracji (klucze API, modele, zarzadzanie Docker)

## Szybki start

```bash
git clone https://github.com/OWNER/miroslaw-ryba.git
cd miroslaw-ryba
cp .env.example .env        # Edytuj, wpisujac swoje klucze API
docker compose up -d         # Uruchom backend MiroFish
npm install && npm run dev   # Uruchom frontend na http://localhost:5173
```

## Dokumentacja

- [Przewodnik instalacji](docs/installation.md)
- [Przewodnik konfiguracji](docs/configuration.md)
- [Wspolpraca](CONTRIBUTING.md)

## Stos technologiczny

| Kategoria | Technologia |
|-----------|-------------|
| Framework UI | React 19 |
| Jezyk | TypeScript 5.7 |
| Narzedzie budowania | Vite 6 |
| Stylowanie | Tailwind CSS v4 |
| Komponenty | shadcn/ui |
| Pobieranie danych | TanStack Query |
| Wizualizacja grafu | Reagraph |
| Internacjonalizacja | react-i18next |

## Licencja

Ten projekt jest licencjonowany na podstawie [GNU Affero General Public License v3.0](LICENSE). Oparty na [MiroFish](https://github.com/666ghj/MiroFish) autorstwa Shanda Group.
