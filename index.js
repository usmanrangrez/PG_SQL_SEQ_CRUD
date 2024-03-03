import express from "express";
import userRoutes from "./routes/userRoute.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("testing routes");
});

app.use(userRoutes);

app.listen(3000, () => {
  console.log(`Listening to server at 3000`);
});
