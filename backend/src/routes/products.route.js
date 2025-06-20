import { Router } from "express";
import {
  getIndex,
  getProductos,
  getCarrito,
  getTicket,
  getAllProducts,
  createProduct,
} from "../controllers/products.controller.js";

const router = Router();

// Rutas para navegar por el sitio (frontend)
router.get("/", getIndex);
router.get("/productos", getProductos);
router.get("/carrito", getCarrito);
router.get("/ticket", getTicket);

// Rutas de API para productos (CRUD)
router.get("/api/products", getAllProducts); // GET /api/products/api
router.post("/api/products", createProduct); // POST /api/products/api

export default router;
