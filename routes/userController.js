const router = require('express').Router();
const User = require('../models/user');
const Cart = require('../models/cart');
const async = require('async');
const passport = require('passport');
const passportConfig = require('../config/passport');
const secretConfig = require('../config/secret');

const jwt = require('jsonwebtoken');


//Profile page
router.get('/profile', passportConfig.isAuthenticated, function(req, res, next){
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

    async.waterfall([

        function(callback){
            var user = new User();

            user.profile.name = req.body.name;
            user.email = req.body.email;
            user.password = req.body.password;
            user.profile.picture = user.gravatar();
        
            User.findOne({ email: req.body.email }, function(err, existingUser){
                if(existingUser){
                    req.flash('errors', 'Account with that eamil address already exists');
                    return res.redirect('/signup');
                }else{
                    user.save(function(err, user){
                        if(err) return next(err);
                        callback(null, user);
                    });

                    var token = jwt.sign({ user: user },
                         secretConfig.secretKey, {
                             expiresIn: '1d'
                    });

                    //res.json({ token: token });

                }
            });
        },

        function(user){
            var cart = new Cart();

            cart.owner = user._id;
            cart.save(function(err){
                if(err) return next(err);
                req.logIn(user, function(err){
                    if(err) return next(err);
                    res.redirect('/profile');
                });
            });
        }

    ]);   
    
});

//User login form
router.get('/login', function(req, res, next){
    if(req.user) return res.redirect('/');
    res.render('accounts/login', { message: req.flash('loginMessage') });
});

//User login
router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));

//User logout
router.get('/logout', function(req, res, next) {
    req.logout();
    res.redirect('/');
});

//Profile update form
router.get('/edit-profile', function(req, res, next){
    res.render('accounts/editProfile', { message: req.flash('success') });
});

//Profile update
router.post('/edit-profile', function(req, res, next){
    User.findOne({ _id: req.user._id }, function(err, user){
        if(err) return next(err);

        if(req.body.name) user.profile.name = req.body.name;
        if(req.body.contact) user.contact = req.body.contact;
        if(req.body.address) user.address = req.body.address;

        user.save(function(err){
            if(err) return next(err);
            req.flash('success', 'Successfully edited profile');
            return res.redirect('/edit-profile');
        });
    })
});

//facebook login route
router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));
//facebook login
router.get('/auth/facebook/callback', passport.authenticate('facebook',{
    successRedirect: '/profile',
    failureRedirect: '/login'
}));

module.exports = router;