import {
  create,
  update,
  getProductById,
  deleteP,
  getProducts,
} from "../services/product.service.js";
import { getCategorias } from "../services/categoria.service.js";
import { Op } from "sequelize"; 

export const getListProductos = async (req, res) => {
  const { categoria, busqueda = "", page= 1 } = req.query;
  const limit = 8; // productos por página
  const offset = (parseInt(page) - 1) * limit;


  const categorias = await getCategorias();

  // Filtro para la consulta a la base
  let filtro = {};
  if (categoria && categoria !== "todos") {
    filtro.categoriaId = Number(categoria);
  }

  if (busqueda.trim() !== "") {
    filtro.nombre = {
      [Op.like]: `%${busqueda.toLowerCase().trim()}%`, 
    };
  }

  // Trae productos paginados y filtrados por categoría si corresponde
  let { rows: productos, count } = await getProducts({
    where: filtro, //where para especificar que registro traer segul el valor del campo
    limit,
    offset,
    include: ["categoria"],
  });

  const totalPaginas = Math.ceil(count / limit);
  const paginaActual = parseInt(page);


  res.render("listProductos", {
    productos,
    categorias,
    categoriaSeleccionada: categoria || "todos",
    busqueda,
    paginaActual,
    totalPaginas,
    count,
  });
};

export const getNewProduct = async (req, res) => {
  const { rows } = await getProducts({ limit: 100, offset: 0 });
  const categorias = await getCategorias();
  res.render("new_product", { productos: rows, categorias });
};

export const createProduct = async (req, res) => {
  try {
    const { categoriaId, nombre, precio, stock } = req.body;
    const imagen = req.file?.path;

    if (!categoriaId || !nombre || !precio || !imagen || stock === undefined) {
      return res.status(400).json({ message: "Todos los campos requeridos" });
    }

    await create({
      categoriaId,
      nombre,
      precio: Number(precio),
      imagen,
      stock: Number(stock),
    });

    res.redirect("/lista-productos");
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error interno del servidor", err: error.message });
  }
};

export const getEditProduct = async (req, res) => {
  const { id } = req.params;
  const producto = await getProductById(id);
  if (!producto) {
    return res.status(404).send("Producto no encontrado");
  }
  const categorias = await getCategorias();
  res.render("modified_product", { producto, categorias });
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { nombre, precio, stock, categoriaId } = req.body;

  try {
    const producto = await getProductById(id);
    if (!producto) return res.status(404).send("Producto no encontrado");

    const imagen = req.file?.path || producto.imagen;

    // Validación
    if (!categoriaId || !nombre || !precio || !imagen || stock === undefined)
      return res.status(400).json({ message: "Todos los campos requeridos" });

    await update(
      {
        nombre,
        precio: Number(precio),
        stock: Number(stock),
        categoriaId: Number(categoriaId),
        imagen,
      },
      id
    );

    res.redirect("/lista-productos");
  } catch (error) {
    console.error("Error en updateProduct:", error);
    res.status(500).json({ message: "Error interno", err: error.message });
  }
};

export const toggleDisponible = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await getProductById(id);

    if (!producto) {
      return res.status(404).send("Producto no encontrado");
    }

    // Cambiar el valor booleano
    if (producto.stock != 0) {
      producto.activo = !producto.activo;
      await producto.save();
    }

    res.redirect("/lista-productos");
  } catch (error) {
    res.status(500).send("Error al actualizar el producto");
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteP(id);
    if (!deleted) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.redirect("/lista-productos");
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar producto", err: error.message });
  }
};