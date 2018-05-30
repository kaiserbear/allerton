const express = require("express"),
      app = express(),
      bodyParser = require("body-parser"),
      methodOverride = require("method-override"),
      sass = require('node-sass'),
      dotenv = require('dotenv').config(),
      url = process.env.DATABASEURL,
      port = process.env.PORT,
      ip = process.env.IP;

var indexRoutes = require("./routes/index");

app.use(bodyParser.urlencoded({
    extended: true
}));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use("/", indexRoutes);

app.listen(port, ip, function() {
    console.log("Allerton Investments Server Has Started!");
});