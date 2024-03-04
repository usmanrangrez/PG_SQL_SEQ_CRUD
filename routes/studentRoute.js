import express from "express";
const router = express.Router();

//controllers
import {
  bulkCreateStudents,
  bulkDeleteByID,
  countStudentsBySchoolYear,
  createStudent,
  deleteByID,
  getAllStudents,
  getStudentsByDetails,
  updateDetails,
  validateUser,
} from "../controller/studentController.js";

router.get("/", getAllStudents);
router.post("/", createStudent);
router.post("/bulkCreate", bulkCreateStudents);
router.delete("/:id", deleteByID);
router.delete("/bulkDelete", bulkDeleteByID);
router.put("/:id", updateDetails);
router.get("/studentsByDetails", getStudentsByDetails);
router.get("/countByYear", countStudentsBySchoolYear);
router.post("/validateUser", validateUser);

export default router;
