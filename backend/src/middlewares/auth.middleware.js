import express from "express";
import { join, __dirname } from "../utils/index.js";

export const middlewares = (app) => {
  app.use(express.json());
  app.use(express.static(join(__dirname, "public")));
  app.use(express.urlencoded({ extended: true }));
};
export const verificarAdmin = (req, res, next) => {
  if (req.session && req.session.rol === 'admin') {
    return next(); // pasa a la siguiente función
  }
  req.session.errorAcceso = "Acceso denegado. Solo administradores.";
  return res.redirect('/');

};
