import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Country = sequelize.define(
  "country",
  {
    countryName: {
      type: DataTypes.STRING,
      unique: true,
    },
  },
  { timestamps: false }
);
const Capital = sequelize.define(
  "capital",
  {
    capital: {
      type: DataTypes.STRING,
      unique: true,
    },
  },
  { timestamps: false }
);

//note we created country and capital using bulk create (removed that code )

//will automatically place countryId in capital
/*
Association: By calling Country.hasOne(Capital);, a one-to-one relationship is established between Country and Capital. Sequelize uses this association to automatically add a foreign key (countryId) to the Capital table, linking each capital to its country.
*/

/* it's important to define the relationship from both sides to ensure proper association handling and to leverage Sequelize's full functionality. When you define only one side of the association (e.g., Country.hasOne(Capital)), Sequelize knows how to link a Capital to a Country but doesn't automatically create the inverse association. This means while you can set a Capital for a Country, you might run into limitations when trying to access or navigate the relationship from the Capital side.
 */
// This will add a foreign key in Capital pointing to Country
Country.hasOne(Capital);
// This will let Sequelize know that Capital is associated with Country, allowing you to navigate from Capital to Country
Capital.belongsTo(Country);

const associateCapitalWithCountry = async (countryName, capitalName) => {
  try {
    await sequelize.sync({ alter: true });

    // Normalize the country name to ensure consistent casing, e.g., capitalize the first letter
    let normalizedCountryName =
      countryName.charAt(0).toUpperCase() + countryName.slice(1).toLowerCase();

    // Similarly, normalize the capital name
    let normalizedCapitalName =
      capitalName.charAt(0).toUpperCase() + capitalName.slice(1).toLowerCase();

    let [country, createdCountry] = await Country.findOrCreate({
      where: { countryName: normalizedCountryName },
      defaults: { countryName: normalizedCountryName },
    });

    let [capital, createdCapital] = await Capital.findOrCreate({
      where: { capital: normalizedCapitalName },
      defaults: { capital: normalizedCapitalName },
    });

    await country.setCapital(capital);
    console.log(
      `Successfully associated ${normalizedCapitalName} with ${normalizedCountryName}.`
    );
  } catch (err) {
    console.error("Error:", err.message);
  }
};

const getCapitalAssociatedWithCountry = async (countryName) => {
  try {
    await sequelize.sync({ alter: true });
    //get country name
    const country = await Country.findOne({
      where: { countryName: countryName },
    });

    if (country) {
      // Use the automatically generated getter method for the association
      const capital = await country.getCapital();
      if (capital) {
        console.log(`The capital of ${countryName} is ${capital.capital}.`);
      } else {
        console.log(
          `${countryName} does not have an associated capital in the database.`
        );
      }
    } else {
      console.log(`Country with the name "${countryName}" not found.`);
    }
  } catch (error) {
    console.error(
      "Error fetching the capital associated with the country:",
      error
    );
  }
};

const getCountryAssociatedWithCapital = async (capitalName) => {
  try {
    await sequelize.sync({ alter: true });

    // Get capital
    const capital = await Capital.findOne({
      where: { capital: capitalName },
    });

    if (capital) {
      // Use the automatically injected method to get the associated country
      const country = await capital.getCountry();

      if (country) {
        console.log(
          `The country for the capital ${capitalName} is ${country.countryName}.`
        );
      } else {
        console.log(
          `No country is associated with the capital ${capitalName}.`
        );
      }
    } else {
      console.log(`Capital named ${capitalName} not found.`);
    }
  } catch (error) {
    console.error(
      "Error fetching the country associated with the capital:",
      error
    );
  }
};

const executeOperationsSequentially = async () => {
  try {
    // First, associate the capital with the country
    await associateCapitalWithCountry("russia", "mso");

    // Once the association is successfully done, fetch the capital of another country
    await getCapitalAssociatedWithCountry("Russia");
    await getCountryAssociatedWithCapital("New Delhi");
  } catch (error) {
    console.error("Error during sequential operations:", error);
  }
};

executeOperationsSequentially();
