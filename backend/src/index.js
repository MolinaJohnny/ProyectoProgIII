import express from "express";
import { __dirname, join } from "./utils/index.js";
import productRoutes from "./routes/products.route.js";
import adminRoutes from "./routes/admin.route.js";
import { middlewares } from "./middlewares/auth.middleware.js";
import { sequelize } from "./config/db-sequelize.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { Venta } from "./models/venta.model.js";
import { Admin } from "./models/admin.model.js";

const app = express();
app.set("PORT", process.env.PORT || 5000);

const __filename = fileURLToPath(import.meta.url);
const __dirnameApp = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", join(__dirnameApp, "views"));

console.log(join(__dirnameApp, "views"));

// Aplica middlewares generales
middlewares(app);


// Servir archivos estáticos de la carpeta frontend
app.use(express.static(join(__dirname, "../../frontend")));
console.log(join(__dirname, "../../frontend"));

// Rutas de API y frontend
app.use("/", productRoutes);
app.use("/", adminRoutes);

// Inicializa la conexión y sincronización con la base de datos
const initializeConnection = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    await Venta.sync();
    await Admin.sync();
    console.log("Database sincronizada");
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
  }
};

initializeConnection();

app.listen(app.get("PORT"), () => {
  console.log(`Servidor corriendo en http://localhost:${app.get("PORT")}`);
});