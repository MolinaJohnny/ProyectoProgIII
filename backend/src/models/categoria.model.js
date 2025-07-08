import { DataTypes } from "sequelize";
import { sequelize } from "../config/db-sequelize.js";

export const Categoria = sequelize.define(
  "Categoria",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "categorias",
    timestamps: false,
  }
);
