import { Sequelize } from "sequelize";

const sequelize = new Sequelize("database_name", "user", "password", {
  host: "localhost",
  dialect: "postgres",
});
