const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController");
const authorizationToken = require("../middlewares/auth");

// expense routes

// route.post("/suggest-category" , expenseController.suggestCategory);
// import { categorizeExpense } from '../services/aiService.js';


router.post('/suggest-category',expenseController.suggestCategory);
router.post("/add", authorizationToken, expenseController.addExpense);

router.delete("/delete/:id", authorizationToken, expenseController.deleteExpense);
router.get("/getAll", authorizationToken, expenseController.getExpense);

router.get("/premiumUser", authorizationToken, expenseController.premiumUserFunction);
router.get("/all", authorizationToken, expenseController.getAllExpenseForReport);

router.get("/download", authorizationToken, expenseController.downloadExpenses);
//route.put("/update",expenseController.updateExpense);

module.exports = router;
