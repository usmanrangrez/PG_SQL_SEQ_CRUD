import User from "../model/user.js";

export const createUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    //check if already a user exists
    const existingUser = await User.findOne({ where: { username: username } });

    if (existingUser) {
      return res.status(400).send({ message: "User already exists." });
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
    console.error("Error occured", error);
    res.status(500).json({
      message: "Failed to create a user",
    });
  }
};
