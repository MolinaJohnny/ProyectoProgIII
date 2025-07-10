import { Router } from "express";
import {
  getIndex,
  getProductos,
  getCarrito,
  getTicket,
  getAllProducts,
} from "../controllers/products.controller.js";
import {
  getEditProduct,
  updateProduct,
  toggleDisponible,
  deleteProduct,
  createProduct,
} from "../controllers/product-admin.controller.js";
import upload from "../middlewares/multer-cloudinary.middleware.js";
import { paginacion } from "../middlewares/paginacion.middleware.js";

const router = Router();

// Navegación usuario
router.get("/", getIndex);
router.get("/productos", getProductos);
router.get("/carrito", getCarrito);
router.get("/ticket", getTicket);

// API productos
router.get("/api/products", paginacion, getAllProducts);
router.post("/api/products", upload.single("imagen"), createProduct);
router.get("/modificar-producto/:id", getEditProduct);
router.post("/modificar-producto/:id", upload.single("imagen"), updateProduct);
router.post("/producto/:id/toggle-activo", toggleDisponible);
router.post("/producto/:id/eliminar", deleteProduct);

export default router;
