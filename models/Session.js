const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        unique: true
    },
    current_session: {
        type: String,
        default: null
    }
});

module.exports = Session = mongoose.model("session", SessionSchema);
