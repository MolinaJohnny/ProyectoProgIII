import express from "express";
import { join, __dirname } from "../utils/index.js";

export const middlewares = (app) => {
  app.use(express.json());
  app.use(express.static(join(__dirname, "public")));
  app.use(express.urlencoded({ extended: true }));
};
