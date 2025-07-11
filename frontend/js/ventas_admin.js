document.addEventListener("DOMContentLoaded", function () {
  const botones = [
    { btn: "btnVentas", tabla: "tablaVentas" },
    { btn: "btnProductos", tabla: "tablaProductos" },
    { btn: "btnCaras", tabla: "tablaCaras" },
  ];

  function mostrarTabla(tablaActiva) {
    botones.forEach(({ btn, tabla }) => {
      const boton = document.getElementById(btn);
      const tablaDiv = document.getElementById(tabla);
      if (tabla === tablaActiva) {
        tablaDiv.style.display = "";
        boton.classList.add("btn-primary");
        boton.classList.remove("btn-outline-primary");
      } else {
        tablaDiv.style.display = "none";
        boton.classList.add("btn-outline-primary");
        boton.classList.remove("btn-primary");
      }
    });
  }

  //mostrar ventas realizadas
  mostrarTabla("tablaVentas");

  // Asignar eventos
  botones.forEach(({ btn, tabla }) => {
    document
      .getElementById(btn)
      .addEventListener("click", () => mostrarTabla(tabla));
  });
});
