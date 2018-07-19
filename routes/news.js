const express = require("express");
const app = express();
const aws = require('aws-sdk');
const router = express.Router();
const job = require("../models/news");
const middleware = require("../middleware");
const passport = require("passport");


const S3_BUCKET = process.env.S3_BUCKET;

function getAllJobs(string, res) {
    job.find({}, function(err, alljobs) {
        if (err) {
            console.log(err);
        } else {
            res.render(string, {
                jobs: alljobs
            });
        }
    });
}


//CREATE - add new job to DB
router.post("/", middleware.isLoggedIn, function(req, res) {
    var title = req.body.title;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    req.body.image1 = req.body.image1.replace(/[/\\?%*:|"<>^ ]/g, '-');
    req.body.image2 = req.body.image2.replace(/[/\\?%*:|"<>^ ]/g, '-');
    req.body.image3 = req.body.image3.replace(/[/\\?%*:|"<>^ ]/g, '-');

    var image1 = req.body.image1;
    var image2 = req.body.image2;
    var image3 = req.body.image3;

    var newjob = {
        title: title,
        image1: image1,
        image2: image2,
        image3: image3,
        description: desc,
        author: author
    }

    // Create a new job and save to DB
    job.create(newjob, function(err, newlyCreated) {

        if (err) {
            console.log(err);
        } else {
            req.flash("success", newjob.title + " News Item Created");
            res.redirect("/");
        }
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res) {
    getAllJobs("news/new", res);
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



// SHOW - shows more info about one job
router.get("/:id", function(req, res) {
    job.find({}, function(err, alljobs) {
        if (err) {
            console.log(err);
        } else {
            job.findById(req.params.id).exec(function(err, foundJob) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("news/show", {
                        job: foundJob,
                        jobs: alljobs
                    });
                }
            });
        }
    });
});

// EDIT job ROUTE
router.get("/:id/edit", middleware.checkNOwnership, function(req, res) {
    job.findById(req.params.id, function(err, foundJob) {
        res.render("news/edit", {
            job: foundJob
        });
    });
});

// UPDATE job ROUTE
router.put("/:id", middleware.checkNOwnership, function(req, res) {

    // find and update the correct job
    if (req.body.job.image1) {
        req.body.job.image1 = req.body.job.image1.replace(/[/\\?%*:|"<>^ ]/g, '-');
    }

    job.findByIdAndUpdate(req.params.id, req.body.job, function(err, updatedjob) {
        if (err) {
            res.redirect("/news");
        } else {
            res.redirect("/news/" + req.params.id);
        }
    });
});

// DESTROY job ROUTE
router.delete("/:id", middleware.checkNOwnership, function(req, res) {
    job.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/");
        } else {
            res.redirect("/");
            req.flash("success", "News Item Deleted");
        }
    });
});

module.exports = router;