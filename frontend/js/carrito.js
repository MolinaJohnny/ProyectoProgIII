const carrito = document.getElementById("productos_list");
const btn_finalizar = document.getElementById("finalizar_compra");
const btn_cancelar = document.getElementById("cancelar_compra");
const precioTotal = document.getElementById("precio_total");
const cantidad_productos = document.getElementById("cantidad_productos");

let listaCarrito = [];

// Renderiza el carrito y agrega los botones de sumar, restar y eliminar con sus eventos
function renderCarrito() {
    carrito.innerHTML = "";
    let contador_cantidad = 0;
    let contador_precio = 0;

    listaCarrito.forEach(element => {
        const li = document.createElement("li");
        li.className = "row col-12 my-2 justify-content-center justify-content-md-start";

        const img = document.createElement("img");
        img.src = `${element.imagen}`;
        img.className = "img_producto p-0 img-fluid";

        const div1 = document.createElement("div");
        div1.className = "col-md-8 col-xl-9 p-2";

        // Botón eliminar (ahora es un <button> para mejor compatibilidad)
        const buttonDelete = document.createElement("button");
        buttonDelete.className = "btn_delete col-md-2 col-4 btn btn-danger";
        buttonDelete.innerHTML = `<span class="material-symbols-rounded">delete</span>`;
        // Se asigna el evento directamente al botón creado para cada producto
        buttonDelete.addEventListener("click", () => {
            deleteCarrito(element);
        });

        // Botón sumar cantidad
        const buttonSuma = document.createElement("button");
        buttonSuma.className = "btn_suma btn btn-outline-secondary";
        buttonSuma.innerText = "+";
        buttonSuma.addEventListener("click", () => {
            addCarrito(element); // Suma uno a la cantidad
        });

        // Botón restar cantidad
        const buttonResta = document.createElement("button");
        buttonResta.className = "btn_resta btn btn-outline-secondary";
        buttonResta.innerText = "-";
        buttonResta.addEventListener("click", () => {
            restaCarrito(element); // Resta uno a la cantidad o elimina si es 1
        });

        // --- CAMBIO: Se elimina el uso de innerHTML mezclado con appendChild ---
        // Se arma toda la estructura del producto usando solo createElement y appendChild

        // Fila superior: nombre y botón eliminar
        const row1 = document.createElement("div");
        row1.className = "row col-12";
        const nombre = document.createElement("p");
        nombre.className = "col-7 col-md-9 h3";
        nombre.textContent = element.nombre;
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
    precioTotal.innerText = `Total : $${contador_precio}`;
    cantidad_productos.innerText = `CANTIDAD DE PRODUCTOS : ${contador_cantidad}`;

    guardarProductos(); // Guarda el carrito actualizado en localStorage
}

// Suma uno a la cantidad del producto o lo agrega si no existe
function addCarrito(element) {
    const productoExistente = listaCarrito.find(item => item.id === element.id);

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
    const index = listaCarrito.findIndex(item => item.id === producto.id);
    listaCarrito.splice(index, 1);
    renderCarrito();
}

// Resta uno a la cantidad o elimina el producto si la cantidad es 1
function restaCarrito(producto) {
    const index = listaCarrito.findIndex(item => item.id === producto.id);
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

// Muestra el modal al finalizar la compra (asegúrate de tener el modal en tu HTML)
btn_finalizar.addEventListener("click", () => {
    $('#myModal').modal();
});

// Inicializa el carrito desde localStorage al cargar la página
function init() {
    listaCarrito = JSON.parse(localStorage.getItem("productos_carrito")) || [];
    renderCarrito();
}
init();