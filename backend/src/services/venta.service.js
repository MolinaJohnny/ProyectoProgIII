import { Venta } from "../models/venta.model.js";
import { DetalleVenta } from "../models/detalleVenta.model.js";
import { Product } from "../models/product.model.js";
import { sequelize } from "../config/db-sequelize.js";

export const getTopProductosVendidos = async () => {
  return await DetalleVenta.findAll({
    attributes: [
      "productoId",
      [sequelize.fn("SUM", sequelize.col("cantidad")), "total_vendida"],
    ],
    include: [{ model: Product, as: "Product" }],
    group: ["productoId"],
    order: [[sequelize.literal("total_vendida"), "DESC"]],
    limit: 10,
  });
};

export const getTopVentas = async () => {
  return await Venta.findAll({
    order: [["precio_total", "DESC"]],
    limit: 10,
  });
};

export const getVentas = async () => {
  return await Venta.findAll();
};
