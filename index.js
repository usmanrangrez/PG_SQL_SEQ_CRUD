import express from "express";
import userRoutes from "./routes/userRoute.js";
import studentRoutes from "./routes/studentRoute.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("testing routes");
});

app.use(userRoutes);
app.use("/students/api/v1", studentRoutes);

app.listen(3000, () => {
  console.log(`Listening to server at 3000`);
});
