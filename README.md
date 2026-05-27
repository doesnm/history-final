# History of Kazakhstan — Exam Prep Portal

Подготовка к финальному экзамену по «Истории Казахстана» (Astana IT University) на Next.js 14 + TypeScript + Tailwind. 10 лекций официального учебника, 100+ вопросов, 50 флеш-карт с интервальным повторением, поисковая шпаргалка и личный кабинет с прогрессом.

## Стек

- **Next.js 14** (App Router, RSC, SSG)
- **TypeScript** (strict)
- **Tailwind CSS** + кастомные KZ-цвета (#00AFCA / #FEC50C)
- **Zustand** + `persist` middleware → LocalStorage
- **Fuse.js** — нечёткий поиск в шпаргалке
- **pdf-parse** — извлечение текста из официального учебника

## Структура

```
app/                  # маршруты App Router
  layout.tsx          # корневой layout с темой и навигацией
  page.tsx            # главная: hero + статистика + прогресс
  theory/[slug]/      # страница лекции (SSG)
  quiz/[topic]/       # тренировка/экзамен (?mode=exam)
  flashcards/         # SR карточки
  cheatsheet/         # таблица + поиск + печать
  dashboard/          # прогресс, история, экспорт
components/
  layout/             # Header, Footer, ProgressBar, ThemeProvider
  theory/             # ConceptCard, ScholarCard, TimelineList…
  quiz/               # QuizRunner, QuestionCard, ResultScreen
  flashcards/         # FlashcardsApp, FlashCardView (3D flip)
  cheatsheet/         # CheatSheetView (fuse.js)
  dashboard/          # DashboardView
lib/
  types.ts            # доменные типы
  content-loader.ts   # server-only загрузчики JSON
  quiz-engine.ts      # gradeOne / gradeAll, weakTopics
  spaced-repetition.ts# Leitner-боксы (0..5)
  store.ts            # zustand + persist
  utils.ts            # cn, shuffle, normalize, pct
data/
  topics.json         # мета 10 лекций
  theory/*.json       # один файл на лекцию (концепты, персоны, timeline…)
  questions/*.json    # mcq | truefalse | fill | match
  flashcards.json     # 50 карточек
scripts/
  parse-pdf.ts        # извлекает текст из учебника → data/_raw/
```

## Запуск

```bash
npm install
npm run dev          # http://localhost:3000
```

### Опционально — парсинг исходного PDF

Положите учебник по пути:
```
~/Documents/History of Kazakhstan_Educational Manual (3).pdf
```

или передайте свой путь:

```bash
npm run parse-pdf -- /custom/path/to/manual.pdf
```

Скрипт извлекает текст и разбивает по `LECTURE N.` в `data/_raw/lectures.json` + `data/_raw/full.txt`. Структурированный контент в `data/theory/*.json` курирован вручную из этого raw-текста (PDF не парсится автоматически в концепты/timeline без LLM-обработки).

### Production-build

```bash
npm run build
npm start
```

### Type-check

```bash
npm run type-check
```

## Деплой на Vercel

```bash
npm i -g vercel
vercel              # первый раз: настройка проекта
vercel --prod       # production-деплой
```

`vercel.json` уже настроен (фреймворк Next.js, заголовки безопасности). Никаких env-переменных не требуется — весь контент статический.

## Контент

Все 10 лекций официального учебника:

| № | Лекция | Период |
|---|--------|--------|
| 1 | Древность и кочевники | 2.5 млн лет назад — IV в. до н.э. |
| 2 | Тюркская эпоха | VI–XII вв. |
| 3 | Улуг Улус и Казахское ханство | XIII — пер. пол. XV в. |
| 4 | Российская колонизация | XVIII–XIX вв. |
| 5 | Народно-освободительная борьба | XVIII — нач. XX в. |
| 6 | Алаш-Орда | 1905–1920 |
| 7 | Советская модернизация | 1917–1953 |
| 8 | Реформы и перестройка | 1953–1991 |
| 9 | Независимый Казахстан | 1991 — наст. время |
| 10 | Внешняя политика | 1991 — наст. время |

## Особенности

- **SSG** — все страницы лекций пререндерены при билде.
- **Прогресс хранится локально** (LocalStorage через zustand/persist).
- **Темная тема** с переключателем в шапке.
- **Печать шпаргалки** — `@media print` правила скрывают навигацию.
- **Экспорт прогресса** в JSON для бэкапа.
- **4 формата вопросов**: multiple choice, true/false, fill-in, match.
- **Spaced repetition** по упрощённой системе Лейтнера (6 боксов).
- **A11y**: ARIA-роли на прогресс-баре, `aria-label` на интерактивах, keyboard navigation.

## Лицензия

Учебный материал — © Astana IT University, 2024. Код портала — свободное использование для учебных целей.
