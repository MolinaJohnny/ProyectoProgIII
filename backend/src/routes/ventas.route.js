import { Router } from "express";
import {
  registrarVentas,
  getVentaById,
  getRankingAdmin,
} from "../controllers/venta-admin.controller.js";

const router = Router();

router.post("/api/ventas", registrarVentas);
router.get("/api/ventas/:id", getVentaById);
router.get("/ventas", getRankingAdmin);

router.get("/ranking-ventas", getRankingAdmin);

export default router;
