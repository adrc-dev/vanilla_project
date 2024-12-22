// funcion para crear cookie
export function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// funcion para recoger cookie
export function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

// funcion para borrar cookie
export function deleteCookie(cname) {
  document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:01GMT;path=/";
}

// funcion para crear cookie o actualizar cookie dependiendo la cantidad de parametros
export function createOrUpdateUserCookie(
  email,
  days = 30,
  updateLastLogin = false
) {
  const userCookie = getCookie(email);
  let user = userCookie
    ? JSON.parse(userCookie)
    : { email, lastLogin: null, questions: [], delayAsk: true, delay: false };

  if (updateLastLogin) {
    const now = new Date();
    const datePart = now.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const timePart = now.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    user.lastLogin = `${datePart} a las ${timePart}`;
  }

  setCookie("emailCookie", email, days);
  setCookie(email, JSON.stringify(user), days);
}
