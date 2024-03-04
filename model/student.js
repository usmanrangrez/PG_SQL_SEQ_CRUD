import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Student = sequelize.define(
  "student",
  {
    student_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [4, 20],
          msg: "Name must be between 4 and 20 characters long",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isValidPassword(value) {
          const passwordRegex =
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
          if (!passwordRegex.test(value)) {
            throw new Error(
              "Password must contain at least one uppercase letter, one lowercase letter, one digit, and be at least 8 characters long"
            );
          }
        },
      },
    },
    favourite_class: {
      type: DataTypes.STRING(25),
      defaultValue: "Computer Science",
      validate: {
        isAlpha: {
          msg: "Favorite class must only contain alphabetic characters",
        },
      },
    },
    school_year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: "School year must be an integer",
        },
      },
    },
    subscribed_to_wittcode: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      validate: {
        isIn: {
          args: [[true, false]],
          msg: "Subscribed to Wittcode must be either true or false",
        },
      },
    },
  },
  { freezeTableName: true, timestamps: false }
);

export default Student;
