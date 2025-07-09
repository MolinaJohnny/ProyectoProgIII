import { Product } from "../models/product.model.js";
import { Categoria } from "../models/categoria.model.js";

export const getProducts = async (options = {}) => {
  // Asegura que el include sea el modelo, no solo el string
  if (options.include && options.include.includes("categoria")) {
    //traduce al formato que Sequelize necesita para traer la relación correctamente.
    options.include = [{ model: Categoria, as: "categoria" }];
  }
  // Por defecto, ordena por fecha de creación descendente
  if (!options.order) {
    options.order = [["createdAt", "DESC"]];
  }
  return await Product.findAndCountAll(options);
};

export const create = async (product) => {
  return await Product.create(product);
};

export const update = async (product, id) => {
  return await Product.update(product, { where: { id: id } });
};

export const deleteP = async (id) => {
  return await Product.destroy({ where: { id: id } });
};

export const getProductById = async (id) => {
  return await Product.findByPk(id);
};
