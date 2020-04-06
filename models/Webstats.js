const mongoose = require("mongoose");

const WebstatsSchema = new mongoose.Schema({
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
   },
   session: {
      type: String,
      default: null
   },
   url: {
      type: String,
      default: null
   },
   ts: {
      type: [Number],
      default: null
   },
   viewtime: {
      type: Number,
      default: null
   }
});

module.exports = Webstats = mongoose.model("webstats", WebstatsSchema);
