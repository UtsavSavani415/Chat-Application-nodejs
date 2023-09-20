const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  findUser,
  getUsers,
} = require("../Controllers/userController");

router.get("/", getUsers);

router.get("/find/:userId", findUser);

router.post("/register", registerUser);

router.post("/login", loginUser);

module.exports = router;
