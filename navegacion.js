const botonMenu = document.querySelector(".menu-toggle");
const navegacionPrincipal = document.getElementById("main-nav");

botonMenu.addEventListener("click", () => {
  const abierto = botonMenu.getAttribute("aria-expanded") === "true";
  botonMenu.setAttribute("aria-expanded", String(!abierto));
  botonMenu.setAttribute("aria-label", abierto ? "Abrir menú" : "Cerrar menú");
  navegacionPrincipal.classList.toggle("is-open", !abierto);
});

navegacionPrincipal.querySelectorAll("a").forEach((enlace) => {
  enlace.addEventListener("click", () => {
    botonMenu.setAttribute("aria-expanded", "false");
    botonMenu.setAttribute("aria-label", "Abrir menú");
    navegacionPrincipal.classList.remove("is-open");
  });
});
