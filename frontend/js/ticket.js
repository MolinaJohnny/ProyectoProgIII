// document.getElementById("descargar").addEventListener("click", () => {
//     const element = document.getElementById("ticket");

//     const opt = {
//     margin: 0.5,
//     filename: 'ticket_compra.pdf',
//     image: { type: 'jpeg', quality: 0.98 },
//     html2canvas: { scale: 2, useCORS: true },
//     jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
//     };

//     html2pdf().set(opt).from(element).save();
// });
const contenedor = document.querySelector(".productos")
const precio_total = document.getElementById("precio_total")
const date = document.getElementById("fecha")

function renderTicket(){
    contenedor.innerHTML = `<div class="productos ">
                                <div class="row col-12 d-flex">
                                    <p class="text-wrap col-3">Producto:</p>
                                    <p class=" text-wrap col-3">Cantidad:</p>
                                    <p class="text-wrap col-3 ">Unitario:</p>
                                    <p class="col-3">Valor_Total:</p>
                                </div>
                            </div> `
    
    listaCarrito.forEach(element => {
        const div = document.createElement("div")
        div.className = "row col-12 d-flex"
        div.innerHTML = `   <p class="text-wrap col-3">${element.nombre}</p>
                            <p class=" text-wrap col-3">${element.cantidad}</p>
                            <p class="text-wrap col-3 ">$${element.precio}</p>
                            <p class="col-3">$${element.precio * element.cantidad}</p>` 
        contenedor.appendChild(div);

        let acumulador = 0;
        acumulador += element.precio * element.cantidad
        precio_total.innerText= `Precio Total : ${acumulador}`
        const fecha = new Date();
        const fechaFormateada = fecha.toLocaleDateString(); 
        date.innerText = `Fecha : ${fechaFormateada}`
    
    });
}

function init(){
    listaCarrito = JSON.parse(localStorage.getItem("productos_carrito")) || [];
    renderTicket()
}

init()