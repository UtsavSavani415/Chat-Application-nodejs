const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();

const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;

app.use(express.json());
app.use(cors());

// CRUD

app.post("/", (req, res) => {});

app.listen(port, (req, res) => {
  console.log("Server running on port", port);
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
    console.log("MongoDB connection failed: ", error);
  });
