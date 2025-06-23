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
  registrarVentas,
  getEditProduct,
  updateProduct,
} from "../controllers/products.controller.js";
import { getProducts } from "../services/product.service.js";
import { getVentasAdmin } from "../controllers/products.controller.js";

const router = Router();

// Rutas para navegar por el sitio (frontend)
router.get("/", getIndex);
router.get("/productos", getProductos);
router.get("/carrito", getCarrito);
router.get("/ticket", getTicket);
router.get("/index-admin", getIndexAdmin);
router.get("/lista-productos", getListProductos);
router.get("/mod-producto", getNewProduct);

router.get("/ventas", getVentasAdmin);

// Rutas de API para productos (CRUD)
router.get("/api/products", getAllProducts);
router.post("/api/products", createProduct);

router.post("/api/ventas", registrarVentas);

router.get("/modificar-producto/:id", getEditProduct);
router.post("/modificar-producto/:id", updateProduct);
export default router;
