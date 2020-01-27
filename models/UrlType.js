const mongoose = require("mongoose");

const UrlTypeSchema = new mongoose.Schema({
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
   },
   url: {
      type: String,
      default: null
   },
   choice: {
      type: Number,
      default: 0
   }
});

module.exports = UrlType = mongoose.model("urltype", UrlTypeSchema);
