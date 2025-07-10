import { join, __dirname } from "../utils/index.js";
import { getProducts } from "../services/product.service.js";

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

export const getAllProducts = async (req, res) => {
  try {
    let { limit, offset } = req.query;
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
