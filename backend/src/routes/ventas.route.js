import { Router } from "express";
import {
  registrarVentas,
  getVentaById,
  getVentasAdmin,
} from "../controllers/venta-admin.controller.js";

const router = Router();

router.post("/api/ventas", registrarVentas);
router.get("/api/ventas/:id", getVentaById);
router.get("/ventas", getVentasAdmin);

export default router;
