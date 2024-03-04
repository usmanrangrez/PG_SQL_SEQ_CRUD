import bcrypt from "bcrypt";
import Student from "../model/student.js";

//run this file using node .. only once to hash passsword
// i did this because i used hashing logic later
//do this if you create new users

const hashPasswords = async () => {
  try {
    const saltRounds = 10;
    const students = await Student.findAll();

    for (let student of students) {
      if (
        student.password /* and possibly check if it's not already hashed */
      ) {
        const hashedPassword = await bcrypt.hash(student.password, saltRounds);
        await Student.update(
          { password: hashedPassword },
          { where: { student_id: student.student_id }, validate: false }
        );
      }
    }

    console.log("All passwords have been hashed and updated successfully.");
  } catch (error) {
    console.error("Error hashing passwords:", error);
  }
};

hashPasswords();
