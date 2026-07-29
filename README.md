# EngLab

Клиентское SPA онлайн-школы английского языка (MVP).

## Стек

- React 19 + TypeScript (strict)
- Vite 8
- React Router (code splitting по маршрутам)
- CSS Modules + design tokens из Figma

## Демо

GitHub Pages: https://gm-itdep.github.io/englab-frontend/

Тестовый вход:
- Email: `ivanpetrov@example.ru`
- Пароль: `EngLab123!`

## Запуск

```bash
npm install
npm run dev
```

Сборка: `npm run build`  
Превью: `npm run preview`  
Линт: `npm run lint`

## Структура

```
src/
  app/           # роутинг
  components/ui/ # переиспользуемые UI-компоненты
  pages/         # страницы (lazy)
  shared/i18n/   # тексты (RU-словарь)
  styles/        # токены и глобальные стили
  assets/        # иконки и изображения из макетов
```

## Браузеры

Последние две стабильные версии Chrome, Firefox, Safari; Safari iOS и Chrome Android.
