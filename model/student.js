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
      unique: true,
      validate: {
        len: {
          args: [4, 20],
          msg: "Name must be between 4 and 20 characters long",
        },
      },
      //only affects when we fetch (while setters actually do)
      get() {
        const rawValue = this.getDataValue("name");
        return rawValue.toUpperCase();
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      /*
      Sequelize's setter functions are synchronous and cannot handle promises returned by asynchronous functions like bcrypt.hash
      */
      //Option 1: Use Synchronous Hashing in the Setter
      //Option 2: Hash Passwords Before Model Creation/Update
      // set(value) {
      //   const hashedPassword = hashPassword(value);
      //   this.setDataValue("password", hashedPassword);
      // },
      validate: {
        isValidPassword(value) {
          const passwordRegex =
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
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
    demo: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.name} ${this.subscribed_to_wittcode}`;
      },
    },
  },

  { freezeTableName: true, timestamps: false }
);

sequelize
  .sync()
  .then(() => {
    console.log("Student table synched");
  })
  .catch(() => {
    console.log("Error in sync Student table");
  });

export default Student;
