import { Router } from "express";
import {
  listarCategorias,
  crearCategoria,
} from "../controllers/categoria.controller.js";

const router = Router();

router.get("/api/categorias", listarCategorias);
router.post("/api/categorias", crearCategoria);

export default router;
