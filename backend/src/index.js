import express from "express";
import session from "express-session";
import { __dirname, join } from "./utils/index.js";
import routes from "./routes/index.route.js";
import { middlewares } from "./middlewares/auth.middleware.js";
import { sequelize } from "./config/db-sequelize.js";
import { Venta } from "./models/venta.model.js";
import { Admin } from "./models/admin.model.js";

const app = express();
app.set("PORT", process.env.PORT || 5000);

app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));

// Aplica middlewares generales
middlewares(app);

// Configuración de sesión
app.use(
  session({
    secret: "clave_secreta",
    resave: false,
    saveUninitialized: true,
  })
);

// Rutas de API y frontend
app.use("/", routes);

// Servir archivos estáticos de la carpeta frontend
app.use(express.static(join(__dirname, "../../frontend")));

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
