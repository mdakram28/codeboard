var express = require('express');
var router = express.Router();
var Contest = require("../../models/contest");
var Challenge = require("../../models/challenge");
var moment = require('moment');

module.exports.init = function(inject){

    var int = inject("interceptor");

    router.use(int.autoLogin);

    router.get('/add/:contestId',int.contest.getById,function(req, res, next) {
        var newChallenge = new Challenge({
            dateCreated : new Date(),
            contest : req.contest,
            difficulty : "easy",
            score : 100
        });
        newChallenge.title = newChallenge._id.toString();
        console.log(newChallenge.title);
        newChallenge.save(function(err){
            if(err){
                return res.sendStatus(500);
            }
                return res.redirect("/administration/challenges/"+newChallenge._id.toString()+"/details");
        });
    });

    router.get('/:challengeId/details',int.challenge.getById,function(req, res, next) {
        res.render("admin_challenge_details");
    });
    router.post('/:challengeId/details',int.challenge.getById,function(req, res, next) {
        var b = req.body;
        req.challenge.update({
            title : b.title,
            difficulty : b.difficulty,
            score : b.score,
            description : b.description,
            problemStatement : b.problemStatement,
            inputFormat : b.inputFormat,
            constraints : b.constraints,
            outputFormat : b.outputFormat,
            sampleInput : b.sampleInput,
            sampleOutput : b.sampleOutput
        },function(err,callback){
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
                res.locals.errMessage = "Failed to save new details";
                return res.render("admin_challenge_details",{
                    errors : err.errors
                });
            }
            req.flash("message","Challenge details updated successfully");
            return res.redirect(req.originalUrl);
        });
    });

    router.post('/:challengeId/saveTestcase',int.challenge.getById,function(req,res,next){
        var b = req.body;
        var i = parseInt(req.body.index);
        console.log(req.body);
        if(i<0 || i>req.challenge.testcases.length){
            i = req.challenge.testcases.length;
        }
        req.challenge.testcases[i] = {
            score : b.score,
            input : b.input,
            output : b.output
        };
        console.log(i,req.challenge.testcases[i]);
        req.challenge.save(function(err){
            if(err)return res.sendStatus(500);
            return res.redirect("testcases");
        });
    });

    router.get('/:challengeId/deleteTestCase',int.challenge.getById,function(req,res,next){
        if(!req.query.i)return res.redirect("testcases");
        var i = parseInt(req.query.i);
        if(i>=0 && i<req.challenge.testcases.length){
            req.challenge.testcases.splice(i,1);
            req.challenge.save();
        }
        return res.redirect("testcases");
    });


    router.get('/:challengeId/testcases',int.challenge.getById,function(req,res,next){
        var i = 99999999;
        if(req.query.i)i = parseInt(req.query.i);
        if(i<0 || i>=req.challenge.testcases.length){
            res.locals.testcases = req.challenge.testcases;
            res.locals.index = 999999;
            res.locals.testcase = {};
        }else{
            res.locals.testcases = req.challenge.testcases;
            res.locals.index = i;
            res.locals.testcase = req.challenge.testcases[i];
        }
        return res.render("admin_challenge_testcases");
    });



    router.get('/:challengeId/languages',function(req, res, next) {
            res.render('underConstruction');
    });
}

module.exports.router = router;
