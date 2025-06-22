document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btnContinuar");

  btn.addEventListener("click", () => {
    const nombre = document.getElementById("nombreCliente").value.trim();
    if (nombre.length > 0) {
      localStorage.setItem("clienteNombre", nombre);
      window.location.href = "/productos";
    } else {
      alert("Por favor ingresá tu nombre.");
    }
  });
});