import { Router } from "express";
import {
  getIndex,
  getProductos,
  getCarrito,
  getTicket,
  getAllProducts,
  createProduct,
  getIndexAdmin,
  getNewProduct,
  getListProductos,
} from "../controllers/products.controller.js";
import { getProducts } from "../services/product.service.js";

const router = Router();

// Rutas para navegar por el sitio (frontend)
router.get("/", getIndex);
router.get("/productos", getProductos);
router.get("/carrito", getCarrito);
router.get("/ticket", getTicket);
router.get("/index-admin", getIndexAdmin)
router.get("/lista-productos", getListProductos)
router.get("/mod-producto", getNewProduct)

// Rutas de API para productos (CRUD)
router.get("/api/products", getAllProducts); // GET /api/products/api
router.post("/api/products", createProduct); // POST /api/products/api

export default router;
