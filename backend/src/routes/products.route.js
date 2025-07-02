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
  toggleDisponible,
} from "../controllers/products.controller.js";
import { getVentasAdmin } from "../controllers/products.controller.js";

import upload from "../middlewares/multer-cloudinary.middleware.js";

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
router.post("/api/products", upload.single("imagen"), createProduct);

router.post("/api/ventas", registrarVentas);

router.get("/modificar-producto/:id", getEditProduct);
router.post("/modificar-producto/:id", upload.single("imagen"), updateProduct);
router.post("/producto/:id/toggle-activo", toggleDisponible);

export default router;
