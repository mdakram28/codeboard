var express = require('express');
var router = express.Router();

router.get("/",function(req,res){
    res.render("underConstruction");
});

router.get('/:contestId/challenges',function(req, res, next) {
    res.render('underConstruction');
});

router.get('/:contestId/challenges/:challengesId',function(req, res, next) {
    res.render('underConstruction');
});

router.get('/:contestId/leaderBoard',function(req, res, next) {
    res.render('underConstruction');
});

module.exports.router = router;
