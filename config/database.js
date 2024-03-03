import { Sequelize } from "sequelize";

const sequelize = new Sequelize("pgsql", "postgres", "Usmaan@786", {
  host: "localhost", // Host, using
  dialect: "postgres", // Specify the dialect
  logging: false,
});

// Define an asynchronous function to authenticate with the database
const authenticateDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

// Call the asynchronous function to execute the authentication
authenticateDatabase();

export default sequelize;
