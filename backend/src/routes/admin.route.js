import { Router } from "express";
import {
  createAdmin,
  findAdminById,
  loginAdmin,
  getIndexAdmin,
} from "../controllers/admin.controller.js";
import {
  getNewProduct,
  getListProductos,
} from "../controllers/product-admin.controller.js";
import { verificarAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/index-admin", getIndexAdmin);

router.post("/index-admin", loginAdmin);

router.post("/api/admins", createAdmin);
router.get("/api/admins/:id", findAdminById);

router.get("/lista-productos", verificarAdmin, getListProductos);
router.get("/mod-producto", verificarAdmin, getNewProduct);

export default router;
