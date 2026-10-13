const express = require("express");
const route = express.Router();
const forgotController = require("../controllers/forgotController");

route.post("/sendmail", forgotController.sendmailTouser);
route.post("/savepassword", forgotController.saveNewpassword);

module.exports = route;
