const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
    ContentUrl: {
        type: String,
        required: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

module.exports = mongoose.model("Content", contentSchema);