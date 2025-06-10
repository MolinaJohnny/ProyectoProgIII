export class Product {
    constructor(nombre, tipo, precio, imagen){
        this.id = crypto.randomUUID();
        this.nombre = nombre;
        this.tipo = tipo;
        this.precio = precio;
        this.imagen = imagen;
        this.activo = true;
    }
}