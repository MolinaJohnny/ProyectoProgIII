if (!localStorage.getItem("clienteNombre")) {
  window.location.href = "/index.html";
}

let productos = [];
let categoriaActual = "todos";
let productosPorPagina = 8;
let paginaActual = 1;

document.addEventListener("DOMContentLoaded", async () => {
  const nombre = localStorage.getItem("clienteNombre") || "Cliente";
  document.getElementById("clienteBienvenida").textContent = `¡Hola, ${nombre}!`;

  try {
    const res = await fetch("/api/products");
    const data = await res.json();
    productos = data.payload.rows || [];
    mostrarCategoria("todos");
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }

  
  document.getElementById("btnAnterior").addEventListener("click", () => cambiarPagina(-1));
  document.getElementById("btnSiguiente").addEventListener("click", () => cambiarPagina(1));
});

const buscador = document.getElementById("buscador");

function mostrarCategoria(categoria) {
  categoriaActual = categoria;
  paginaActual = 1; 
  renderizarProductos(); 
}

function renderizarProductos() {
  const contenedor = document.getElementById("listaProductos");
  contenedor.innerHTML = "";

  const textoBusqueda = buscador.value.toLowerCase().trim();

  const filtrados = productos.filter((p) => {
    const coincideCategoria = categoriaActual === "todos" || p.categoria === categoriaActual;
    const coincideBusqueda = p.nombre.toLowerCase().includes(textoBusqueda);
    return p.activo && coincideCategoria && coincideBusqueda;
  });
    
  // Se divide la cantidad de productos por la cantidad de productos x pagina y se redondea el valor hacia arrib.
  const totalPaginas = Math.ceil(filtrados.length / productosPorPagina);

  // Esto sirve para mostrar solo una parte del total de productos, según la página seleccionada.

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

  document.getElementById("paginaActual").textContent = `Página ${paginaActual} de ${totalPaginas}`;
  document.getElementById("btnAnterior").disabled = paginaActual === 1;
  document.getElementById("btnSiguiente").disabled = paginaActual === totalPaginas || totalPaginas === 0;
}

function cambiarPagina(direccion) {
  paginaActual += direccion;
  renderizarProductos();
}

buscador.addEventListener("input", () => {
  paginaActual = 1; 
  renderizarProductos();
});

function agregarAlCarrito(idProducto) {
  const producto = productos.find((p) => p.id === idProducto);
  if (!producto) return;

  let carrito = JSON.parse(localStorage.getItem("productos_carrito")) || [];
  const index = carrito.findIndex((p) => p.id === idProducto);
  // Si el producto ya existe en el carrito
  if (index > -1) {
    carrito[index].cantidad += 1;
  // Si el producto no se encuentra en el carrito
  } else {
    carrito.push({ ...producto, cantidad: 1 });
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
