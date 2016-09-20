var express = require("express");
var passport = require('passport');
var User = require("../models/user");
var router = express.Router();

module.exports.router = router;
module.exports.init = function(inject){
    router.get("/login",function(req,res){
        req.logout();
        res.render("login");
    });

    router.get("/register",function(req,res){
        req.logout();
        res.render("register");
    });

    router.get("/logout",function(req,res){
        req.logout();
        res.redirect("/");
    });

    router.post("/login",passport.authenticate('local'),function(req,res,next){
        res.redirect("/");
    });

    router.post("/register",function(req, res) {
        User.register(new User({
            username : req.body.username,
            email : req.body.email,
            dateCreated : new Date()
        }), req.body.password, function(err, user) {
            if (err) {
                req.flash("errMessage",err.message);
                return res.redirect("/auth/register");
            }else{
                req.flash("message","User registered successfully");
                return res.redirect("/auth/login");
            }
        });
    });
}
