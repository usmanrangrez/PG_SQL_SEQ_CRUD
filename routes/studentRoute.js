import express from "express";
const router = express.Router();

//controllers
import {
  bulkCreateStudents,
  bulkDeleteByID,
  countStudentsBySchoolYear,
  createStudent,
  deleteByID,
  findStudentOrCreate,
  getAllStudents,
  getStudentsByDetails,
  loginStudent,
  updateDetails,
  validateUser,
} from "../controller/studentController.js";

router.get("/", getAllStudents);
router.post("/create", createStudent);
router.post("/bulkCreate", bulkCreateStudents);
router.delete("/:id", deleteByID);
router.delete("/bulkDelete", bulkDeleteByID);
router.put("/:id", updateDetails);
router.get("/studentsByDetails", getStudentsByDetails);
router.get("/countByYear", countStudentsBySchoolYear);
router.post("/validateUser", validateUser);
router.post("/findOrCreate", findStudentOrCreate);
router.post("/login", loginStudent);

export default router;
