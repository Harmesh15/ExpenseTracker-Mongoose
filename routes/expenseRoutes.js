const express = require("express");
const route = express.Router();
const expenseController = require("../controllers/expenseController");
const authorizationToken = require("../middlewares/auth");

// expense routes
route.post("/add", authorizationToken, expenseController.addExpense);

route.delete("/delete/:id", authorizationToken, expenseController.deleteExpense);

route.get("/getAll", authorizationToken, expenseController.getExpense);

route.get("/premiumUser", authorizationToken, expenseController.premiumUserFunction);

route.get("/all", authorizationToken, expenseController.getAllExpenseForReport);

route.get("/download", authorizationToken, expenseController.downloadExpenses);
//route.put("/update",expenseController.updateExpense);

module.exports = route;
