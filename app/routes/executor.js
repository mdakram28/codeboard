var express = require("express");
var passport = require('passport');
var User = require("../models/user");
var Contest = require("../models/contest");
var Challenge = require("../models/challenge");
var Submission = require("../models/submission");
var router = express.Router();
var exec = require("../core/executor");


module.exports.router = router;
module.exports.init = function(inject,io){



    io.on("connection",function(socket){
        socket.on("submitCode",function(data){
            Challenge.findOne({_id : data.challengeId},function(err,challenge){
                var testcases = [];
                challenge.testcases.forEach(function(tc){
                    testcases.push(tc.input);
                });
                var outputs = [];
                var totalScore = 0;
                exec.queueSubmission(data.lang,data.code,testcases,function(err,stderr,stdout){
                    if(err)return socket.emit("compileFailed","unknown");
                    if(stderr)return socket.emit("compileFailed",stdout + stderr);
                    socket.emit("compileSuccessful");
                },function(tc_index,err,stderr,stdout){
                    var output = {
                        i : tc_index,
                        score : 0
                    };
                    if(err){
                        output.success = false;
                        output.err = "Internal";
                    }else if(stderr=="tle"){
                        output.success = false;
                        output.err = "TLE";
                    }else if(stderr){
                        output.success = false;
                        output.err = "Code";
                    }else{
                        output.success = true;
                         stdout = stdout.trim("\r\n").split("\r").join("");
                         challenge.testcases[tc_index].output = challenge.testcases[tc_index].output.trim("\r\n").split("\r").join("");
                         if(challenge.testcases[tc_index].output == stdout){
                             output.match = true;
                             output.score = challenge.testcases[tc_index].score;
                         }else{
                             output.match = false;
                         }
                     }
                    socket.emit("testcaseDone",output);
                    outputs.push(output);
                    totalScore += output.score;
                    if(tc_index==challenge.testcases.length-1){
                        var newSub = new Submission({
                            user : data.userId,
                            challenge : challenge._id,
                            testcases : outputs,
                            code : data.code,
                            language : data.lang,
                            timeSubmitted : new Date(),
                            score : totalScore
                        });
                        newSub.save(function(err){
                            if(err)console.log(err);
                        });
                    }
                });
            });
        });

        socket.on("runCode",function(data){
            Challenge.findOne({_id : data.challengeId},function(err,challenge){
                if(err)throw err;
                console.log(challenge);
                var testcases = [challenge.sampleInput];
                exec.queueSubmission(data.lang,data.code,testcases,function(err,stderr,stdout){
                    if(err)return socket.emit("compileFailed","unknown");
                    if(stderr)return socket.emit("compileFailed",stdout + stderr);
                    socket.emit("compileSuccessful");
                },function(tc_index,err,stderr,stdout){
                    if(err)return socket.emit("testcaseDone",{
                        i : tc_index,
                        success : false,
                        err : "internal",
                        output : stderr+stdout
                    });
                    if(stderr=="tle")return socket.emit("testcaseDone",{
                        i : tc_index,
                        success : false,
                        err : "tle",
                        output : stdout
                    });
                    if(stderr)return socket.emit("testcaseDone",{
                         i : tc_index,
                         success : false,
                         err : "code",
                         output : stdout+stderr
                     })
                     stdout = stdout.trim("\r\n").split("\r").join("");
                     console.log(challenge.sampleOutput,stdout);
                    if(challenge.sampleOutput == stdout){
                        return socket.emit("testcaseDone",{
                            i : tc_index,
                            success : true,
                            match : true,
                            output : stdout
                        });
                    }else{
                        return socket.emit("testcaseDone",{
                            i : tc_index,
                            success : true,
                            match : false,
                            output : stdout
                        });
                    }
                });
            });
        });
    });

    router.get("/execute",function(req,res){
        req.logout();
        res.render("login");
    });

}
