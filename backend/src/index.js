import express from "express";
import { __dirname, join } from "./utils/index.js";
import productRoutes from "./routes/products.route.js";
import { middlewares } from "./middlewares/auth.middleware.js";
import { sequelize } from "./config/db-sequelize.js";

const app = express();
app.set("PORT", process.env.PORT || 5000);

// Aplica middlewares generales
middlewares(app);

// Servir archivos estáticos de la carpeta frontend
app.use(express.static(join(__dirname, "../../frontend")));

// Rutas de API y frontend
app.use("/", productRoutes);

// Inicializa la conexión y sincronización con la base de datos
const initializeConnection = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Database sincronizada");
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
  }
};

initializeConnection();

app.listen(app.get("PORT"), () => {
  console.log(`Servidor corriendo en http://localhost:${app.get("PORT")}`);
});
