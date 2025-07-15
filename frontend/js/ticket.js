const contenedor = document.querySelector(".productos");
const precio_total = document.getElementById("precio_total");
const date = document.getElementById("fecha");
const btnDescargar = document.getElementById("descargar");
const nombreUsuario = document.getElementById("nombre_usuario_ticket");

// Obtener el ID de la venta desde la URL (?id=123)
function getVentaIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function obtenerVenta(id) {
  const res = await fetch(`/api/ventas/${id}`);
  if (!res.ok) throw new Error("No se pudo obtener la venta");
  const data = await res.json();
  return data;
}

function renderTicket({ venta, productos }) {
  // Mostrar el nombre del usuario
  if (nombreUsuario && venta && venta.usuario) {
    nombreUsuario.textContent = venta.usuario;
  } else if (nombreUsuario) {
    nombreUsuario.textContent = "NOMBRE USUARIO";
  }

  contenedor.innerHTML = `
    <div class="row fw-bold border-bottom pb-2 mb-2">
      <div class="col-4">Producto</div>
      <div class="col-2">Cant.</div>
      <div class="col-3">Unitario</div>
      <div class="col-3">Total</div>
    </div>
  `;

  // Mostrar productos si existen
  if (productos && productos.length > 0) {
    productos.forEach((prod) => {
      const div = document.createElement("div");
      div.className = "row col-12 d-flex";
      div.innerHTML = `
        <p class="text-wrap col-4">${prod.nombre}</p>
        <p class="text-wrap col-2">${prod.cantidad}</p>
        <p class="text-wrap col-3">$${Number(prod.precio).toFixed(2)}</p>
        <p class="col-3">$${(prod.precio * prod.cantidad).toFixed(2)}</p>`;
      contenedor.appendChild(div);
    });
  } else {
    // Fallback si no hay detalle
    const div = document.createElement("div");
    div.className = "row col-12 d-flex";
    div.innerHTML = `
      <p class="text-wrap col-4">Productos varios</p>
      <p class="text-wrap col-2">${venta.cantidad_productos}</p>
      <p class="text-wrap col-3 ">-</p>
      <p class="col-3">$${venta.precio_total.toFixed(2)}</p>`;
    contenedor.appendChild(div);
  }

  precio_total.innerText = `Precio Total : $${venta.precio_total.toFixed(2)}`;
  const fechaObj = new Date(venta.fecha);
  const fechaFormateada = fechaObj.toLocaleDateString();
  date.innerText = `Fecha : ${fechaFormateada}`;
}

function descargarPDF() {
  const element = document.getElementById("ticket");
  element.classList.add("ticket-pdf");

  const opt = {
    margin: 0.1,
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

async function init() {
  const ventaId = getVentaIdFromUrl();
  if (!ventaId) {
    window.location.href = "/index.html";
    return;
  }

  try {
    const data = await obtenerVenta(ventaId);
    renderTicket(data);
  } catch (error) {
    alert("No se pudo cargar el ticket");
    window.location.href = "/index.html";
    return;
  }

  if (btnDescargar) {
    btnDescargar.addEventListener("click", descargarPDF);
  }
}

init();
