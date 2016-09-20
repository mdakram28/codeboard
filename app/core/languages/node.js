const processMan = require("../processMan");
var fs = require('fs');
var path = require("path");

module.exports.codeExtension = "js";
module.exports.compiledExtension = "js";

module.exports.compile = function(filePath,cwd,callback){
    return callback(false,false,"");
}

module.exports.execute = function(filePath,cwd,testcase,callback){
    // filePath = filePath.substr(0,filePath.lastIndexOf("."));
    // dir = filePath.substr(0,filePath.lastIndexOf("\\"));
    fileName = filePath.substr(filePath.lastIndexOf("\\")+1);
    processMan.newProcess("node",[fileName],testcase,5000,cwd,function(err,timeout,code,stdout,stderr){
        if(err)return callback(err);
        if(timeout)return callback(false,"tle","");
        if(code !== 0 && stderr!=''){ //error
            return callback(false,stderr,stdout);
        }else{
            return callback(false,false,stdout);
        }
    });
}
