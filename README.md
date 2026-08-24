# CanvasTTY Hermes HUD

Опциональный демонстрационный HOME-виджет для CanvasTTY. Одна кнопка запускает установленный Hermes Desktop в его настоящем HUD-режиме; та же кнопка завершает приложение. Виджет показывает только подтверждённое состояние живого процесса — без выдуманного прогресса и телеметрии.

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
