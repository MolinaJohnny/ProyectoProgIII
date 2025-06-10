document.addEventListener("DOMContentLoaded", () => {
  const nombre = localStorage.getItem("clienteNombre") || "Cliente";
  document.getElementById("clienteBienvenida").textContent = `¡Hola, ${nombre}!`;

  mostrarCategoria("todos"); // Mostrar todo al iniciar
});

const productos = [
  {
    id: 1,
    categoria: "juegos",
    nombre: "Elden Ring",
    precio: 9999,
    imagen: "assets/juegos/eldenring.jpg",
    activo: true
  },
  {
    id: 2,
    categoria: "juegos",
    nombre: "God of War",
    precio: 8999,
    imagen: "assets/juegos/gow.jpg",
    activo: true
  },
  {
    id: 3,
    categoria: "keys",
    nombre: "Steam Key - Hollow Knight",
    precio: 1200,
    imagen: "assets/keys/steam_hk.jpg",
    activo: true
  },
  {
    id: 4,
    categoria: "keys",
    nombre: "PSN Key - Horizon",
    precio: 3000,
    imagen: "assets/keys/ps_horizon.jpg",
    activo: true
  }
];

function mostrarCategoria(categoria) {
  const contenedor = document.getElementById("listaProductos");
  contenedor.innerHTML = "";

  const filtrados = categoria === "todos"
    ? productos.filter(p => p.activo)
    : productos.filter(p => p.activo && p.categoria === categoria);

  filtrados.forEach(prod => {
    const card = document.createElement("div");
    card.className = "col-12 col-sm-6 col-md-4 col-lg-3";
    card.innerHTML = `
      <div class="card h-100 shadow border-info">
        <img src="${prod.imagen}" class="card-img-top" alt="${prod.nombre}">
        <div class="card-body d-flex flex-column justify-content-between">
          <h5 class="card-title">${prod.nombre}</h5>
          <p class="card-text">$${prod.precio}</p>
          <button class="btn btn-info mt-2" onclick="agregarAlCarrito(${prod.id})">Agregar al carrito</button>
        </div>
      </div>
    `;
    contenedor.appendChild(card);
  });
}

function agregarAlCarrito(idProducto) {
  const producto = productos.find(p => p.id === idProducto);
  if (!producto) return;

  let carrito = JSON.parse(localStorage.getItem("productos_carrito")) || [];
  const index = carrito.findIndex(p => p.id === idProducto);

  if (index > -1) {
    carrito[index].cantidad += 1; // Aumentar cantidad si ya existe
  } else {
    carrito.push({ ...producto, cantidad: 1 }); // Agregar nuevo producto
  }

  localStorage.setItem("productos_carrito", JSON.stringify(carrito));
  alert(`Agregado al carrito: ${producto.nombre}`);
}
