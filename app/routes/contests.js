var express = require('express');
var router = express.Router();
var Contest = require("../models/contest");
var Challenge = require("../models/challenge");
var Submission = require("../models/submission");
var moment = require('moment');
var async = require("async");

module.exports.router = router;
module.exports.init = function(inject){

    function putContestByTitle(req,res,next){
        Contest.findOne({title : req.params.contestTitle.split("_").join(" ")},function(err,contest){
            if(err)return res.sendStatus(500);
            req.contest = res.locals.contest = contest;
            Challenge.find({contest : contest._id},function(err,challenges){
                if(err)return res.sendStatus(500);
                req.challenges = res.locals.challenges = challenges;
                next();
            });
        })
    }

    function putChallenge(req,res,next){
        Challenge.findOne({_id:req.params.challengeId}).exec(function(err,challenge){
            if(err || !challenge)return res.sendStatus(500);
            if(challenge.contest.toString() != req.contest._id.toString()){
                return res.sendStatus(401);
            }
            req.challenge = res.locals.challenge = challenge;

            next();
        });
    }

    function getDaysDiff(d1,d2){
        d1 = new Date(d1);
        d2 = new Date(d2);
        d1.setHours(0);d2.setHours(0);
        d1.setMinutes(0);d2.setMinutes(0);
        d1.setSeconds(0);d2.setSeconds(0);
        d1.setMilliseconds(0);d2.setMilliseconds(0);
        return (d1-d2)/(3600000*24);
    }

    function setIsActive(contest,now){
        contest.startDate = contest.startTime;
        contest.endDate = contest.endTime;
        if(contest.startDate && contest.endDate){
            var startsIn = contest.startDate-now;
            var endsIn = contest.endDate-now;
            if(startsIn>0){
                contest.active = false;
                contest.upcoming = true;
                var daysDiff = getDaysDiff(contest.startDate,now);
                if(daysDiff>0){
                    contest.message = "Starts in " + daysDiff + " days from now.";
                }else{
                    contest.message = "Starts today at "+contest.startDate.getHours() + " : " + contest.startDate.getMinutes();
                }
            }else if(startsIn<0 && endsIn>0){
                contest.active = true;
                var daysDiff = getDaysDiff(contest.endDate,now);
                if(daysDiff>0){
                    contest.message = "Ends in " + daysDiff + " days from now.";
                }else{
                    contest.message = "Ends today at "+contest.endDate.getHours() + " : " + contest.startDate.getMinutes();
                }
            }else{
                contest.active = false;
                contest.upcoming = false;
                var daysDiff = getDaysDiff(now,contest.endDate);
                if(daysDiff>0){
                    contest.message = "Contest ended " + daysDiff + " days ago.";
                }else{
                    contest.message = "Ended today at "+contest.endDate.getHours() + " : " + contest.startDate.getMinutes();
                }
            }
        }else if(contest.startDate){
            var startsIn = contest.startDate - now;
            if(startsIn>0){
                contest.active = false;
                contest.upcoming = true;
                var daysDiff = getDaysDiff(contest.startDate,now);
                if(daysDiff>0){
                    contest.message = "Starts in " + daysDiff + " days from now.";
                }else{
                    contest.message = "Starts today at "+contest.startDate.getHours() + " : " + contest.startDate.getMinutes();
                }
            }else{
                contest.active = true;
                contest.message = "Contest indefinitely open";
            }
        }else if(contest.endDate){
            var endsIn = contest.endDate - now;
            if(endsIn>0){
                contest.active = true;
                var daysDiff = getDaysDiff(contest.endDate,now);
                if(daysDiff>0){
                    contest.message = "Ends in " + daysDiff + " days from now.";
                }else{
                    contest.message = "Ends today at "+contest.endDate.getHours() + " : " + contest.endDate.getMinutes();
                }
            }else{
                contest.active = false;
                contest.upcoming = false;
                var daysDiff = getDaysDiff(now,contest.endDate);
                if(daysDiff>0){
                    contest.message = "Ended " + daysDiff + " days ago.";
                }else{
                    contest.message = "Ended today at "+contest.endDate.getHours() + " : " + contest.endDate.getMinutes();
                }
            }
        }else{
            console.log("none");
            contest.active = true;
            contest.message = "Indefinitely open";
        }
    }

    function setIsRegistered(contest,user){
        if(!user)return contest.registered = false;
        for(var i=0;i<user.registeredContests.length;i++){
            if(user.registeredContests[i].toString()==contest._id.toString())return contest.registered = true;
        }
        return contest.registered = false;
    }

    function putAllContestsWithChallenges(req,res,next){
        var now = new Date();
        Contest.find({}).lean().exec(function(err,contests){
            if(err)return res.sendStatus(500);
            async.forEachSeries(contests,function(contest,callback){
                setIsActive(contest,now);
                setIsRegistered(contest,req.user);
                console.log(contest);
                Challenge.find({contest : contest._id},function(err,challenges){
                    if(err)callback(err);
                    contest.challenges = challenges;
                    callback();
                });
            },function(err){
                if(err)return res.sendStatus(500);
                req.contests = res.locals.contests = contests;
                next();
            });
        });
    }

    router.get("/",putAllContestsWithChallenges,function(req,res){
            res.render("contests");
    });

    router.get('/:contestTitle/challenges',putContestByTitle,function(req, res, next) {
        res.render("contest_challenges");
    });

    router.get('/:contestTitle/challenges/:challengeId/problem',putContestByTitle,putChallenge,function(req, res, next) {
        res.locals.langs = [
            {
                title : "java",
                ace : "java"
            },
            {
                title : "python",
                ace : "python"
            },
            {
                title : "node",
                ace : "javascript"
            }
        ];
        res.render('contest_challenge');
    });

    router.get('/:contestTitle/challenges/:challengeId/submissions',putContestByTitle,putChallenge,function(req, res, next) {
        Submission.find({
            user : req.user._id,
            challenge : req.challenge._id
        }).populate("challenge").lean().exec(function(err,submissions){
            if(err)return res.sendStatus(500);
            submissions.sort(function(s1,s2){
                return s1.timeSubmitted.getTime()<s2.timeSubmitted.getTime();
            });
            res.locals.submissions = submissions;
            res.render("contest_challenge_submissions");
        });
    });

    router.get('/:contestTitle/leaderBoard',putContestByTitle,function(req, res, next) {
        res.render('underConstruction');
    });
}
