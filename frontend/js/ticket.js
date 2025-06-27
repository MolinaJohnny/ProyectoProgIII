const contenedor = document.querySelector(".productos");
const precio_total = document.getElementById("precio_total");
const date = document.getElementById("fecha");
const btnDescargar = document.getElementById("descargar");
const nombreUsuario = document.getElementById("nombre_usuario_ticket"); // <--- referencia correcta

let listaCarrito = [];

function renderTicket() {
  // Mostrar el nombre del usuario si existe en localStorage
  const nombreGuardado = localStorage.getItem("clienteNombre");
  if (nombreUsuario && nombreGuardado) {
    nombreUsuario.textContent = nombreGuardado;
  } else if (nombreUsuario) {
    nombreUsuario.textContent = "NOMBRE USUARIO";
  }

  // Limpiar productos antes de renderizar
  contenedor.innerHTML = `
        <div class="row fw-bold border-bottom pb-2 mb-2">
            <div class="col-4">Producto</div>
            <div class="col-2">Cant.</div>
            <div class="col-3">Unitario</div>
            <div class="col-3">Total</div>
        </div>
    `;

  let acumulador = 0;
  listaCarrito.forEach((element) => {
    const div = document.createElement("div");
    div.className = "row col-12 d-flex";
    div.innerHTML = `
            <p class="text-wrap col-4">${element.nombre}</p>
            <p class="text-wrap col-2">${element.cantidad}</p>
            <p class="text-wrap col-3 ">$${element.precio}</p>
            <p class="col-3">$${element.precio * element.cantidad}</p>`;
    contenedor.appendChild(div);

    acumulador += element.precio * element.cantidad;
  });

  precio_total.innerText = `Precio Total : $${acumulador.toFixed(2)}`;
  const fechaObj = new Date();
  const fechaFormateada = fechaObj.toLocaleDateString();
  date.innerText = `Fecha : ${fechaFormateada}`;
}

function descargarPDF() {
  const element = document.getElementById("ticket");
  element.classList.add("ticket-pdf");

  const opt = {
    margin: 0.5,
    filename: "ticket_compra.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  };
  html2pdf()
    .set(opt)
    .from(element)
    .save()
    .then(() => {
      element.classList.remove("ticket-pdf");
    });
}

function init() {
  // Usa la copia del carrito para el ticket
  listaCarrito = JSON.parse(localStorage.getItem("ticket_compra")) || [];
  renderTicket();

  // Redirige a inicio después de 10 segundos
  setTimeout(() => {
    window.location.href = "/index.html";
  }, 10000);

  // Evento para descargar el PDF
  if (btnDescargar) {
    btnDescargar.addEventListener("click", descargarPDF);
  }
}

init();
