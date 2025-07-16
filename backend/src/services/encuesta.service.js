import Encuesta from "../models/encuesta.model.js";
import { Op } from "sequelize";

export const crearEncuesta = async (data) => {
  return await Encuesta.create(data);
};

export const obtenerEncuestas = async (filtros) => {
  const where = {};
  // Filtro de fechas inclusivo convierte a fecha local
  if (filtros.fecha && filtros.fecha.desde && filtros.fecha.hasta) {
    const desde = new Date(filtros.fecha.desde + "T00:00:00");
    const hasta = new Date(filtros.fecha.hasta + "T23:59:59");
    where.fecha = {
      [Op.gte]: desde,
      [Op.lte]: hasta,
    };
  }
  if (filtros.ayuda !== undefined) {
    where.ayuda = { [Op.or]: [true, "true", "on", 1] };
  }
  return await Encuesta.findAll({ where });
};
