import dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.PORT,
  db_config: {
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  },
};
