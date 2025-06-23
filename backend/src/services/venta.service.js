import { Venta } from "../models/venta.model.js";

export const getVentas = async () => {
  return await Venta.findAll();
};
