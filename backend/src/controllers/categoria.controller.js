import {
  getCategorias,
  createCategoria,
} from "../services/categoria.service.js";

export const listarCategorias = async (req, res) => {
  try {
    const categorias = await getCategorias();
    res.status(200).json({ categorias });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener categorías", error: error.message });
  }
};

export const crearCategoria = async (req, res) => {
  try {
    const { nombre } = req.body;
    const nueva = await createCategoria(nombre);
    res.status(201).json({ categoria: nueva });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear categoría", error: error.message });
  }
};
