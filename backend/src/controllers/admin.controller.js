import { findPk, create } from "../services/admin.services.js";
import { hashPassword } from "../helpers/authHelper.js";
import { getAdminByEmail } from "../services/admin.services.js";
import bcrypt from "bcrypt";

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
        .render("index-admin", { error: "Usuario no encontrado" });
    }

    const passwordValida = await bcrypt.compare(password, admin.password);
    if (!passwordValida) {
      return res
        .status(401)
        .render("index-admin", { error: "Contraseña incorrecta" });
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
