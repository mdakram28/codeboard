var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('underConstruction');
});
router.get('/create',function(req, res, next) {
    res.render('underConstruction');
});
router.get('/edit/:contestId/overview',function(req, res, next) {
    res.render('underConstruction');
});

router.get('/edit/:contestId/details',function(req, res, next) {
        res.render('underConstruction');
});

router.get('/edit/:contestId/challenges',function(req, res, next) {
        res.render('underConstruction');
});
module.exports.router = router;
