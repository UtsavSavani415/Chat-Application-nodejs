const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const userRouter = require("./Routes/userRoute");
require("dotenv").config();

const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;

app.use(express.json());
app.use(cors());

app.use("/api/users", userRouter);
// CRUD

app.get("/", (req, res) => {
  res.send("welcome chat api");
});

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongo db connection established");
  })
  .catch((error) => {
    console.log("MongoDB connection failed: ", error.message);
  });

app.listen(port, (req, res) => {
  console.log("Server running on port", port);
});
