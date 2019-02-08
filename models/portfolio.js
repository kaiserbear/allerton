var mongoose = require("mongoose");

var PortfolioSchema = new mongoose.Schema({
   title: String,
   image: String,
   description: String,
   author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Portfolio"
        },
        username: String
   },
   date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Portfolio", PortfolioSchema);