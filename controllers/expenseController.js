const users = require("../models/user");
const GeminiApi = require("@google/genai");
const Expense = require("../models/expense");


const addExpense = async (req,res)=>{
    // const t = await sequelize.transaction();
     console.log("add controller hit");
     try{

     const {amount,category,description} = req.body
     console.log(amount,category,description);

    // AI Integration
    // const ai = new GeminiApi.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // const response = await ai.models.generateContent({
    //   "model": "gemini-3-flash-preview",
    //   "contents": `one category for this expense = " ${description}"`
    // })
    // const categoryval = response.text;
         
        const expense = await Expense.create({
            amount,
            category,
            description,
            userId: req.user.userId
        });

        console.log("Expense created")
        const user = await users.findById(req.user.userId);
        console.log(user)

        await users.findByIdAndUpdate(
             req.user.userId,
         {
             $inc: { totalExpense: Number(amount) }
        }
     );
        // await t.commit();
        res.status(201).json({message:"Expense added"});

     }catch(err){
        // if (t) await t.rollback();
        res.status(500).json({message:"expense not added"},err)
     }
    
}


///////////////// GET Expenses //////////////


const getExpense = async (req, res) => {
  console.log("refresh par chala getExpense");
  try {
    const expense = await Expense.find( {userId: req.user.userId});

    console.log(getExpense);
    res.status(200).json(expense);
  } catch (error) {
    console.log(error.message);
  }
};


const deleteExpense = async (req, res) => {
    try {
        const expenseId = req.params.id;
        const userId = req.user.userId;
        console.log(expenseId,userId);

        const expense = await Expense.findOne({
            _id: expenseId,
            userId: userId
        });

        console.log(expense);

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found or unauthorized"
            });
        }
        await users.findByIdAndUpdate(
            userId,
            {
                $inc: {
                    totalExpense: -expense.amount
                }
            }
        );

        await Expense.findByIdAndDelete(expenseId);

        res.status(200).json({
            message: "Expense delete successfully"
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            error: error.message
        });
    }
};





const updateExpense = async (req, res) => {
  try {
    const updateId = req.params.id;
    const { amount, category, description } = req.body;

    const updateVal = await Expense.findOne({
          _id: updateId,
          userId: req.user.userId
    });

    if (!updateVal) {
      return res.status(404).json({
        message: "Expense not found or not authorized",
      });
    }

    updateVal.amount = amount ?? updateVal.amount; // ?? isliye use kiya hai   if null / undefined → old value preserved
    updateVal.category = category ?? updateVal.category;
    updateVal.description = description ?? updateVal.description;

    await updateVal.save();
    res.status(200).json({ message: "update successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "value not updated server error" });
  }
};





const premiumUserFunction = async (req, res) => {
     console.log("show primum chala controller m");
    try {
        const response = await users.find(
            {},
            {
                name: 1,
                totalExpense: 1
            }
        ).sort({ totalExpense: -1 });

        console.log(response);
        res.status(200).json(response);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
};



const getAllExpenseForReport = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const page = parseInt(req.query.page) || 1;

        const skip = (page - 1) * limit;

        const totalexpenses = await Expense.countDocuments({
            userId: req.user.userId
        });

        const expenses = await Expense.find({
            userId: req.user.userId
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

        const totalpage = Math.ceil(totalexpenses / limit);

        res.status(200).json({
            expenses,
            pagination: {
                currentpage: page,
                totalpage,
                hasnextpage: page < totalpage,
                haspreviouspage: page > 1,
                nextpage: page < totalpage ? page + 1 : null,
                previouspage: page > 1 ? page - 1 : null
            }
        });

    } catch (error) {
        console.log(error.message);
    }
};


const downloadExpenses = async (req, res) => {
    try {
        console.log("Controller hit: download report");

        const expenses = await Expense.find({
            userId: req.user.userId
        });

        if (!expenses || expenses.length === 0) {
            return res.status(404).json({
                message: "No expenses found"
            });
        }

        const stringifiedExpense = JSON.stringify(expenses, null, 2);

        const fileName = `expenses/user-${req.user.userId}/${Date.now()}.json`;

        const fileUrl = await S3services.uploadToS3(
            stringifiedExpense,
            fileName,
            "application/json"
        );

        await Content.create({
            ContentUrl: fileUrl,
            userId: req.user.userId
        });

        const contentResponse = await Content.find({
            userId: req.user.userId
        });

        res.status(200).json({
            contentResponse
        });

    } catch (error) {
        console.error("Download Expense Error:", error);

        res.status(500).json({
            message: "Something went wrong"
        });
    }
};


module.exports = {
    addExpense,
    deleteExpense,
    getExpense,
    updateExpense,
    premiumUserFunction,
    getAllExpenseForReport,
    downloadExpenses
};