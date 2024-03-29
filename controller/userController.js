import sequelize from "../config/database.js";
import User from "../model/user.js";
import { Op } from "sequelize"; // Import the Op symbol

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["username", "points"],
      order: [["id", "ASC"]], // Example: Order by username alphabetically
    });

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).send({
      message: "Error while fetching users",
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    //check if already a user exists
    const existingUser = await User.findOne({ where: { username: username } });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    //create a new user if it doesnt exist
    const user = await User.create({
      username,
      password,
    });

    res.status(201).json({
      user,
    });
  } catch (error) {
    console.error("Error occurred", error);
    res.status(500).json({
      message: "Failed to create a user",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const deletedUser = await User.destroy({
      where: {
        id: userId,
      },
    });
    console.log(deletedUser);

    if (deletedUser) {
      return res.status(200).json({
        message: "User deleted successfully!",
      });
    } else {
      return res.status(404).json({
        message: "User not found",
      });
    }
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ message: "Failed to delete user." });
  }
};

export const updateDetails = async (req, res) => {
  const { userId } = req.params; // Retrieve the user ID from the URL parameters
  const { username, password, points } = req.body; // Extract the fields you want to update from the request body

  try {
    // Update details
    const [numberOfAffectedRows] = await User.update(
      {
        username: username,
        password: password, // Note: In a real app, ensure to hash the password before saving
        points: points,
      },
      {
        where: { id: userId }, // Specify the user to update using the `where` clause
      }
    );

    // Check if any rows were updated
    if (numberOfAffectedRows > 0) {
      res.send({ message: "User updated successfully!" });
    } else {
      // If no rows were updated, then the user was not found
      return res.status(404).json({ message: "User not found!" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating user details: " + error.message });
  }
};

export const getDetailsById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({
      attributes: [
        ["username", "name"],
        ["password", "secret"],
      ],
      where: { id: userId },
    });

    if (user) {
      res.send(user);
    } else {
      res
        .status(404)
        .json({ message: "No user found with id=" + req.params.userId });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving user with id=" + req.params.userId,
    });
  }
};

export const usersPaginate = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const users = await User.findAll({
      attributes: ["username", "points"], //we will get these as output
      limit,
      offset,
      order: [["id", "ASC"]],
    });
    res.status(200).json({
      users: users,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error while fetching users:", error);
    res.status(500).json({
      message: "Error while fetching users",
    });
  }
};

export const countAllUsers = async (req, res) => {
  try {
    const totalUsers = await User.count();
    res.status(200).json({ totalUsers });
  } catch (error) {
    console.error("Error while counting users:", error);
    res.status(500).json({
      message: "Error while counting users",
    });
  }
};

export const totalPoints = async (req, res) => {
  try {
    const totalPoints = await User.sum("points");
    res.status(200).json({ totalPoints });
  } catch (error) {
    console.error("Error while calculating total points:", error);
    res.status(500).json({
      message: "Error while calculating total points",
    });
  }
};

export const totalPointsCondition = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        "username",
        [sequelize.fn("SUM", sequelize.col("points")), "totalPoints"],
      ],
      group: "username", // Group by username (or another unique identifier)
      having: {
        [Op.gt]: 20, // Using Op.gt for greater than comparison directly with the value
      },
    });

    res.json(users);
  } catch (error) {
    console.error("Error fetching users with condition:", error);
    res.status(500).json({ message: "Error fetching users with condition" });
  }
};

export const avgOfPointsGreaterThan50 = async (req, res) => {
  try {
    // Calculate the average points for users with points > 50
    const result = await User.findAll({
      attributes: [
        "user",
        [sequelize.fn("AVG", sequelize.col("points")), "averagePoints"], // Calculate the average
      ],
      where: {
        points: {
          [Op.gt]: 50, // Condition: points > 50
        },
      },
      raw: true, // Ensures a plain response object
    });
    // Since AVG is calculated across all users meeting the condition, there should be one result
    // Parse the averagePoints value to ensure it's treated as a number
    let averagePoints = parseFloat(result[0]?.averagePoints || 0).toFixed(2);
    averagePoints = Number(averagePoints); // Convert string back to number, if needed

    res.json({ averagePoints }); // Send the calculated average points
  } catch (error) {
    console.error(
      "Error calculating average points for users with > 50 points:",
      error
    );
    res.status(500).json({ message: "Error calculating average points" });
  }
};

export const findUserBelowPts = async (req, res) => {
  try {
    const queryLimit = parseInt(req.query.points) || 100;

    const usersBelow = await User.findAll({
      where: {
        points: {
          [Op.lt]: queryLimit,
        },
      },
      order: [["id", "ASC"]],
    });

    res.status(200).json({
      usersBelow,
    });
  } catch (error) {
    res.status(500).json({
      message: "Cannot find users below",
    });
  }
};

export const usersWhosePointsMatchQuery = async (req, res) => {
  const limit = parseInt(req.query.queryLimit);
  try {
    const users = await User.findAll({
      where: {
        points: {
          [Op.eq]: limit,
        },
      },
      order: [["id", "DESC"]],
    });

    if (users.length === 0) {
      return res.status(200).json({
        message: `No users found with points ${limit}`,
      });
    }

    res.status(200).json({
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while getting users",
    });
  }
};

export const userWhoseLength = async (req, res) => {
  const length = parseInt(req.query.length) || 6;
  try {
    const users = await User.findAll({
      where: sequelize.where(
        sequelize.fn("LENGTH", sequelize.col("username")),
        {
          [Op.eq]: length,
        }
      ),
    });
    res.status(200).json({
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error in fetching users",
    });
  }
};

export const updateUsingParams = async (req, res) => {
  try {
    const name = req.query.name;
    const pointsToUpdate = req.query.points;
    const [noOfAffectedRows, actualAffected] = await User.update(
      { points: pointsToUpdate },
      { where: { username: name } }
    );

    res.status(200).json({
      message: `Updated ${noOfAffectedRows} rows successfully for user ${name}`,
      actualAffected: actualAffected,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error in updating user points",
      error: error.message,
    });
  }
};

export const userWithMaxPoints = async (req, res) => {
  const user = await User.max("points");
  res.status(200).json({
    user: user,
  });
};
