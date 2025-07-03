import { join, __dirname } from "../utils/index.js";
import {
  getProducts,
  create,
  update,
  getProductById,
  deleteP,
} from "../services/product.service.js";
import { getVentas } from "../services/venta.service.js";
import { Venta } from "../models/venta.model.js";

// Rutas para servir archivos frontend
export const getIndex = (req, res) => {
  req.session.rol = "usuario";
  console.log("Ingreso al index, rol reiniciado a:", req.session.rol);

  res.sendFile(join(__dirname, "../../frontend/index.html")); //
};

export const getProductos = (req, res) => {
  res.sendFile(join(__dirname, "../../frontend/productos.html")); //
};

export const getCarrito = (req, res) => {
  res.sendFile(join(__dirname, "../../frontend/carrito.html"));
};

export const getTicket = (req, res) => {
  res.sendFile(join(__dirname, "../../frontend/ticket.html"));
};

// Rutas para servir archivos BACKEND
export const getIndexAdmin = async (req, res) => {
  const mensaje = req.session.errorAcceso;

  req.session.errorAcceso = null;

  res.render("index-admin", { error: mensaje });
};

//renderiza los productos categoria todos, vista admin
export const getListProductos = async (req, res) => {
  const { categoria } = req.query;
  const { rows } = await getProducts({ limit: 1000, offset: 0 });

  let productos = rows;

  if (categoria && categoria !== "todos") {
    productos = productos.filter((p) => p.categoria === categoria);
  }

  res.render("listProductos", { productos });
};

//renderiza el form
export const getNewProduct = async (req, res) => {
  const { rows } = await getProducts({ limit: 100, offset: 0 });
  res.render("new_product", { productos: rows });
};

// API: Obtener todos los productos
export const getAllProducts = async (req, res) => {
  try {
    let { limit, offset } = req.query;
    limit = parseInt(limit, 10);
    offset = parseInt(offset, 10);
    limit = isNaN(limit) ? 10 : limit;
    offset = isNaN(offset) ? 0 : offset;
    const products = await getProducts({ limit, offset });
    res.status(200).json({
      message: "Lista de productos",
      payload: { limit, offset, ...products },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error interno del servidor", err: error.message });
  }
};

//mostrar ventas admin
export const getVentasAdmin = async (req, res) => {
  try {
    const ventas = await getVentas();
    res.render("ventas_admin", { ventas });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error interno del servidor", err: error.message });
  }
};

//metodo form crear producto
export const createProduct = async (req, res) => {
  try {
    const { categoria, nombre, precio, stock } = req.body;
    const imagen = req.file?.path;

    if (!categoria || !nombre || !precio || !imagen || stock === undefined) {
      return res.status(400).json({ message: "Todos los campos requeridos" });
    }

    const categoriasValidas = ["juegos", "keys"];
    if (!categoriasValidas.includes(categoria.toLowerCase())) {
      return res
        .status(400)
        .json({ message: "Categoría inválida. Debe ser 'juegos' o 'keys'" });
    }

    await create({
      categoria,
      nombre,
      precio: Number(precio),
      imagen,
      stock: Number(stock),
    });

    res.redirect("/lista-productos");
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error interno del servidor", err: error.message });
  }
};

//funcion registrar ventas
export const registrarVentas = async (req, res) => {
  try {
    const { ventas } = req.body;
    if (!ventas || !Array.isArray(ventas) || ventas.length === 0) {
      return res.status(400).json({ message: "No hay ventas para registrar" });
    }
    // Guarda cada producto vendido como una fila en la tabla ventas
    for (const v of ventas) {
      await Venta.create({
        nombre: v.nombre,
        categoria: v.categoria,
        precio: v.precio,
        cantidad: v.cantidad,
        fecha: new Date(), // Fecha actual
      });

      //actualizar stock
      const producto = await getProductById(v.id);
      if (producto) {
        producto.stock = Math.max(0, producto.stock - v.cantidad);
        if (producto.stock === 0) {
          producto.activo = false;
        }
        await producto.save();
      }
    }
    res.status(201).json({ message: "Ventas registradas" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al registrar ventas", error: error.message });
  }
};

// Mostrar formulario con datos actuales
export const getEditProduct = async (req, res) => {
  const { id } = req.params;
  const producto = await getProductById(id);
  if (!producto) {
    return res.status(404).send("Producto no encontrado");
  }
  res.render("modified_product", { producto });
};

// Procesar edición
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { nombre, precio, stock, categoria } = req.body;

  try {
    const producto = await getProductById(id);
    if (!producto) return res.status(404).send("Producto no encontrado");

    const imagen = req.file?.path || producto.imagen;

    // Validación
    if (!categoria || !nombre || !precio || !imagen || stock === undefined)
      return res.status(400).json({ message: "Todos los campos requeridos" });

    if (
      typeof categoria !== "string" ||
      typeof nombre !== "string" ||
      typeof imagen !== "string" ||
      isNaN(Number(precio)) ||
      isNaN(Number(stock))
    ) {
      return res.status(400).json({ message: "Tipos de datos inválidos" });
    }

    const categoriasValidas = ["juegos", "keys"];
    if (!categoriasValidas.includes(categoria.toLowerCase())) {
      return res
        .status(400)
        .json({ message: "Categoría inválida. Debe ser 'juegos' o 'keys'" });
    }

    await update(
      {
        nombre,
        precio: Number(precio),
        stock: Number(stock),
        categoria,
        imagen,
      },
      id
    );

    res.redirect("/lista-productos");
  } catch (error) {
    console.error("Error en updateProduct:", error);
    res.status(500).json({ message: "Error interno", err: error.message });
  }
};

export const toggleDisponible = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await getProductById(id);

    if (!producto) {
      return res.status(404).send("Producto no encontrado");
    }

    // Cambiar el valor booleano
    if (producto.stock != 0) {
      producto.activo = !producto.activo;
      await producto.save();
    }

    res.redirect("/lista-productos");
  } catch (error) {
    res.status(500).send("Error al actualizar el producto");
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteP(id);
    if (!deleted) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.redirect("/lista-productos");
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar producto", err: error.message });
  }
};
