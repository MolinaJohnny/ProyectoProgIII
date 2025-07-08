import { Categoria } from "../models/categoria.model.js";

export const getCategorias = async () => {
  return await Categoria.findAll();
};

export const createCategoria = async (nombre) => {
  return await Categoria.create({ nombre });
};
