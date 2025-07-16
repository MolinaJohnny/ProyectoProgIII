import { findPk, create, getAdminByEmail } from "../services/admin.service.js";
import { obtenerEncuestas } from "../services/encuesta.service.js";
import { hashPassword } from "../helpers/authHelper.js";

import bcrypt from "bcrypt";

export const getIndexAdmin = async (req, res) => {
  const mensaje = req.session.errorAcceso;

  req.session.errorAcceso = null;

  res.render("index-admin", { error: mensaje });
};

export const createAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Todos los campos requeridos " });

    const passHash = await hashPassword(password);

    const newAdmin = await create({ email, password: passHash });

    res
      .status(201)
      .json({ message: "Usuario creado con exito ", payload: newAdmin });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error interno del servido", err: error.message });
  }
};

export const findAdminById = async (req, res) => {
  try {
    const { id } = req.params;

    const adminFound = await findPk(id);
    if (!adminFound)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.status(200).json({ payload: adminFound });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error interno del servidor", err: error.message });
  }
};

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await getAdminByEmail(email);

    if (!admin) {
      return res
        .status(401)
        .render("index-admin", { error: "Usuario o contraseña incorrectos" });
    }

    const passwordValida = await bcrypt.compare(password, admin.password);
    if (!passwordValida) {
      return res
        .status(401)
        .render("index-admin", { error: "Usuario o contraseña incorrectos" });
    }
    // Si todo está bien, redirige al panel o dashboard
    req.session.rol = "admin";

    res.redirect("/lista-productos");
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error interno del servidor", err: error.message });
  }
};

export const getAsistencias = async (req, res) => {
  const { desde, hasta } = req.query;
  let filtros = { ayuda: true };
  let usandoFiltroFecha = false;
  if (desde && hasta) {
    filtros.fecha = { desde, hasta };
    usandoFiltroFecha = true;
  }
  const asistencias = await obtenerEncuestas(filtros);
  res.render("asistencia_admin", { asistencias, desde, hasta });
};
