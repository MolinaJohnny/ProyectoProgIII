// Redirección si no hay cliente
if (!localStorage.getItem("clienteNombre")) {
  window.location.href = "/index.html";
}

// Variables globales
let productos = [];
let categoriaActual = "todos";
let productosPorPagina = 8;
let paginaActual = 1;

// DOMContentLoaded principal
document.addEventListener("DOMContentLoaded", async () => {
  const nombre = localStorage.getItem("clienteNombre") || "Cliente";
  document.getElementById(
    "clienteBienvenida"
  ).textContent = `¡Hola, ${nombre}!`;

  try {
    const res = await fetch("/api/products");
    const data = await res.json();
    productos = data.payload.rows || [];
    await cargarCategorias();
    mostrarCategoria("todos");
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }

  document
    .getElementById("btnAnterior")
    .addEventListener("click", () => cambiarPagina(-1));
  document
    .getElementById("btnSiguiente")
    .addEventListener("click", () => cambiarPagina(1));
});

// Cargar categorías y generar botones
async function cargarCategorias() {
  const res = await fetch("/api/categorias");
  const data = await res.json();
  const categorias = data.categorias;
  const contenedor = document.getElementById("filtrosCategorias");
  contenedor.innerHTML = `
    <button class="btn btn-secondary" onclick="mostrarCategoria('todos')">🛍️ Todos</button>
    ${categorias
      .map(
        (cat) => `
      <button class="btn btn-primary" onclick="mostrarCategoria(${cat.id})">${cat.nombre}</button>
    `
      )
      .join("")}
  `;
}

// Buscador
const buscador = document.getElementById("buscador");

// Cambiar categoría y renderizar
function mostrarCategoria(categoriaId) {
  categoriaActual = categoriaId;
  paginaActual = 1;
  renderizarProductos();
}

// Renderizar productos y paginación
function renderizarProductos() {
  const contenedor = document.getElementById("listaProductos");
  contenedor.innerHTML = "";

  const textoBusqueda = buscador.value.toLowerCase().trim();

  const filtrados = productos.filter((p) => {
    const coincideCategoria =
      categoriaActual === "todos" || p.categoriaId === Number(categoriaActual);
    const coincideBusqueda = p.nombre.toLowerCase().includes(textoBusqueda);
    return p.activo && coincideCategoria && coincideBusqueda;
  });

  const totalPaginas = Math.ceil(filtrados.length / productosPorPagina);
  const inicio = (paginaActual - 1) * productosPorPagina;
  const fin = inicio + productosPorPagina;
  const productosPagina = filtrados.slice(inicio, fin);

  productosPagina.forEach((prod) => {
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

  document.getElementById(
    "paginaActual"
  ).textContent = `Página ${paginaActual} de ${totalPaginas}`;
  document.getElementById("btnAnterior").disabled = paginaActual === 1;
  document.getElementById("btnSiguiente").disabled =
    paginaActual === totalPaginas || totalPaginas === 0;
}

// Cambiar página
function cambiarPagina(direccion) {
  paginaActual += direccion;
  renderizarProductos();
}

// Buscador input
buscador.addEventListener("input", () => {
  paginaActual = 1;
  renderizarProductos();
});

// Agregar producto al carrito
function agregarAlCarrito(idProducto) {
  const producto = productos.find((p) => p.id === idProducto);
  if (!producto) return;

  let carrito = JSON.parse(localStorage.getItem("productos_carrito")) || [];
  const index = carrito.findIndex((p) => p.id === idProducto);

  if (index > -1) {
    if (carrito[index].cantidad < producto.stock) {
      carrito[index].cantidad += 1;
      mostrarToast(`${producto.nombre} agregado al carrito`);
    } else {
      mostrarToast(`No hay suficiente stock de ${producto.nombre}`, "error");
      return;
    }
  } else {
    if (producto.stock > 0) {
      carrito.push({ ...producto, cantidad: 1 });
      mostrarToast(`${producto.nombre} agregado al carrito`);
    } else {
      mostrarToast(`Producto sin stock`, "error");
      return;
    }
  }

  localStorage.setItem("productos_carrito", JSON.stringify(carrito));
}

// Toast de feedback
function mostrarToast(mensaje, tipo = "success") {
  Swal.fire({
    toast: true,
    position: "bottom-start",
    icon: tipo,
    title: mensaje,
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    background: "#222",
    color: "#fff",
  });
}
