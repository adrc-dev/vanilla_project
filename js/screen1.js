import {  getCookie, createOrUpdateUserCookie } from "./utils.js";
// seleccionamos el contenedor que modificaremos
const home = document.querySelector(".home");
// inicializamos el selector de bienvenida y login
let loginDisplayed = false;

// evento que nos muestra el login al pulsar Ctrl+F10
document.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.key === "F10" && !loginDisplayed) {
    showLogin();
    loginDisplayed = true;
  }
});

// evento que nos muestra el login apos 5 segundos caso no se hayan pulsado las teclas
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    if (!loginDisplayed) {
      showLogin();
      loginDisplayed = true;
    }
  }, 5000);
});

// funcion para crear el login
function showLogin() {
  home.innerHTML = `
    <h2>Usuario:</h2>
    <input type="text" id="user" placeholder="user@domain.com" autofocus>
    <p id="emailError">
      El usuario debe tener el formato: user@domain.com
    </p>`;

  // cazamos el usuario y el error en el documento
  const inputUser = document.getElementById("user");
  const emailError = document.getElementById("emailError");

  // cremos la expresion regular del email
  const verifyEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // funcion para validar email
  function validateEmail() {
    let email = inputUser.value.trim();
    if (verifyEmail.test(email)) {
      emailError.style.display = "none";
      return email;
    } else {
      emailError.style.display = "inherit";
      inputUser.select();
      return null;
    }
  }

  // funcion para verificar que la cookie existe
  function checkCookie(email) {
    // recuperamos la cookie principal del usuario
    const emailCookie = getCookie("emailCookie");
    const userData = emailCookie ? getCookie(emailCookie) : null;

    // si hay datos del usuario, verificamos el email
    if (userData) {
      const user = JSON.parse(userData);
      if (user.email == email) {
        window.location.href = "./screen2.html";
        return;
      }
    }

    // si no existe o no coincide, creamos una nueva cookie
    createOrUpdateUserCookie(email);
    window.location.href = "./screen2.html";
  }

  // evento para el enter que valida el email caso no exista la cookie
  user.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const email = validateEmail();
      if (email) {
        checkCookie(email);
      }
    }
  });

  // evento blur para mostrar el error si se pierde el foco
  user.addEventListener("blur", validateEmail);
}
