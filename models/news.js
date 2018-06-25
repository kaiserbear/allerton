var mongoose = require("mongoose");

var NewsSchema = new mongoose.Schema({
   title: String,
   image1: String,
   image2: String,
   image3: String,
   description: String,
   author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "News"
        },
        username: String
   },
   date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("News", NewsSchema);