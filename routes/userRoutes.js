const express = require("express");
const route = express.Router();
const userController = require("../controllers/userController");

route.post("/signup", userController.addUser);
route.post("/login", userController.loginUser);

module.exports = route;

