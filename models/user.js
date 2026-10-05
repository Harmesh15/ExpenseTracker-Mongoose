const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  totalExpense: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  }
})

module.exports = mongoose.model("users", userSchema);