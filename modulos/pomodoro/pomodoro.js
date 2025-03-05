// IMPORTANDO A SIDEBAR DA GLOBAL

document.addEventListener("DOMContentLoaded", function () {
  fetch("/global.html")
    .then(response => response.text())
    .then(html => {
      document.getElementById("sidebar-container").innerHTML = html;
    })
    .catch(error => console.error("Erro ao carregar a sidebar:", error));
});

const circleElement = document.querySelector(".circle");
const timeElement = document.querySelector(".time");
const timeModeElement = document.querySelector(".time-mode");
const turnElement = document.querySelector(".turns");
const controlButton = document.querySelector(".timer-control");
const resetButton = document.querySelector(".reset-button");
const notificationSound = document.querySelector("#notification");
const timeContainerElement = document.querySelector(".time-container");

let isRunning = false,
  isBreakTime = false,
  workTime,
  breakTime,
  longBreakTime,
  totalTurns,
  currentTurn,
  totalTime,
  timeRemaining,
  timerInterval;

controlButton.addEventListener("click", toggleTimerState);
resetButton.addEventListener("click", resetTimer);

Notification.requestPermission();

function initializeTimerSettings() {
  let workTimeElement = document.querySelector("#work-time-options");
  let totalTurnsElement = document.querySelector("#total-turns-options");

  isRunning = false;
  isBreakTime = false;
  workTime = workTimeElement.options[workTimeElement.selectedIndex].value * 60;
  breakTime = (workTimeElement.options[workTimeElement.selectedIndex].value / 5) * 60;
  longBreakTime = (workTimeElement.options[workTimeElement.selectedIndex].value - 10) * 60;
  totalTurns = totalTurnsElement.options[totalTurnsElement.selectedIndex].value;
  currentTurn = 1;
  totalTime = workTime;
  timeRemaining = totalTime;
  timerInterval = null;
}

function toggleTimerState() {
  isRunning ? pauseTimer() : startTimer();
}

function startTimer() {
  isRunning = true;
  controlButton.innerText = "Pausar";
  timerInterval = setInterval(updateTimer, 1000);
  timeContainerElement.classList.remove("rotateIn");
}

function pauseTimer() {
  isRunning = false;
  controlButton.innerText = "Iniciar";
  clearInterval(timerInterval);
}

function resetTimer() {
  pauseTimer();
  initializeTimerSettings();
  updateDisplayTime();
  updateDisplayTurn();
  runAnimation("rotateIn");
  document.querySelector(".config-message").style.display = "none";
}

function updateTimer() {
  if (timeRemaining > 0) {
    timeRemaining--;
  } else {
    completeTurn();
  }
  updateDisplayTime();
}

function completeTurn() {
  notificationSound.play();
  runAnimation("swing");
  switchToNextTurn();
  updateDisplayTurn();
}

function runAnimation(animation) {
  timeContainerElement.classList.add(animation);
  timeContainerElement.addEventListener("animationend", () => {
    timeContainerElement.classList.remove(animation);
  });
}

function switchToNextTurn() {
  isBreakTime = !isBreakTime;
  if (!isBreakTime) {
    currentTurn++;
  }

  if (currentTurn <= totalTurns) {
    if (isBreakTime) {
      totalTime = currentTurn < totalTurns ? breakTime : longBreakTime;
      showNotification("Hora de descansar", "Parabéns pelo trabalho, aproveite os próximos minutos para descansar");
    } else {
      totalTime = workTime;
      showNotification("Voltar ao trabalho", "Você está quase lá, só mais alguns minutos de trabalho");
    }
    timeRemaining = totalTime;
  } else {
    resetTimer();
  }
}

function updateDisplayTime() {
  const minutes = Math.floor(timeRemaining / 60).toString().padStart(2, "0");
  const seconds = Math.floor(timeRemaining % 60).toString().padStart(2, "0");
  timeElement.innerText = `${minutes}:${seconds}`;
  updateCircleProgress((timeRemaining / totalTime) * 100);
}

function updateDisplayTurn() {
  let timeMode = isBreakTime ? (currentTurn < totalTurns ? "Descanso" : "Descanso Longo") : "Trabalho";
  timeModeElement.innerText = timeMode;
  turnElement.innerText = `${currentTurn}/${totalTurns}`;
}

function updateCircleProgress(percent) {
  const circlePerimeter = 597;
  const dashOffset = circlePerimeter * (percent / 100);
  circleElement.style.setProperty("--dash-offset", circlePerimeter - dashOffset);
}

function showNotification(messageHeader, messageBody) {
  const notification = new Notification(messageHeader, { body: messageBody });
  setTimeout(notification.close.bind(notification), 4000);
}

resetTimer();

$(document).ready(function () {
  $(".menu-button").click(function () {
    $(".menu-bar").toggleClass("open");
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Faz a requisição para a API que contém o contador de acessos
  fetch("/api/counter") // Caminho atualizado para acessar a API corretamente
    .then((response) => response.json())
    .then((data) => {
      // Atualiza o valor do contador na tela
      document.getElementById("counter-value").textContent = data.visits;
    })
    .catch((error) => {
      console.error("Erro ao buscar o contador:", error);
      document.getElementById("counter-value").textContent = "Erro";
    });
});