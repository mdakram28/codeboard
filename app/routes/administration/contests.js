var express = require('express');
var router = express.Router();
var Contest = require("../../models/contest");
var Challenge = require("../../models/challenge");
var moment = require('moment');

module.exports.init = function(inject){

    var int = inject("interceptor");

    router.use(int.autoLogin);

    router.get('/', function(req, res, next) {
        Contest.find({}).populate("owner").exec(function(err,contests){
            if(err)return res.sendStatus(500);
            contests.forEach(function(c){
                c.status = "Active";
            });
            res.locals.contests = contests;
            return res.render("admin_contests");
        });
    });

    router.get('/create',function(req, res, next) {
        res.locals.values = {};
        res.locals.errors = {};
        res.render('admin_contests_new');
    });
    router.post("/create",function(req,res,next){
        res.locals.values = req.body;
        var title = req.body.title;
        var startDate = undefined;
        if(req.body.startDate!="" && req.body.startDate){
            startDate = moment(req.body.startDate+" "+req.body.startTime,"MM/DD/YYYY H:m");
            if(!startDate.isValid()){
                return res.render("admin_contests_new",{
                    errors : {
                        startDate : {
                            message : "invalid format"
                        }
                    }
                });
            }else{
                console.log("start date valid : ",startDate.format());
            }
            startDate = startDate._d;
        }
        var endDate = undefined;
        if(req.body.endDate!="" && req.body.endDate){
            endDate = moment(req.body.endDate+" "+req.body.endTime,"MM/DD/YYYY H:m");
            if(!endDate.isValid()){
                return res.render("admin_contests_new",{
                    errors : {
                        startDate : {
                            message : "invalid date"
                        }
                    }
                });
            }
            endDate = endDate._d;
        }
        Contest.createNew({
            title : title,
            startTime : startDate,
            endTime : endDate,
            owner : req.user,
            dateCreated : new Date(),
            details : {
                tagline : req.body.tagline,
                description : req.body.description,
                prizes : req.body.prizes
            }
        },function(err){
            if(err){
                if(!err.errors && err.code==11000){
                    err.errors = {
                        title : {
                            message : "Title already taken"
                        }
                    }
                }else if(!err.errors){
                    err.errors = {};
                }
                console.log(err);
                return res.render("admin_contests_new",{
                    errors : err.errors
                });
            }
            req.flash("message","Contest created successfully");
            return res.redirect("/administration/contests/");
        });
    });

    router.get('/:contestId/details',int.contest.getLeanById,function(req, res, next) {
        console.log(req.contest);
        res.render('admin_contests_details');
    });


    router.post('/:contestId/details',int.contest.getById,function(req, res, next) {
        var title = req.body.title;
        var startDate,endDate;

        if(isValid(req.body.startDate,req.body.startTime))startDate = getDate(req.body.startDate,req.body.startTime);
        else{
            req.contest = req.contest.toJSON();
            req.contest.startDate = startDate;
            req.contest.startTime = startTime;
            req.contest.endDate = endDate;
            req.contest.endTime = endTime;
            res.locals.contest = req.contest;
            return res.render("admin_contests_new",{
                errors : {
                    startDate : {
                        message : "invalid format"
                    }
                }
            });
        }
        if(isValid(req.body.endDate,req.body.endTime))endDate = getDate(req.body.endDate,req.body.endTime);
        else{
            req.contest = req.contest.toJSON();
            req.contest.startDate = startDate;
            req.contest.startTime = startTime;
            req.contest.endDate = endDate;
            req.contest.endTime = endTime;
            res.locals.contest = req.contest;
            return res.render("admin_contests_new",{
                errors : {
                    endDate : {
                        message : "invalid format"
                    }
                }
            });
        }

        req.contest.title = title;
        req.contest.startTime = startDate;
        req.contest.endTime = endDate;
        req.contest.details.tagline = req.body.tagline;
        req.contest.details.description = req.body.description;
        req.contest.details.prizes = req.body.prizes;

        req.contest.save(function(err){

            if(err){
                if(!err.errors && err.code==11000){
                    err.errors = {
                        title : {
                            message : "Title already taken"
                        }
                    }
                }else if(!err.errors){
                    err.errors = {};
                }
                console.log(err);
                return res.render("admin_contests_new",{
                    errors : err.errors
                });
            }
            req.flash("message","Contest details updated successfully");
            return res.redirect(req.originalUrl);
        });

    });
    router.get('/:contestId/challenges',int.contest.getLeanById,function(req, res, next) {
        Challenge.getAllContestChallenges(req.contest._id,function(err,challenges){
            if(err)return res.sendStatus(500);
            res.locals.challenges = challenges;
            res.render('admin_contests_challenges');
        });
    });
}
module.exports.router = router;

function isValid(date,time){
    if(date!="" && date){
        var retDate = moment(date+" "+time,"MM/DD/YYYY H:m");
        if(!retDate.isValid()){
            return false
        }else{
            return true;
        }
    }else{
        return true;
    }
}

function getDate(date,time){
    if(date!="" && date){
        return moment(date+" "+time,"MM/DD/YYYY H:m")._d;
    }else{
        return undefined;
    }
}