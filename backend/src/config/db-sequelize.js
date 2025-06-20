//ORM
import { Sequelize } from "sequelize";
import envs from "./envs.js";
const { host, user, password, database, port } = envs.db_config;

//nueva instancia de sequelize
export const sequelize = new Sequelize(database, user, password, {
  host: host,
  dialect: "mysql", //dialecto (con que tipo de db va a trabajar)
  port: port, //configurar en variable de entorno
});

try {
  //Conexion a db
  await sequelize.authenticate();
  console.log("Database is connected with SEQUELIZE");
} catch (error) {
  console.error(error);
}
