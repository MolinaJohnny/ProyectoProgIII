import { join, __dirname } from "../utils/index.js";
import {
  getProducts,
  create,
  update,
  deleteP,
} from "../services/product.service.js";

// Rutas para servir archivos frontend
export const getIndex = (req, res) => {
  res.sendFile(join(__dirname, "../../frontend/index.html"));
};

export const getProductos = (req, res) => {
  res.sendFile(join(__dirname, "../../frontend/productos.html"));
};

export const getCarrito = (req, res) => {
  res.sendFile(join(__dirname, "../../frontend/carrito.html"));
};

export const getTicket = (req, res) => {
  res.sendFile(join(__dirname, "../../frontend/ticket.html"));
};

// API: Obtener todos los productos
export const getAllProducts = async (req, res) => {
  try {
    const products = await getProducts();
    res.status(200).json({ message: "Lista de productos", payload: products });
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
