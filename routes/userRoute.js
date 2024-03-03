import express from "express";
import {
  avgOfPointsGreaterThan50,
  countAllUsers,
  createUser,
  deleteUser,
  getAllUsers,
  getDetailsById,
  totalPoints,
  totalPointsCondition,
  updateDetails,
  usersPaginate,
} from "../controller/userController.js";

const router = express.Router();

router.get("/users", getAllUsers);
router.post("/user", createUser);
router.delete("/user/:userId", deleteUser);
router.put("/user/:userId", updateDetails);
router.get("/user/:userId", getDetailsById);
router.get("/usersPaginate/", usersPaginate);
router.get("/users/count", countAllUsers);
router.get("/users/totalPoints", totalPoints);
router.get("/users/totalPointsCond", totalPointsCondition);
router.get("/users/avgPoints", avgOfPointsGreaterThan50);

export default router;
