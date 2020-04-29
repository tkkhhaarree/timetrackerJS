const mongoose = require("mongoose");

const CurrentUrlSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        unique: true
    },
    session: {
        type: String,
        default: null
    },
    url: {
        type: String,
        default: null
    },
    logged_in: {
      type: Boolean,
      default: false,
   },
});

module.exports = CurrentUrl = mongoose.model("current_url", CurrentUrlSchema);
