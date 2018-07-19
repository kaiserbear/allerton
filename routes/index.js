var express = require("express");
var router  = express.Router();
var user = require("../models/user");
var job = require("../models/news");
var portfolio = require("../models/portfolio");
var passport = require("passport");

function getAllJobs(string, res) {
    job.find({}, function(err, alljobs){
       if(err){
           console.log(err);
       } else {
          res.render(string,{
            jobs:alljobs
          });
       }
    });
}

//root route
router.get("/", function(req, res){
  getAllJobs("index", res);
});

router.get("/about-us", function(req, res){
    res.render("about-us", res);
});


router.get("/register", function(req, res){
   res.render("register", res);
});


router.post("/register", function(req, res){
    var newUser = new user({ username: req.body.username });
    user.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to Allerton Group " + user.username);
           res.redirect("/");
        });
    });
});

router.get("/login", function(req, res){
    res.render("login", { user: req.user });
});

//handling login logic
router.post("/login", passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login"
    }), function(req, res) {
    req.flash("success", "Hey there!");
  });



// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/");
});

module.exports = router;