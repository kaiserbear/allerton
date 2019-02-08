var News = require("../models/news");
var Portfolio = require("../models/portfolio");

// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkNOwnership = function(model, req, res, next) {
 if(req.isAuthenticated()){
        News.findById(req.params.id, function(err, foundItem){
           if(err){
               req.flash("error", "item not found");
               res.redirect("back");
           }  else {
            if(foundItem.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkPOwnership = function(model, req, res, next) {
 if(req.isAuthenticated()){
        Portfolio.findById(req.params.id, function(err, foundItem){
           if(err){
               req.flash("error", "item not found");
               res.redirect("back");
           }  else {
            if(foundItem.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;