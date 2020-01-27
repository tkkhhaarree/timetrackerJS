const mongoose = require("mongoose");

const UrlVotesSchema = new mongoose.Schema({
   url: {
      type: String,
      default: null
   },
   positive: {
      type: Number,
      default: 0
   },
   negative: {
      type: Number,
      default: 0
   },
   neutral: {
      type: Number,
      default: 0
   },
   category: {
      type: Number,
      default: 0
   }
});

module.exports = UrlVotes = mongoose.model("urlvotes", UrlVotesSchema);
