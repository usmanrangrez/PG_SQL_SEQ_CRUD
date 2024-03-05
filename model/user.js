import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    points: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  { freezeTableName: true }
);

sequelize
  .sync()
  .then(() => {
    console.log("User table synched");
  })
  .catch(() => {
    console.log("Error in sync User table");
  });

export default User;
