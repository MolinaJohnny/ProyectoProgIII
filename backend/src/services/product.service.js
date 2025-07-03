import { Product } from "../models/product.model.js";

export const getProducts = async () => {
  return await Product.findAndCountAll({
    order: [["createdAt", "DESC"]],
  });
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
