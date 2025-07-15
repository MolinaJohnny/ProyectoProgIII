const carrito = document.getElementById("productos_list");
const btn_finalizar = document.getElementById("finalizar_compra");
const btn_cancelar = document.getElementById("cancelar_compra");
const btn_confirmar = document.getElementById("confirmar_compra");
const precioTotal = document.getElementById("precio_total");
const cantidad_productos = document.getElementById("cantidad_productos");

if (!localStorage.getItem("clienteNombre")) {
  window.location.href = "/index.html";
}

let listaCarrito = [];

// Renderiza el carrito y muestra los productos
function renderCarrito() {
  carrito.innerHTML = "";
  let contador_cantidad = 0;
  let contador_precio = 0;

  listaCarrito.forEach((element) => {
    const li = document.createElement("li");
    li.className =
      "row col-12 my-2 justify-content-center justify-content-md-start";

    const img = document.createElement("img");
    img.src = `${element.imagen}`;
    img.className = "img_producto p-0 img-fluid";

    const div1 = document.createElement("div");
    div1.className = "col-md-8 col-xl-9 p-2";

    // Fila superior: nombre y botón eliminar
    const row1 = document.createElement("div");
    row1.className =
      "d-flex align-items-center justify-content-between mb-2 gap-2";

    const nombre = document.createElement("p");
    nombre.className = "h4 mb-0 flex-grow-1 text-break";
    nombre.textContent = element.nombre;

    const buttonDelete = document.createElement("button");
    buttonDelete.className = "btn_delete btn btn-danger btn-sm ms-2";
    buttonDelete.style.minWidth = "40px";
    buttonDelete.innerHTML = `<span class="material-symbols-rounded">delete</span>`;
    buttonDelete.addEventListener("click", () => {
      deleteCarrito(element);
    });

    row1.appendChild(nombre);
    row1.appendChild(buttonDelete);

    // Fila inferior: categoría, precio x cantidad, botones suma/resta
    const row2 = document.createElement("div");
    row2.className = "row text-center";

    const categoria = document.createElement("p");
    categoria.className = "col-12";
    categoria.textContent = `Categoria: ${element.categoria}`;

    const precioCantidad = document.createElement("p");
    precioCantidad.className = "col-6";
    precioCantidad.textContent = `$${element.precio} x ${element.cantidad}`;

    const btnGroup = document.createElement("div");
    btnGroup.className = "btn-group col-6";
    btnGroup.setAttribute("role", "group");

    // Botón sumar cantidad
    const buttonSuma = document.createElement("button");
    buttonSuma.className = "btn_suma btn btn-outline-secondary";
    buttonSuma.innerText = "+";
    buttonSuma.addEventListener("click", () => {
      addCarrito(element);
    });

    // Botón restar cantidad
    const buttonResta = document.createElement("button");
    buttonResta.className = "btn_resta btn btn-outline-secondary";
    buttonResta.innerText = "-";
    buttonResta.addEventListener("click", () => {
      restaCarrito(element);
    });

    btnGroup.appendChild(buttonSuma);
    btnGroup.appendChild(buttonResta);

    row2.appendChild(categoria);
    row2.appendChild(precioCantidad);
    row2.appendChild(btnGroup);

    div1.appendChild(row1);
    div1.appendChild(row2);

    li.appendChild(img);
    li.appendChild(div1);
    carrito.appendChild(li);

    // Suma los totales
    contador_precio += element.precio * element.cantidad;
    contador_cantidad += element.cantidad;
  });

  // Muestra el total y la cantidad de productos
  precioTotal.innerText = `Total : $${contador_precio.toFixed(2)}`;
  cantidad_productos.innerText = `CANTIDAD DE PRODUCTOS : ${contador_cantidad}`;

  guardarProductos();
}

// Suma uno a la cantidad del producto o lo agrega si no existe
function addCarrito(element) {
  const productoExistente = listaCarrito.find((item) => item.id === element.id);

  if (productoExistente && productoExistente.cantidad >= element.stock) {
    const botonAgregar = document.getElementById(`add-${element.id}`);
    if (botonAgregar) {
      botonAgregar.disabled = true;
    }
    Swal.fire({
      toast: true,
      position: "bottom-start",
      icon: "error",
      title: `No hay stock suficiente`,
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
      background: "#222",
      color: "#fff",
    });
    return;
  }

  if (productoExistente) {
    productoExistente.cantidad += 1;
  } else {
    element.cantidad = 1;
    listaCarrito.push(element);
  }
  renderCarrito();
}

// Elimina el producto del carrito
function deleteCarrito(producto) {
  const index = listaCarrito.findIndex((item) => item.id === producto.id);
  if (index > -1) {
    listaCarrito.splice(index, 1);
  }
  renderCarrito();
}

// Resta uno a la cantidad o elimina el producto si la cantidad es 1
function restaCarrito(producto) {
  const index = listaCarrito.findIndex((item) => item.id === producto.id);
  if (index > -1) {
    if (listaCarrito[index].cantidad > 1) {
      listaCarrito[index].cantidad -= 1;
    } else {
      listaCarrito.splice(index, 1);
    }
  }
  renderCarrito();
}

// Guarda el carrito en localStorage
function guardarProductos() {
  localStorage.setItem("productos_carrito", JSON.stringify(listaCarrito));
}

// Vacía el carrito al cancelar la compra
btn_cancelar.addEventListener("click", () => {
  listaCarrito = [];
  renderCarrito();
  guardarProductos();
});

// SOLO ABRE EL MODAL, NO COMPRA
btn_finalizar.addEventListener("click", (e) => {
  e.preventDefault();

  if (listaCarrito.length === 0) {
    Swal.fire({
      toast: true,
      position: "bottom",
      icon: "warning",
      title: "El carrito está vacío",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      background: "#222",
      color: "#fff",
    });
    return;
  }

  // Usar la clase Modal expuesta globalmente por Bootstrap
  const modal = new bootstrap.Modal(
    document.getElementById("modalConfirmarCompra")
  );
  modal.show();
});

// CONFIRMA LA COMPRA SOLO CUANDO EL USUARIO ACEPTA EN EL MODAL
btn_confirmar.addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("/api/ventas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ventas: listaCarrito,
        clienteNombre: localStorage.getItem("clienteNombre") || "Cliente",
      }),
    });
    if (res.ok) {
      // Guarda el carrito para el ticket antes de limpiar
      localStorage.setItem("ticket_compra", JSON.stringify(listaCarrito));
      console.log("Compra realizada con exito!");
      listaCarrito = [];
      renderCarrito();
      guardarProductos();
      const { ventaId } = await res.json();
      // Redirige al ticket
      window.location.href = `/ticket?id=${encodeURIComponent(ventaId)}`;
    } else {
      console.log("Error al registrar la venta");
    }
  } catch (error) {
    console.log("Error de conexion con el servidor");
  }
});

// Inicializa el carrito desde localStorage al cargar la página
function init() {
  listaCarrito = JSON.parse(localStorage.getItem("productos_carrito")) || [];
  // Asegura que cada producto tenga la propiedad categoria como string
  listaCarrito = listaCarrito.map((prod) => ({
    ...prod,
    categoria:
      typeof prod.categoria === "string"
        ? prod.categoria
        : prod.categoria?.nombre || "Sin categoría",
  }));
  renderCarrito();
}
init();

document.addEventListener("DOMContentLoaded", () => {
  const modalElement = document.getElementById("modalConfirmarCompra");
  modalElement.classList.remove("show");
  modalElement.style.display = "none";
  document.body.classList.remove("modal-open");
  const backdrop = document.querySelector(".modal-backdrop");
  if (backdrop) backdrop.remove();
});
