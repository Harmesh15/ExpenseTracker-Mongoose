const mongoose = require("mongoose");

const forgotPasswordSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    isActive: {
        type: Boolean,
        required: true,
        default: true
    }
});

module.exports = mongoose.model("ForgotPassword", forgotPasswordSchema);