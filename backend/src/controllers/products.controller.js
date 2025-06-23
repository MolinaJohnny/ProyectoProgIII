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
  res.render("index-admin");
};
export const getListProductos = async (req, res) => {
  const productos = await getProducts();
  res.render("listProductos", { productos });
};

export const getNewProduct = async (req, res) => {
  const productos = await getProducts();

  res.render("new_product", { productos });
};

// API: Obtener todos los productos
export const getAllProducts = async (req, res) => {
  try {
    const products = await getProducts();
    // res.render("index-admin", { productos: products });
    res.status(200).json({ message: "Lista de productos", payload: products });
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
    res.render("Ventas_admin", { ventas });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error interno del servidor", err: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { categoria, nombre, precio, imagen, stock } = req.body;
    if (!categoria || !nombre || !precio || !imagen || stock === undefined)
      return res.status(400).json({ message: "Todos los campos requeridos" });
    const newProduct = await create({
      categoria,
      nombre,
      precio,
      imagen,
      stock,
    });
    res
      .status(201)
      .json({ message: "Producto creado con exito", payload: newProduct });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error interno del servidor", err: error.message });
  }
};

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
  const { nombre, precio, stock, categoria, imagen } = req.body;
  await update({ nombre, precio, stock, categoria, imagen }, id);
  res.redirect("/lista-productos");
};
