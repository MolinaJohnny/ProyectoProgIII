import { DataTypes } from "sequelize";
import { sequelize } from "../config/db-sequelize.js";

export const Venta = sequelize.define(
  "Venta",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    usuario: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cantidad_productos: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    precio_total: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "ventas",
    timestamps: false, // si querés desactivar createdAt / updatedAt automáticos
  }
);
