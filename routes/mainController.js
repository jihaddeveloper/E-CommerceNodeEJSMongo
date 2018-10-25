const router = require('express').Router();



//Home Route
router.get('/', function(req, res, next){
    res.render('main/home');
});

//About Route
router.get('/about', function(req, res, next){
    res.render('main/about');
});

module.exports = router;