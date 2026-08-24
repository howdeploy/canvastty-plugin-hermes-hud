const host = window.CanvasTTYPlugin;
const widget = document.querySelector(".hermes-widget");
const heading = document.querySelector("#heading");
const stateLabel = document.querySelector("#state-label");
const statusMessage = document.querySelector("#status-message");
const toggle = document.querySelector("#toggle");
const actionLabel = document.querySelector("#action-label");
const actionMark = document.querySelector(".action-mark");
const errorMessage = document.querySelector("#error-message");

let locale = "en";
let snapshot = { state: "loading" };
let busy = false;
let failure = "";
let pollTimer = null;

const copy = {
  en: {
    heading: "HUD control",
    loadingState: "Loading",
    loadingMessage: "Reading live desktop state…",
    waitingAction: "Please wait",
    stoppedState: "Stopped",
    stoppedMessage: "Hermes Desktop is not running.",
    openAction: "Open HUD",
    runningState: "HUD active",
    runningMessage: "Hermes Desktop is running in HUD mode.",
    appRunningState: "Running",
    appRunningMessage: "Hermes Desktop is running without the HUD.",
    closeAction: "Close Hermes",
    startingState: "Starting",
    startingMessage: "Starting Hermes Desktop and opening its HUD…",
    stoppingState: "Stopping",
    stoppingMessage: "Asking Hermes Desktop to close…",
    unavailableState: "Unavailable",
    unavailableMessage: "Hermes CLI was not found on this system.",
    unavailableAction: "Unavailable",
    errorState: "Error",
    errorMessage: "Live Hermes Desktop state is unavailable.",
    retryAction: "Retry"
  },
  ru: {
    heading: "Управление HUD",
    loadingState: "Загрузка",
    loadingMessage: "Читаю реальное состояние Desktop…",
    waitingAction: "Подождите",
    stoppedState: "Выключен",
    stoppedMessage: "Hermes Desktop сейчас не запущен.",
    openAction: "Открыть HUD",
    runningState: "HUD активен",
    runningMessage: "Hermes Desktop работает в HUD-режиме.",
    appRunningState: "Запущен",
    appRunningMessage: "Hermes Desktop запущен без HUD.",
    closeAction: "Закрыть Hermes",
    startingState: "Запуск",
    startingMessage: "Запускаю Hermes Desktop и открываю HUD…",
    stoppingState: "Закрытие",
    stoppingMessage: "Отправляю Hermes Desktop запрос на закрытие…",
    unavailableState: "Недоступен",
    unavailableMessage: "Hermes CLI не найден в системе.",
    unavailableAction: "Недоступно",
    errorState: "Ошибка",
    errorMessage: "Состояние Hermes Desktop сейчас недоступно.",
    retryAction: "Повторить"
  }
};

host.onContext((context) => {
  locale = context.appearance.locale === "ru" ? "ru" : "en";
  document.documentElement.dataset.palette = context.appearance.palette;
  document.documentElement.lang = locale;
  heading.textContent = copy[locale].heading;
  render();
});

toggle.addEventListener("click", async () => {
  if (busy || !canAct(snapshot)) return;

  busy = true;
  failure = "";
  render();

  try {
    snapshot = snapshot.state === "running"
      ? await host.hermesHud.close()
      : await host.hermesHud.open();
  } catch (error) {
    failure = error instanceof Error ? error.message : copy[locale].errorMessage;
  } finally {
    busy = false;
    render();
    schedulePoll(350);
  }
});

async function refresh() {
  if (busy) {
    schedulePoll(600);
    return;
  }

  try {
    snapshot = await host.hermesHud.getState();
    if (snapshot.state !== "error") failure = "";
  } catch (error) {
    snapshot = { state: "error" };
    failure = error instanceof Error ? error.message : copy[locale].errorMessage;
  }

  render();
  schedulePoll(2000);
}

function schedulePoll(delay) {
  if (pollTimer !== null) window.clearTimeout(pollTimer);
  pollTimer = window.setTimeout(() => void refresh(), delay);
}

function canAct(state) {
  return state.state === "stopped" || state.state === "running" || state.state === "error";
}

function render() {
  const text = copy[locale];
  const state = busy
    ? snapshot.state === "running" ? "stopping" : "starting"
    : snapshot.state;
  const view = viewForState(state, snapshot, text);

  widget.dataset.state = state;
  stateLabel.textContent = view.state;
  statusMessage.textContent = view.message;
  actionLabel.textContent = view.action;
  actionMark.textContent = state === "running" ? "OFF" : "HUD";
  toggle.disabled = busy || !canAct(snapshot) || snapshot.state === "unavailable";
  toggle.setAttribute("aria-busy", busy ? "true" : "false");
  errorMessage.hidden = failure.length === 0;
  errorMessage.textContent = failure;
}

function viewForState(state, current, text) {
  if (state === "stopped") {
    return { state: text.stoppedState, message: text.stoppedMessage, action: text.openAction };
  }
  if (state === "running") {
    return current.hudOpen
      ? { state: text.runningState, message: text.runningMessage, action: text.closeAction }
      : { state: text.appRunningState, message: text.appRunningMessage, action: text.closeAction };
  }
  if (state === "starting") {
    return { state: text.startingState, message: text.startingMessage, action: text.waitingAction };
  }
  if (state === "stopping") {
    return { state: text.stoppingState, message: text.stoppingMessage, action: text.waitingAction };
  }
  if (state === "unavailable") {
    return {
      state: text.unavailableState,
      message: current.message || text.unavailableMessage,
      action: text.unavailableAction
    };
  }
  if (state === "error") {
    return {
      state: text.errorState,
      message: current.message || text.errorMessage,
      action: text.retryAction
    };
  }
  return { state: text.loadingState, message: text.loadingMessage, action: text.waitingAction };
}

void refresh();
