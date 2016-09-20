// var spawn = require('child_process').spawn,
//     child = spawn('phantomjs');
//
// child.stdin.setEncoding('utf-8');
// child.stdout.pipe(process.stdout);
//
// child.stdin.write("console.log('Hello from PhantomJS')\n");

const processMan = require("../processMan");
var fs = require('fs');
var path = require("path");

// close(err,timeout,code,stdout,stderr);

module.exports.codeExtension = "py";
module.exports.compiledExtension = "pyc";

module.exports.compile = function(filePath,cwd,callback){
    processMan.newProcess("python",["-m","py_compile",filePath],"",5000,cwd,function(err,timeout,code,stdout,stderr){
        if(err)return callback(err);
        if(timeout)return callback(false,"tle","");
        if(code !== 0 || stderr!=''){ //error
            return callback(false,stderr,stdout);
        }else{
            return callback(false,false,stdout);
        }
    });
}

module.exports.execute = function(filePath,cwd,testcase,callback){
    processMan.newProcess("python",[filePath],testcase,3000,cwd,function(err,timeout,code,stdout,stderr){
        if(err)return callback(err);
        if(timeout)return callback(false,"tle","");
        if(code !== 0 && stderr!=''){ //error
            return callback(false,stderr,stdout);
        }else{
            return callback(false,false,stdout);
        }
    });
}
