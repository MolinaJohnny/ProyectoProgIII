import mysql from "mysql2/promise";
import envs from "./envs.js";

const { host, user, password, database } = envs.db_config;

const pool = mysql.createPool({
  host: host,
  user: user,
  password: password,
  database: database,
});

const connection = await pool.getConnection();
try {
  connection.release();
  console.log("Database is connected");
} catch (err) {
  console.log(err);
}

export default connection;
