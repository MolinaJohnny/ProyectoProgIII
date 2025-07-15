document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("encuestaForm");
  const omitirBtn = document.getElementById("omitirBtn");
  const modal = document.getElementById("modalAgradecimiento");
  const cerrarModal = document.getElementById("cerrarModal");
  const erroresDiv = document.getElementById("errores");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    erroresDiv.textContent = "";

    // Validaciones
    const email = form.email.value.trim();
    const opinion = form.opinion.value.trim();
    const puntuacion = form.puntuacion.value;
    const imagen = form.imagen.files[0];

    let errores = [];
    if (!email.match(/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/)) {
      errores.push("El email no es válido.");
    }
    if (opinion.length < 5) {
      errores.push("La opinión debe tener al menos 5 caracteres.");
    }
    if (puntuacion < 1 || puntuacion > 10) {
      errores.push("La puntuación debe estar entre 1 y 10.");
    }
    if (imagen && !imagen.type.startsWith("image/")) {
      errores.push("El archivo debe ser una imagen.");
    }
    if (errores.length > 0) {
      erroresDiv.textContent = errores.join(" ");
      return;
    }

    const formData = new FormData(form);
    try {
      const response = await fetch("/api/encuestas", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        modal.style.display = "block";
        form.reset();
      } else {
        const data = await response.json();
        erroresDiv.textContent = data.error || "Error al enviar la encuesta";
      }
    } catch (err) {
      erroresDiv.textContent = "Error de conexión";
    }
  });

  omitirBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  cerrarModal.addEventListener("click", () => {
    modal.style.display = "none";
    window.location.href = "index.html";
  });
});
