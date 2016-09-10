var express = require('express');
var router = express.Router();

module.exports.init = function(inject){

    router.use(inject(["adminDAO"]));

    router.get('/', function(req, res, next) {
        res.render('underConstruction');
    });
    router.get('/create',function(req, res, next) {
        res.render('underConstruction');
    });

    router.get('/edit/:challengeId/overview',inject(["adminDao"]),function(req, res, next) {
        req.adminDao.getAllUsers(function(users){
            res.json(users);
        });
    });

    router.get('/edit/:challengeId/notification',function(req, res, next) {
            res.render('underConstruction');
    });
    router.get('/edit/:challengeId/testCases',function(req, res, next) {
            res.render('underConstruction');
    });

    router.get('/edit/:challengeId/languages',function(req, res, next) {
            res.render('underConstruction');
    });
}

module.exports.router = router;
