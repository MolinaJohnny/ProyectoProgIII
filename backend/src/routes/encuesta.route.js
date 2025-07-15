import { Router } from "express";
import upload from "../middlewares/multer-cloudinary.middleware.js";
import {
  crearEncuesta,
  obtenerEncuestas,
} from "../controllers/encuesta.controller.js";

const router = Router();

router.post("/api/encuestas", upload.single("imagen"), crearEncuesta);
router.get("/api/encuestas", obtenerEncuestas);

export default router;
