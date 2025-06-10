
const carrito = document.getElementById("productos_list")
const btn_finalizar = document.getElementById("finalizar_compra")
const btn_cancelar = document.getElementById("cancelar_compra")
const precioTotal = document.getElementById("precio_total")
const cantidad_productos = document.getElementById("cantidad_productos")


function renderCarrito(){
    carrito.innerHTML = ""
    listaCarrito.forEach(element =>{
        const li = document.createElement("li")
        li.className = "row col-12 my-2 justify-content-center justify-content-md-start"

        const img = document.createElement("img")
        
        img.src = `${element.imagen}`
        img.className = "img_producto p-0 img-fluid"

        const div1 = document.createElement("div")
        div1.className = "col-md-9 col-xl-10 p-2"

        const buttonDelete = document.createElement("btn")
        buttonDelete.id = ""
        buttonDelete.className= " btn_delete col-md-2 col-4 btn btn-danger"
        buttonDelete.innerHTML = `<span class="material-symbols-rounded"> delete </span>`
        buttonDelete.addEventListener("click", ()=>{
            console.log("borrar")
        })
        div1.innerHTML = `<div class="row"><p class="col-7 col-md-10 h3"> ${element.nombre}</p>${buttonDelete.outerHTML}</div>`


        const buttonSuma = document.createElement("btn")
        buttonSuma.className = "btn_suma btn btn-outline-secondary"
        buttonSuma.innerText = "+"
        buttonSuma.addEventListener("click", ()=>{
            console.log("suma")
        })
        const buttonResta = document.createElement("btn")
        buttonResta.className = "btn_resta btn btn-outline-secondary"
        buttonResta.innerText = "-"
        

        div1.innerHTML += `<div class= "row text-center"><p class="col-12"> Categoria: ${element.categoria}</p><p class= "col-6"> $${element.precio} x ${element.cantidad}</p>
                                    <div class = "btn-group col-6" role="group">${buttonSuma.outerHTML} ${buttonResta.outerHTML}</div></div>`
        li.appendChild(img);
        li.appendChild(div1);
        carrito.appendChild(li);


        // EVENTOS
        const btn_delete = document.querySelector(".btn_delete")
        btn_delete.addEventListener("click", ()=>{
            deleteCarrito(element)
        })
        
        const btn_resta = document.querySelector(".btn_resta")
        btn_resta.addEventListener("click", () =>{
            restaCarrito(element)
        })
        
        const btn_suma = document.querySelector(".btn_suma")
        btn_suma.addEventListener("click", ()=>{
            addCarrito(element);
        })

        // CONTADORES
        let contador_cantidad = 0
        let contador_precio = 0
        contador_precio += element.precio * element.cantidad
        contador_cantidad += element.cantidad 

        precioTotal.innerText = `Total : $${contador_precio}`
        cantidad_productos.innerText = `CANTIDAD DE PRODUCTOS : ${contador_cantidad}`
        
        
        guardarProductos();


    }
    )
}

function addCarrito(element){
    const productoExistente = listaCarrito.find(item => item.id === element.id);

    if (productoExistente) {
        
        productoExistente.cantidad += 1;
    } else {
        element.cantidad = 1;
        listaCarrito.push(element);
    }
    renderCarrito();   
};

function deleteCarrito(producto){
    const index = listaCarrito.findIndex(item => item.id === producto.id);

    listaCarrito.splice(index, 1);
        

    renderCarrito();
}
function restaCarrito(producto){
    const index = listaCarrito.findIndex(item => item.id === producto.id);

        if (listaCarrito[index].cantidad > 1) {
            listaCarrito[index].cantidad -= 1;
        } else {
            listaCarrito.splice(index, 1);
        }

    renderCarrito();
}

function guardarProductos(){
    localStorage.setItem("productos_carrito", JSON.stringify(listaCarrito))
    
}

btn_cancelar.addEventListener("click", ()=>{
    listaCarrito= []
})
btn_finalizar.addEventListener("click", ()=>{
    $('#myModal').modal(options)
})







function init(){
    listaCarrito = JSON.parse(localStorage.getItem("productos_carrito")) || [];

    renderCarrito()

}
init()
