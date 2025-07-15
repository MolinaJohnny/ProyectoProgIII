import {
  crearEncuesta as crearEncuestaService,
  obtenerEncuestas as obtenerEncuestasService,
} from "../services/encuesta.service.js";

export const crearEncuesta = async (req, res) => {
  try {
    const { email, opinion, ayuda, puntuacion } = req.body;
    let imagen = null;
    if (req.file) {
      imagen = req.file.path;
    }
    const encuesta = await crearEncuestaService({
      email,
      opinion,
      ayuda: ayuda === "on" || ayuda === true,
      puntuacion,
      imagen,
    });
    res.status(201).json(encuesta);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const obtenerEncuestas = async (req, res) => {
  try {
    const { desde, hasta, ayuda } = req.query;
    let filtros = {};
    if (desde && hasta) {
      filtros.fecha = { $between: [new Date(desde), new Date(hasta)] };
    }
    if (ayuda !== undefined) {
      filtros.ayuda = ayuda === "true";
    }
    const encuestas = await obtenerEncuestasService(filtros);
    res.status(200).json(encuestas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
