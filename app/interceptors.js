var passport = require('passport');
var Contest = require("./models/contest");
var Challenge = require("./models/challenge");

var $ = module.exports;

$.allRequest = function(req,res,next){
    res.locals.message = req.flash("message");
    res.locals.errMessage = req.flash("errMessage");
    if(res.locals.message=="")res.locals.message = undefined;
    if(res.locals.errMessage=="")res.locals.errMessage = undefined;
    res.locals.user = req.user;
    res.locals.isAuthenticated = req.isAuthenticated();
    res.locals.errors = {};
    res.locals.difficulties = Challenge.schema.path("difficulty").enumValues;
    res.locals.allLanguages = Challenge.schema.path("languages").enumValues;
    next();
}

$.protectedRoute = function(req,res,next){
    if(req.isAuthenticated()){
        next();
    }else{
        req.flash("errMessage","You need to be logged in to continue.");
        res.redirect("/auth/login");
    }
}

$.autoLogin = function(req,res,next){
    if(req.isAuthenticated()){
            next();
    }else{
        req.body.username = "mdakram28";
        req.body.password = "1234";
        passport.authenticate("local")(req,res,next);
    }
}

$.contest = {
    getLeanById : function(req,res,next){
        Contest.getLeanById(req.params.contestId,function(err,contest){
            if(err || !contest)return res.sendStatus(500);
            if(contest.owner.toString() != req.user._id.toString()){
                return res.sendStatus(401);
            }
            req.contest = contest;
            res.locals.contest = contest;
            next();
        });
    },
    getById : function(req,res,next){
        Contest.getById(req.params.contestId,function(err,contest){
            if(err || !contest)return res.sendStatus(500);
            if(contest.owner.toString() != req.user._id.toString()){
                return res.sendStatus(401);
            }
            req.contest = contest;
            res.locals.contest = contest;
            next();
        });
    }
};

$.challenge = {
    getById : function(req,res,next){
        Challenge.findOne({_id:req.params.challengeId}).populate("contest").exec(function(err,challenge){
            if(err || !challenge)return res.sendStatus(500);
            if(challenge.contest.owner.toString() != req.user._id.toString()){
                return res.sendStatus(401);
            }
            req.challenge = res.locals.challenge = challenge;
            req.contest = res.locals.contest = challenge.contest;

            next();
        });
    }
}