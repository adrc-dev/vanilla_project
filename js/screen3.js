import { setCookie, getCookie } from "./utils.js";

// cazamos todos los elementos necesarios del documento
const questionInput = document.getElementById("question");
const trueInput = document.getElementById("true");
const falseInput = document.getElementById("false");
const scoreInput = document.getElementById("score");
const btnSave = document.getElementById("btnSave");
const btnBack = document.getElementById("btnBack");
const loadingText = document.getElementById("loadingText");
const questionsTable = document.getElementById("questionsTable");
const tableBody = questionsTable.querySelector("tbody");

// rescatamos los datos de las cookies
const emailCookie = getCookie("emailCookie");
const userData = getCookie(emailCookie);
const user = JSON.parse(userData);

// iniciamos el contador de procesos activos
let activeProcesses = 0;

// funcion para validar el formulario
function validateForm() {
  const question = questionInput.value.trim();
  const answer = trueInput.checked || falseInput.checked;
  const score = scoreInput.value.trim();

  btnSave.disabled = !(question && answer && score !== "");
}

// funcion que actualiza el boton volver caso no tenga procesos activos
function updateBackButton() {
  btnBack.disabled = activeProcesses > 0;
}

// funcion para activar los listeners del formulario
function formListeners() {
  questionInput.addEventListener("input", validateForm);
  trueInput.addEventListener("change", validateForm);
  falseInput.addEventListener("change", validateForm);
  scoreInput.addEventListener("input", validateForm);
  scoreInput.addEventListener("input", (event) => {
    const value = event.target.value;
    if (!/^[0-9]$/.test(value)) {
      event.target.value = value.slice(0, 1).replace(/[^0-9]/g, "");
    }
  });
}

// funcion para agregar nueva fila con status Guardando...
function addRow(question, answer, score, status = "Guardando...") {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${question}</td>
    <td>${answer}</td>
    <td>${score}</td>
    <td>${status}</td>
  `;
  tableBody.appendChild(row);
  return row;
}

// funcion para actualizar el status
function updateRowStatus(row, status) {
  row.lastElementChild.textContent = status;
}

// funcion para guardar pregunta en cookies y actualizar la tabla
async function saveQuestion() {
  btnSave.disabled = true;
  const question = questionInput.value.trim();
  const answer = trueInput.checked ? "Verdadero" : "Falso";
  const score = scoreInput.value.trim();

  // enviamos la nueva fila con un proceso activo para que no se active el boton atras
  const row = addRow(question, answer, score);
  activeProcesses++;
  updateBackButton();

  // reiniciamos el form
  resetForm();

  // simulamos el delay de 5seg
  await simulateDelay(5000);

  try {
    // intentamos agregar la pregunta a la cookie
    const newQuestion = { question, answer, score, status: "OK" };
    user.questions.push(newQuestion);
    setCookie(emailCookie, JSON.stringify(user), 30);
    // cambiamos el estado de la nueva pregunta a ok
    updateRowStatus(row, "OK");
  } catch (error) {
    // caso falle, actualizamos el estado a ERROR y mostramos por consola
    console.error("Error al guardar la pregunta:", error);
    updateRowStatus(row, "ERROR");
  }

  // reactivamos el boton de atras
  activeProcesses--;
  updateBackButton();
}

// funcion para simular retrasos
function simulateDelay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// funcion para reiniciar el formulario
function resetForm() {
  questionInput.value = "";
  trueInput.checked = false;
  falseInput.checked = false;
  scoreInput.value = "";
  validateForm();
}

// funcion para ver preguntas existentes
async function loadQuestions(delay = true) {
  if (delay) await simulateDelay(5000);

  tableBody.innerHTML = "";
  user.questions.forEach(({ question, answer, score, status }) => {
    addRow(question, answer, score, status);
  });

  loadingText.style.display = "none";
  questionsTable.style.display = "table";
}

// funcion para inicializar la aplicacion
function getReady() {
  formListeners();

  btnSave.addEventListener("click", saveQuestion);
  btnBack.addEventListener("click", () => {
    window.location.href = "./screen2.html";
  });

  // evento que nos pregunta una unica vez si queremos el delay de 5 segundos de las preguntas y lo guarda en la cookie
  document.addEventListener("DOMContentLoaded", () => {
    if (user.delayAsk) {
      const delay = confirm("¿Quieres un retraso al aparecer las preguntas?");
      user.delay = delay;
      user.delayAsk = false;
      setCookie(emailCookie, JSON.stringify(user), 30);
    }
    loadQuestions(user.delay);
  });
}

// arrancamos el flujo de la aplicacion
getReady();
