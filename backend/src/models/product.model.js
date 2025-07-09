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
//cada producto pertenece a una categoría.
Product.belongsTo(Categoria, { foreignKey: "categoriaId", as: "categoria" }); //El campo categoriaId en la tabla products es la clave foránea que apunta al campo id de la tabla categorias.

// una categoría puede tener muchos productos.
Categoria.hasMany(Product, { foreignKey: "categoriaId", as: "productos" }); //permite acceder a todos los productos de una categoría con categoria.productos.
