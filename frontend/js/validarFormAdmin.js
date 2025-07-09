document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  if (!form) return;

  // const categoriaValida = ["juegos", "keys"];

  form.addEventListener("submit", function (e) {
    const nombre = document.getElementById("nombre").value.trim();
    const categoria = document
      .getElementById("categoria")
      .value.trim()
      .toLowerCase();
    const precio = document.getElementById("precio").value.trim();
    const stock = document.getElementById("stock").value.trim();
    const imagen = document.getElementById("imagen").files[0]; // Puede ser undefined
    let errores = [];

    if (!nombre || !categoria || !precio || !stock) {
      errores.push("Todos los campos son obligatorios (excepto imagen).");
    }

    // Validar categoría
    // if (!categoriaValida.includes(categoria)) {
    //   errores.push("La categoría debe ser 'juegos' o 'keys'.");
    // }

    // Validar precio y stock como números positivos
    if (isNaN(precio) || Number(precio) <= 0) {
      errores.push("El precio debe ser un número mayor a 0.");
    }

    if (isNaN(stock) || Number(stock) < 0) {
      errores.push("El stock debe ser un número igual o mayor a 0.");
    }

    // Solo validar imagen si es el formulario de creación
    if (form.action.includes("/api/products") && !imagen) {
      errores.push("Debe seleccionar una imagen.");
    }

    if (errores.length > 0) {
      e.preventDefault(); // Detener envío
      alert(errores.join("\n"));
    }
  });
});
