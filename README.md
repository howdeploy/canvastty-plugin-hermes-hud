# CanvasTTY Hermes HUD

Hermes HUD управляет установленным Hermes Desktop прямо с HOME CanvasTTY. Одна кнопка запускает приложение в HUD-режиме; повторное нажатие завершает его. Виджет отображает подтверждённое состояние живого процесса.

## Требования

- CanvasTTY с разрешением плагинов `hermes:hud`.
- Hermes CLI, доступный CanvasTTY.
- Hermes Desktop с локальным control contract: `hermes desktop --skip-build --hud` и `hermes desktop --skip-build --quit`.

Плагин получает только узкое разрешение `hermes:hud`. Он не может выбирать исполняемый файл, передавать произвольные аргументы или завершать процесс по PID.

## Установка

В CanvasTTY откройте **Settings → Plugins**, вставьте
`https://github.com/howdeploy/canvastty-plugin-hermes-hud`, нажмите **Inspect**,
проверьте единственное разрешение `hermes:hud` и подтвердите установку.

Для локальной разработки:

1. Откройте **Settings → Plugins → Developer plugins** в CanvasTTY.
2. Выберите эту папку.
3. Разрешите `Hermes Desktop HUD control` и включите плагин.
4. Добавьте `Hermes HUD` из HOME launcher.

Установленная через GitHub версия проверяет обновления через обычный installer CanvasTTY.

## Структура

- `canvastty.plugin.json` — manifest API v1.
- `widget/index.html` — sandboxed HOME contribution.
- `widget/index.js` — live-state polling и одна lifecycle-кнопка.
- `widget/index.css` — CanvasTTY Studio Grid visual language и palette support.

## Лицензия

MIT.
