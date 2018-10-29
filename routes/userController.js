const router = require('express').Router();
const User = require('../models/user');
const passport = require('passport');
const passportConfig = require('../config/passport');


//Profile page
router.get('/profile', function(req, res, next){
    User.findOne({ _id: req.user._id }, function(err, user) {
        if(err) return next(err);
        res.render('accounts/profile', { user: user });
    });
});

//User signup form
router.get('/signup', function(req, res, next){
    res.render('accounts/signup', { errors: req.flash('errors') });
});


//User signup
router.post('/signup', function(req, res, next){
    var newUser = new User();

    newUser.profile.name = req.body.name;
    newUser.email = req.body.email;
    newUser.password = req.body.password;

    User.findOne({ email: req.body.email }, function(err, existingUser){
        if(existingUser){
            req.flash('errors', 'Account with that eamil address already exists');
            return res.redirect('/user/signup');
        }else{
            newUser.save(function(err, newUser){
                if(err) return next(err);

                req.logIn(newUser, function(err){
                    if(err) return next(err);
                    res.redirect('/user/profile');
                });
            });
        }
    });
    
});

//User login form
router.get('/login', function(req, res, next){
    if(req.user) return res.redirect('/');
    res.render('accounts/login', { message: req.flash('loginMessage') });
});

//User login
router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/login',
    failureFlash: true
}));


router.get('/logout', function(req, res, next) {
    req.logout();
    res.redirect('/');
});

module.exports = router;