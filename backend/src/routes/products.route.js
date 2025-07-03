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
  deleteProduct,
} from "../controllers/products.controller.js";
import { getVentasAdmin } from "../controllers/products.controller.js";
import { verificarAdmin } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer-cloudinary.middleware.js";

const router = Router();

// Rutas para navegar por el sitio (frontend)
router.get("/", getIndex);
router.get("/productos", getProductos);
router.get("/carrito", getCarrito);
router.get("/ticket", getTicket);

// Rutas de administración (backend)
router.get("/index-admin", getIndexAdmin);
router.get("/lista-productos", verificarAdmin, getListProductos);
router.get("/mod-producto", verificarAdmin, getNewProduct);
router.get("/ventas", verificarAdmin, getVentasAdmin);

// Rutas de API para productos (CRUD)
router.get("/api/products", getAllProducts);
router.post("/api/products", upload.single("imagen"), createProduct);

router.post("/producto/:id/eliminar", deleteProduct);

router.post("/api/ventas", registrarVentas);

router.get("/modificar-producto/:id", getEditProduct);
router.post("/modificar-producto/:id", upload.single("imagen"), updateProduct);
router.post("/producto/:id/toggle-activo", toggleDisponible);

export default router;
