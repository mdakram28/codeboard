var $ = module.exports;
var path = require("path");
var fs = require("fs");
var async = require("async");

var exec = {
    'python' : require("./languages/python"),
    'java' : require("./languages/java"),
    'node' : require("./languages/node"),
    'cpp' : require("./languages/cpp"),
};

var submissions = {};

var firstSubmissionId = undefined;
var lastSubmissionId = undefined;

// compiler - close(err,timeout,code,stdout,stderr);

$.execute = function(executor,filename,compileDone,executeDone){
    exec[executor].compile(filename,function(err,stderr,stdout){
        compileDone(err,stderr,stdout);
        if(!err && !stderr){
            exec[executor].execute(filename,executeDone);
        }
    });
}

function removeDirForce(dirPath,done) {
    fs.readdir(dirPath, function(err, files) {
        if (err) done(err);
        async.each(files,function(file,callback){
            var filePath = path.join(dirPath , file);
            fs.stat(filePath, function(err, stats) {
                if(err)return callback(err);
                if(stats.isFile()){
                    fs.unlink(filePath,callback);
                }else{
                    removeDirForce(filePath,function(err){
                        if(err)return callback(err);
                        fs.rmdir(filePath,callback);
                    });
                }
            });
        },done);
    });
}

$.processSubmission = function(args,done){
    var executor = args[0];
    var data = args[1];
    var testcases = args[2];
    var compileDone = args[3];
    var executeDone = args[4];

    var cwd = path.join(__dirname, 'env',executor);
    var filePath = path.join(cwd,"test.");
    fs.writeFile(filePath+exec[executor].codeExtension,data, (err)=>{
        if(err){
            compileDone(err);
            done();
        }else{
            exec[executor].compile(filePath+exec[executor].codeExtension,cwd,(err,stderr,stdout)=>{
                compileDone(err,stderr,stdout);
                if(!err && !stderr){
                    var outputs = [];

                    async.eachOfSeries(testcases,function(testcase,index,callback){
                        exec[executor].execute(filePath+exec[executor].compiledExtension,cwd,testcase,(err,stderr,stdout)=>{
                            executeDone(index,err,stderr,stdout);
                            callback();
                        });
                    },function(err){
                        removeDirForce(cwd,(err)=>{
                            if(err)throw err;
                            done();
                        });
                    });
                }else{
                    removeDirForce(cwd,(err)=>{
                        if(err)throw err;
                        done();
                    });
                }
            });
        }
    });
}

$.processQueue = function(){
    if(lastSubmissionId){
        var args = submissions[firstSubmissionId];

        $.processSubmission(args,()=>{
            firstSubmissionId++;
            if(firstSubmissionId>lastSubmissionId){
                firstSubmissionId = undefined;
                lastSubmissionId = undefined;
            }
            $.processQueue();
        });
    }
}

$.queueSubmission = function(executor,fileContent,testcases,compileDone,executeDone){
    if(!lastSubmissionId){
        lastSubmissionId = 1;
        firstSubmissionId = 1;
        submissions[1] = arguments;
        $.processQueue();
        return 1;
    }else{
        lastSubmissionId++;
        submissions[lastSubmissionId] = arguments;
        return lastSubmissionId;
    }
}

$.cancelSubmission = function(submissionId){
    delete submissions[submissionId];
}
