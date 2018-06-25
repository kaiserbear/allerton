const express = require("express");
const app = express();
const aws = require('aws-sdk');
const router = express.Router();
const portfolios = require("../models/portfolio");
const middleware = require("../middleware");
const passport = require("passport");
const cors = require("cors");

const ipfilter = require('express-ipfilter').IpFilter;
// Whitelist the following IPs
var ips = ['86.150.100.153'];

const S3_BUCKET = process.env.S3_BUCKET;

function getAllJobs(string, res) {
    portfolios.find({}, function(err, allportfolios) {
        if (err) {
            console.log(err);
        } else {
            res.render(string, {
                portfolios: allportfolios
            });
        }
    });
}


//INDEX - show all portfolios
router.get("/", function(req, res) {
    console.log('check');
    portfolios.find({}, function(err, allportfolios) {
        if (err) {
            console.log(err);
        } else {
            res.render("portfolio/index", {
                portfolios: allportfolios,
                user: req.user
            });
        }

    });

});

//CREATE - add new portfolio to DB
router.post("/", middleware.isLoggedIn, function(req, res) {
    // get data from form and add to portfolios array
    var title = req.body.title;
    var desc = req.body.description;

    var author = {
        id: req.user._id,
        username: req.user.username
    }

    req.body.image = req.body.image.replace(/[/\\?%*:|"<>^ ]/g, '-');

    var image = req.body.image;

    var newPortfolio = {
        title: title,
        image: image,
        description: desc,
        author: author
    }

    // Create a new portfolio and save to DB
    portfolio.create(newPortfolio, function(err, newlyCreated) {

        if (err) {
            console.log(err);
        } else {
            req.flash("success", newPortfolio.title + " Portfolio Item Created");
            res.redirect("portfolio/index");
        }
    });


});

router.get("/new", middleware.isLoggedIn, function(req, res) {
    getAllJobs("portfolio/new", res);
});


router.get('/sign-s3', (req, res) => {

    // S3 Bucket Config
    const s3 = new aws.S3();
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];
    const s3Params = {
        Bucket: S3_BUCKET,
        Key: fileName,
        Expires: 60,
        ContentType: fileType,
        ACL: 'public-read'
    };
    aws.config.region = 'eu-west-2';
    s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if (err) {
            console.log(err);
            return res.end();
        }
        const returnData = {
            signedRequest: data,
            url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
        };
        res.write(JSON.stringify(returnData));
        res.end();
    });
});



// SHOW - shows more info about one portfolio
router.get("/:id", function(req, res) {
    portfolios.find({}, function(err, allportfolios) {
        if (err) {
            console.log(err);
        } else {
            portfolios.findById(req.params.id).exec(function(err, foundportfolio) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("portfolio/show", {
                        portfolio: foundportfolio,
                        portfolios: allportfolios
                    });
                }
            });
        }
    });
});


// EDIT portfolio ROUTE
router.get("/:id/edit", middleware.checkPOwnership, function(req, res) {
    portfolios.findById(req.params.id, function(err, foundportfolio) {
        res.render("portfolio/edit", {
            portfolio: foundportfolio
        });
    });
});

// UPDATE portfolio ROUTE
router.put("/:id", middleware.checkPOwnership, function(req, res) {

    // find and update the correct portfolio
    req.body.portfolio.image = req.body.portfolio.image.replace(/[/\\?%*:|"<>^ ]/g, '-');

    portfolios.findByIdAndUpdate(req.params.id, req.body.portfolio, function(err, updatedportfolio) {
        if (err) {
            res.redirect("/portfolio");
        } else {
            res.redirect("/portfolio/" + req.params.id);
        }
    });
});

// DESTROY portfolio ROUTE
router.delete("/:id", middleware.checkPOwnership, function(req, res) {
    portfolios.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/portfolio");
        } else {
            res.redirect("/portfolio");
        }
    });
});




module.exports = router;