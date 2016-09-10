var User        = require("../models/user");
var Challenge   = require("../models/challenge");
var Contest     = require("../models/contest");
var Submission  = require("../models/submission");
var async       = require("async");

var $ = module.exports;

$.getAllUsers = function(callback){
    User.find({},callback);
}
$.getUserById = function(userId,callback){
    User.findOne({_id:userId},callback);
}
$.getUserByUsername = function(username,callback){
    User.find({username:username},callback);
}
$.getUserByEmail = function(email,callback){
    User.find({email:email},callback);
}

$.createUser = function(username,email,password,callback){
    async.forEach([
        function(callback){
            $.getUserByUsername(username,function(err,user){
                if(err)return callback(err);
                callback(user);
            });
        },
        function(callback){
            $.getUserByEmail(email,function(err,user){
                if(err)return callback(err);
                callback(user);
            });
        },
        function(callback){
            var u = new User();
            u.username = username;
            u.email = email;
            u.password = password;

            u.save(callback);
        }
    ],callback);
}
