const express = require("express");
const userModel = require("../Models/userModel");
const router = express.Router();
const {
  registerUser,
  loginUser,
  findUser,
  getUsers,
} = require("../Controllers/userController");

// router.get("/", getUsers);

router.get("/", async (req, res) => {
  //   res.send("working at get /");
  try {
    const users = await userModel.find();

    res.status(100).json(users);
  } catch (error) {
    console.log("Error while getting all user", error);
    res.status(500).json(error);
  }
});

router.post("/register", registerUser);

router.get("/find/:userId", findUser);

router.post("/login", loginUser);

module.exports = router;
