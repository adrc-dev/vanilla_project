import { setCookie, getCookie, deleteCookie, createOrUpdateUserCookie} from "./utils.js";
// rescatamos el email de la cookie
const emailCookie = getCookie("emailCookie");
const userData = getCookie(emailCookie);

// cazamos los elementos que rellenaremos en el documento
const welcome = document.getElementById("welcome");
const lastLogin = document.getElementById("lastLogin");

// saludamos caso haya la cookie user
if (userData) {
  try {
    const user = JSON.parse(userData);
    if (user.email === emailCookie) {
      welcome.textContent = `Hola ${user.email}`;
      lastLogin.textContent = user.lastLogin
        ? `La última vez que entraste fue el ${user.lastLogin}.`
        : "Esta es tu primera vez por aquí.";

      createOrUpdateUserCookie(emailCookie, 30, true);
    } else {
      welcome.textContent = "ERROR: algo ha salido mal";
    }
  } catch (e) {
    welcome.textContent = "Usuario no encontrado.";
    console.error("Error al parsear los datos de usuario:", e);
  }
} else {
  welcome.textContent = "Usuario no encontrado.";
}

// cazamos los botones del documento
const btnQuestions = document.getElementById("btnQuestions");
const btnExit = document.getElementById("btnExit");

// evento que nos lleva a la pantalla 3
btnQuestions.addEventListener("click", () => {
  window.location.href = "./screen3.html";
});

// evento que nos lleva a la pantalla 1 sin la cookie emailCookie
btnExit.addEventListener("click", () => {
  deleteCookie("emailCookie");
  window.location.href = "./screen1.html";
});
