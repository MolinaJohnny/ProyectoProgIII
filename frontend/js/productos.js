if (!localStorage.getItem("clienteNombre")) {
  window.location.href = "/index.html";
}

let productos = [];

document.addEventListener("DOMContentLoaded", async () => {
  const nombre = localStorage.getItem("clienteNombre") || "Cliente";
  document.getElementById(
    "clienteBienvenida"
  ).textContent = `¡Hola, ${nombre}!`;

  // Obtener productos desde la API
  try {
    const res = await fetch("/api/products");
    const data = await res.json();
    productos = data.payload.rows || [];
    mostrarCategoria("todos");
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
});

function mostrarCategoria(categoria) {
  const contenedor = document.getElementById("listaProductos");
  contenedor.innerHTML = "";

  const filtrados =
    categoria === "todos"
      ? productos.filter((p) => p.activo)
      : productos.filter((p) => p.activo && p.categoria === categoria);

  filtrados.forEach((prod) => {
    const card = document.createElement("div");
    card.className = "col-12 col-sm-6 col-md-4 col-lg-3";
    card.innerHTML = `
      <div class="card h-100 shadow border-info">
        <img src="${prod.imagen}" class="card-img-top" alt="${prod.nombre}">
        <div class="card-body d-flex flex-column justify-content-between">
          <h5 class="card-title">${prod.nombre}</h5>
          <p class="card-text">$${prod.precio}</p>
          <div class="d-flex justify-content-center">
            <button class="btn btn-info mt-2 w-100" onclick="agregarAlCarrito(${prod.id})">Agregar al carrito</button>
          </div>
        </div>
      </div>
    `;
    contenedor.appendChild(card);
  });
}

function agregarAlCarrito(idProducto) {
  const producto = productos.find((p) => p.id === idProducto);
  if (!producto) return;

  let carrito = JSON.parse(localStorage.getItem("productos_carrito")) || [];
  const index = carrito.findIndex((p) => p.id === idProducto);

  if (index > -1) {
    carrito[index].cantidad += 1; // Aumentar cantidad si ya existe
  } else {
    carrito.push({ ...producto, cantidad: 1 }); // Agregar nuevo producto
  }

  localStorage.setItem("productos_carrito", JSON.stringify(carrito));
  Swal.fire({
    toast: true,
    position: "bottom-start",
    icon: "success",
    title: `Agregado al carrito: ${producto.nombre}`,
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    background: "#222",
    color: "#fff",
  });
}
