import express from "express";
import dotenv from "dotenv";

const app = express();
const port = process.env.port || 3000;

app.get("/", (req, res) => {
  res.send("testing routes");
});

app.listen(port, () => {
  console.log(`Listening to server at ${port}`);
});
