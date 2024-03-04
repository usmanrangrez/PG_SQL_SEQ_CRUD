import express from "express";
import {
  avgOfPointsGreaterThan50,
  countAllUsers,
  createUser,
  deleteUser,
  findUserBelowPts,
  getAllUsers,
  getDetailsById,
  totalPoints,
  totalPointsCondition,
  updateDetails,
  updateUsingParams,
  userWhoseLength,
  userWithMaxPoints,
  usersPaginate,
  usersWhosePointsMatchQuery,
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
router.get("/users/belowPts", findUserBelowPts);
router.get("/users/matchPts", usersWhosePointsMatchQuery);
router.get("/users/belowLength", userWhoseLength);
router.put("/users/update", updateUsingParams);
router.get("/users/max", userWithMaxPoints);

export default router;
