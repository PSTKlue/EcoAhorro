const formularioApoyo = document.getElementById("formularioApoyo");
const respuestaApoyo = document.getElementById("respuestaApoyo");
const campoNombreApoyo = document.getElementById("nombreApoyo");
const campoCorreoApoyo = document.getElementById("correoApoyo");
const campoMontoPersonalizado = document.getElementById("montoPersonalizado");
const campoMontos = document.querySelector(".amount-field");
const opcionesMonto = [...document.querySelectorAll('input[name="monto"]')];
let validacionApoyoActiva = false;
const correoApoyoValido = () => campoCorreoApoyo.validity.valid && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campoCorreoApoyo.value.trim());

campoMontoPersonalizado.addEventListener("input", () => {
  if (campoMontoPersonalizado.value !== "") opcionesMonto.forEach((opcion) => { opcion.checked = false; });
  actualizarErroresApoyo();
});
opcionesMonto.forEach((opcion) => opcion.addEventListener("change", () => {
  campoMontoPersonalizado.value = "";
  actualizarErroresApoyo();
}));
campoNombreApoyo.addEventListener("input", actualizarErroresApoyo);
campoCorreoApoyo.addEventListener("input", actualizarErroresApoyo);

formularioApoyo.addEventListener("submit", (event) => {
  event.preventDefault();
  validacionApoyoActiva = true;
  const correoEscrito = campoCorreoApoyo.value.trim() !== "";
  const correoValido = correoEscrito && correoApoyoValido();
  const montoPersonalizado = campoMontoPersonalizado.value.trim();
  const radioMonto = opcionesMonto.find((opcion) => opcion.checked);
  const monto = montoPersonalizado !== "" ? Number(montoPersonalizado) : Number(radioMonto?.value);
  const invalidos = [];

  marcarCampoApoyo(campoNombreApoyo, !campoNombreApoyo.value.trim());
  marcarCampoApoyo(campoCorreoApoyo, !correoValido);
  campoMontos.classList.toggle("has-error", !Number.isFinite(monto) || monto <= 0);
  opcionesMonto.forEach((opcion) => opcion.setAttribute("aria-invalid", String(campoMontos.classList.contains("has-error"))));
  marcarCampoApoyo(campoMontoPersonalizado, montoPersonalizado !== "" && (!Number.isFinite(monto) || monto <= 0));

  if (!campoNombreApoyo.value.trim()) invalidos.push({ campo: campoNombreApoyo, etiqueta: "nombre completo" });
  if (!correoEscrito) invalidos.push({ campo: campoCorreoApoyo, etiqueta: "correo electrónico" });
  else if (!correoValido) invalidos.push({ campo: campoCorreoApoyo, etiqueta: "correo electrónico válido" });
  if (!Number.isFinite(monto) || monto <= 0) {
    invalidos.push({ campo: montoPersonalizado ? campoMontoPersonalizado : opcionesMonto[0], etiqueta: montoPersonalizado ? "monto mayor a cero" : "monto de apoyo" });
  }

  if (invalidos.length) {
    const texto = `Corrige estos campos: ${invalidos.map(({ etiqueta }) => etiqueta).join(", ")}.`;
    mostrarRespuesta(texto, "error");
    window.mostrarNotificacion(texto, "error");
    invalidos[0].campo.focus();
    return;
  }

  const nombre = campoNombreApoyo.value.trim();
  mostrarRespuesta(`Gracias, ${nombre}. Registramos tu intención de apoyar con S/ ${monto.toFixed(2)}.`, "success");
  window.mostrarNotificacion("Gracias por tu apoyo! :D", "success");
  formularioApoyo.reset();
  validacionApoyoActiva = false;
  [...formularioApoyo.querySelectorAll(".has-error")].forEach((elemento) => elemento.classList.remove("has-error"));
  formularioApoyo.querySelectorAll('[aria-invalid="true"]').forEach((campo) => campo.setAttribute("aria-invalid", "false"));
});

function actualizarErroresApoyo() {
  if (!validacionApoyoActiva) return;
  marcarCampoApoyo(campoNombreApoyo, !campoNombreApoyo.value.trim());
  marcarCampoApoyo(campoCorreoApoyo, campoCorreoApoyo.value.trim() !== "" && !correoApoyoValido());
  const monto = campoMontoPersonalizado.value.trim() !== ""
    ? Number(campoMontoPersonalizado.value)
    : Number(opcionesMonto.find((opcion) => opcion.checked)?.value);
  const montoInvalido = campoMontoPersonalizado.value.trim() !== ""
    ? !Number.isFinite(monto) || monto <= 0
    : !opcionesMonto.some((opcion) => opcion.checked);
  campoMontos.classList.toggle("has-error", montoInvalido && campoMontoPersonalizado.value.trim() === "");
  opcionesMonto.forEach((opcion) => opcion.setAttribute("aria-invalid", String(campoMontos.classList.contains("has-error"))));
  marcarCampoApoyo(campoMontoPersonalizado, montoInvalido && campoMontoPersonalizado.value.trim() !== "");
}

function marcarCampoApoyo(campo, invalido) {
  campo.closest(".field").classList.toggle("has-error", invalido);
  campo.setAttribute("aria-invalid", String(invalido));
}

function mostrarRespuesta(texto, estado) {
  respuestaApoyo.textContent = texto;
  respuestaApoyo.dataset.state = estado;
}
