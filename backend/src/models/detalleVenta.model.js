import { DataTypes } from "sequelize";
import { sequelize } from "../config/db-sequelize.js";
import { Venta } from "./venta.model.js";
import { Product } from "./product.model.js";

export const DetalleVenta = sequelize.define(
  "DetalleVenta",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ventaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "ventas", key: "id" },
    },
    productoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "products", key: "id" },
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    precio_unitario: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    tableName: "detalleVenta",
    timestamps: false,
  }
);

DetalleVenta.belongsTo(Venta, { foreignKey: "ventaId" });
DetalleVenta.belongsTo(Product, { foreignKey: "productoId" });
