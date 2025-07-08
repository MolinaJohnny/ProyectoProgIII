import { DataTypes } from "sequelize";
import { sequelize } from "../config/db-sequelize.js";
import { Categoria } from "./categoria.model.js";

export const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    categoriaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "categorias",
        key: "id",
      },
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    precio: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    imagen: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "products",
  }
);

//! REPASAR
Product.belongsTo(Categoria, { foreignKey: "categoriaId", as: "categoria" });
Categoria.hasMany(Product, { foreignKey: "categoriaId", as: "productos" });
