import { Op } from "sequelize";
import Student from "../model/student.js";
import sequelize from "../config/database.js";

export const createStudent = async (req, res) => {
  try {
    const studentBody = req.body;
    const student = await Student.create(studentBody);

    res.status(201).json({ student });
  } catch (error) {
    console.error("Error in creating student", error);
    res.status(500).json({
      message: "Error in creating student",
    });
  }
};

export const bulkCreateStudents = async (req, res) => {
  try {
    const studentsData = req.body; // Assuming the data is sent in the request body
    const students = await Student.bulkCreate(studentsData, { validate: true });

    res.status(201).json({ students });
  } catch (error) {
    console.error("Error in creating bulk users", error);
    res.status(500).json({
      message: "Error in creating bulk users",
    });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.findAll();

    if (students.length === 0) {
      return res.status(200).json({
        message: "No students found!",
      });
    }

    res.status(200).json({ students });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      message: "Error in fetching users",
    });
  }
};

export const deleteByID = async (req, res) => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);

    if (!id || isNaN(parsedId)) {
      return res.status(400).json({
        message: "No id passed in parameters or id isn't correct",
      });
    }

    const deletedCount = await Student.destroy({
      where: { student_id: parsedId },
    });

    res.status(200).json({
      message: `${deletedCount} record(s) deleted successfully`,
    });
  } catch (error) {
    console.error("Error in deleteing record", error);
    res.status(500).json({
      message: "Error in deleting record",
    });
  }
};

export const bulkDeleteByID = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        message: "Id's Array is required and must not be empty",
      });
    }

    const deletedCount = await Student.destroy({ where: { student_id: ids } });
    res.status(200).json({
      message: `${deletedCount} records deleted successfully!`,
    });
  } catch (error) {
    console.error("Error deleting records:", error);
    res.status(500).json({ message: "Error deleting records" });
  }
};

export const updateDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);
    const updatedBody = req.body;
    if (!id || isNaN(parsedId)) {
      return res.status(400).json({
        message: "No id passed in parameters or id isn't correct",
      });
    }

    const [noOfRowsAffected, actualUpdated] = await Student.update(
      //data to update
      {
        ...updatedBody,
      },
      // Options for the update operation
      {
        where: {
          student_id: parsedId,
        },
        returning: true,
      }
    );

    // Check if any rows were affected
    if (noOfRowsAffected === 0) {
      return res.status(404).json({
        message: "No student found with the provided ID",
      });
    }

    // Return the updated student record
    res.status(200).json({
      message: `${noOfRowsAffected} row(s) updated successfully`,
      updatedStudent: actualUpdated[0], // The first element in actualUpdated array contains the updated record
    });
  } catch (error) {
    console.error("Error in updating user");
    res.status(500).json({
      message: "Error in updating user",
      error: error.message,
    });
  }
};

export const getStudentsByDetails = async (req, res) => {
  try {
    const students = await Student.findAll({
      attributes: ["name"],
      where: {
        [Op.or]: [
          { favourite_class: "ReactJS" },
          { subscribed_to_wittcode: true },
        ],
      },
    });

    res.status(200).json({ students });
  } catch (error) {
    console.error("Error in fetching students", error);
    res.status(500).json({
      message: "Error in fetching students",
      error: error.message,
    });
  }
};

export const countStudentsBySchoolYear = async (req, res) => {
  try {
    const studentCounts = await Student.findAll({
      // Defining attributes to select from the database
      attributes: [
        // Selecting the school_year column
        "school_year",
        // Using sequelize.fn to call COUNT function on the school_year column,
        // and aliasing the result as 'num_students'
        [sequelize.fn("COUNT", sequelize.col("school_year")), "num_students"],
      ],
      // Grouping the results by the school_year column
      group: "school_year",
    });

    // Sending the student counts as the response
    res.status(200).json({ studentCounts });
  } catch (error) {
    // Handling errors if any occur during the process
    console.error("Error in counting students by school year", error);
    res.status(500).json({
      message: "Error in counting students by school year",
      error: error.message,
    });
  }
};
