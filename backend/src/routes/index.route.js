import { Router } from "express";
import productsRoutes from "./products.route.js";
import adminRoutes from "./admin.route.js";
import categoriasRoutes from "./categorias.route.js";
import ventasRoutes from "./ventas.route.js";
import encuestaRoutes from "./encuesta.route.js";

const routes = Router();

routes.use(productsRoutes);
routes.use(adminRoutes);
routes.use(categoriasRoutes);
routes.use(ventasRoutes);
routes.use(encuestaRoutes);

export default routes;
