import express from "express";
import userRoutes from "./routes/userRoute.js";
import studentRoutes from "./routes/studentRoute.js";
import { authenticateJWT } from "./middlewares/authenticate.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("testing routes");
});

app.use(userRoutes);
app.use("/students/api/v1", studentRoutes);

app.get("/students/api/v1/protected-route", authenticateJWT, (req, res) => {
  // Only logged-in users can access this

  try {
    res.json({
      message: "You have access to this protected route",
      user: req.user,
    });
    console.log("hi");
  } catch (error) {
    console.log("bye");
    res.json({
      message: error.message,
    });
  }
});

app.listen(3000, () => {
  console.log(`Listening to server at 3000`);
});
