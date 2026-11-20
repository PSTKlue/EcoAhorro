const notificacion = document.getElementById("notificacion");
let temporizadorNotificacion;

window.mostrarNotificacion = (mensaje, estado = "success") => {
  window.clearTimeout(temporizadorNotificacion);
  notificacion.textContent = mensaje;
  notificacion.dataset.state = estado;
  notificacion.classList.add("is-visible");

  temporizadorNotificacion = window.setTimeout(() => {
    notificacion.classList.remove("is-visible");
  }, 5000);
};
