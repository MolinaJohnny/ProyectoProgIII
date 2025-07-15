import { DataTypes } from "sequelize";
import { sequelize } from "../config/db-sequelize.js";
const Encuesta = sequelize.define("Encuesta", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  opinion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  ayuda: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  puntuacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  imagen: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

export default Encuesta;
