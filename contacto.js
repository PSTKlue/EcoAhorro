const formularioContacto = document.getElementById("formularioContacto");
const respuestaContacto = document.getElementById("respuesta");
const campoCorreo = document.getElementById("correo");
const estadoCorreo = document.getElementById("correoEstado");
const camposContacto = [
  { campo: document.getElementById("nombre"), etiqueta: "nombre completo" },
  { campo: campoCorreo, etiqueta: "correo electrónico" },
  { campo: document.getElementById("asunto"), etiqueta: "asunto" },
  { campo: document.getElementById("mensaje"), etiqueta: "mensaje" },
];

camposContacto.forEach(({ campo }) => campo.addEventListener("input", () => {
  if (esCampoValido(campo)) marcarCampo(campo, false);
  if (campo === campoCorreo) mostrarEstadoCorreo();
}));
campoCorreo.addEventListener("blur", mostrarEstadoCorreo);

formularioContacto.addEventListener("submit", (event) => {
  event.preventDefault();
  const invalidos = camposContacto.filter(({ campo }) => !esCampoValido(campo));
  camposContacto.forEach(({ campo }) => marcarCampo(campo, !esCampoValido(campo)));
  mostrarEstadoCorreo();

  if (invalidos.length) {
    const texto = `Corrige estos campos: ${invalidos.map(({ etiqueta }) => etiqueta).join(", ")}.`;
    mostrarRespuesta(texto, "error");
    window.mostrarNotificacion(texto, "error");
    invalidos[0].campo.focus();
    return;
  }

  const nombre = document.getElementById("nombre").value.trim();
  mostrarRespuesta(`Gracias, ${nombre}. Tu mensaje está listo, pero todavía no se envía porque el sitio no tiene un servicio conectado.`, "success");
  window.mostrarNotificacion("Datos aceptados. Mensaje enviado correctamente", "success");
  formularioContacto.reset();
  estadoCorreo.textContent = "";
  estadoCorreo.dataset.state = "";
  camposContacto.forEach(({ campo }) => marcarCampo(campo, false));
});

function esCampoValido(campo) {
  if (!campo.value.trim()) return false;
  if (campo.type === "email") return campo.validity.valid && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campo.value.trim());
  return true;
}

function marcarCampo(campo, invalido) {
  campo.closest(".field").classList.toggle("has-error", invalido);
  campo.setAttribute("aria-invalid", String(invalido));
}

function mostrarEstadoCorreo() {
  const correo = campoCorreo.value.trim();
  if (!correo) {
    estadoCorreo.textContent = "";
    estadoCorreo.dataset.state = "";
    return;
  }
  const valido = esCampoValido(campoCorreo);
  estadoCorreo.textContent = valido ? "El formato del correo es válido." : "Revisa el formato. Ejemplo: nombre@correo.com";
  estadoCorreo.dataset.state = valido ? "success" : "error";
}

function mostrarRespuesta(texto, estado) {
  respuestaContacto.textContent = texto;
  respuestaContacto.dataset.state = estado;
}
