import { DataTypes } from "sequelize";
import { sequelize } from "../config/db-sequelize.js";

export const Admin = sequelize.define(
    "Admin",
    {
    id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    },
    email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
    isEmail: true
    }
    },
    password: { 
    type: DataTypes.STRING},
    },
    {
    tableName: "admins",
    timestamps: false,
    }
);
