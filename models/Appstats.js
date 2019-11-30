const mongoose = require("mongoose");

const AppstatsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    session: {
        type: String,
        default: null
    },
    app: {
        type: String,
        default: null
    },
    added_ts: {
        type: Number,
        default: null
    },
    viewtime: {
        type: Number,
        default: null
    }
});

module.exports = Appstats = mongoose.model("appstats", AppstatsSchema);
