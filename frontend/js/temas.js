function aplicarTema() {
  const tema = localStorage.getItem("tema") || "claro";
  document.body.classList.remove("claro", "oscuro");
  document.body.classList.add(tema);
}

function cambiarTema() {
  const temaActual = document.body.classList.contains("claro") ? "claro" : "oscuro";
  const nuevoTema = temaActual === "claro" ? "oscuro" : "claro";
  document.body.classList.remove("claro", "oscuro");
  document.body.classList.add(nuevoTema);
  localStorage.setItem("tema", nuevoTema);
}

document.addEventListener("DOMContentLoaded", aplicarTema);

function aplicarTema() {
  const tema = localStorage.getItem("tema") || "claro";
  console.log("Tema aplicado:", tema);
  document.body.classList.remove("claro", "oscuro");
  document.body.classList.add(tema);
}