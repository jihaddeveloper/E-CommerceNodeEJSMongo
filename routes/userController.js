const router = require('express').Router();
const User = require('../models/user');
const Cart = require('../models/cart');
const async = require('async');
const passport = require('passport');
const passportConfig = require('../config/passport');
const secretConfig = require('../config/secret');
const Product = require('../models/product');
const Category = require('../models/category');
const Review = require('../models/review');
const randomString = require('randomstring');
const CustomerOrder = require('../models/customerOrder');
const Live = require('../models/live');

//Mail Sender
const mailer = require('../misc/mailer');

//Profile page
router.get('/profile', passportConfig.isAuthenticated, function(req, res, next){
    
    CustomerOrder.find({user: req.user})
    .exec(function(err, orders){
        if(err) return next(err);
        res.render('accounts/profile', { user: req.user, orders: orders });
        //console.log(orders);
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

            
            var bool;
            if(req.body.isSeller === "on"){
                bool = true;
            }
            else{
                bool = false;
            }
        
            User.findOne({ email: req.body.email }, function(err, existingUser){
                if(existingUser){
                    req.flash('errors', 'Account with that eamil address already exists');
                    return res.redirect('/signup');
                }
                else if(req.body.password2 != req.body.password){
                    req.flash( 'errors', 'Passwords do not match' );
                    return res.redirect('/signup');
                }else if(req.body.password.length < 6){
                    req.flash( 'errors', 'Password must between 6 to 20 characters' );
                    return res.redirect('/signup');
                }
                else{

                    //Secret Token
                    const newSecretToken = randomString.generate();

                    var user = new User();

                    user.name = req.body.name;
                    user.profile.name = req.body.name;
                    user.email = req.body.email;
                    user.password = req.body.password;
                    user.contact = req.body.contact;
                    user.profile.picture = user.gravatar();
                    user.isSeller = bool;

                    user.secretToken = newSecretToken;
                    user.isActive = false;

                    user.save(function(err, user){
                        
                        if(err) return next(err);

                        //Mail body
                        const html = `Hello,
                        <br/>
                        Thank you for regestring ....
                        <br/>
                        <br/>
                        Now, please verify your eamil by typing the following token:
                        <br/>
                        Token: <b>${ user.secretToken }<b/>
                        <br/>
                        Clicking on the following page:
                        <a href="http://localhost:3000/verify">http://localhost:3000/verify<a/>
                        <br/>
                        <br/>
                        Good Day.... `;

                        //Mail sending
                        mailer.sendEmail('"Md Jihad Hossain" <devtestjihad@gmail.com>', user.email, 'Email Verification', html);

                        res.render('accounts/verify', { message: 'Successfully account created, now check your eamil and verify to login', errors: '' });

                        callback(null, user);
                    });
                }
            });
        },
        function(user){
            // var cart = new Cart();

            // cart.owner = user._id;
            // cart.save(function(err){
            //     if(err) return next(err);
            //     // req.logIn(user, function(err){
            //     //     if(err) return next(err);
            //     //     req.logout();
            //     // });
            // });
        }

    ]);   
    
});

//User email token verify
router.get('/verify', function(req, res, next){
    res.render('accounts/verify', { message: '', errors: '' });
});

router.post('/verify', async(req, res, next)=>{

    try{
        const secretToken = req.body.secretToken;

    const user = await User.findOne({ 'secretToken': secretToken.trim() });

    if(!user){
        return res.render('accounts/verify', { message: '', errors: 'No User found' });
    }

    user.isActive = true;
    user.secretToken = '';
    await user.save();

    res.render('accounts/login', { message: 'Successful, now you may login', errors: '' });
    }catch(error){
        next(error);
    }
});

//User login form
router.get('/login', function(req, res, next){
    if(req.user) return res.redirect('/');
    res.render('accounts/login', { message: '', errors: req.flash('loginMessage') });
});

//User login
router.post('/login',passport.authenticate('local-login', {  
        // successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }), function(req, res, next){
        if(req.session.returnTo){
            res.redirect(req.session.returnTo);
            delete req.session.returnTo;
        }else{
            res.redirect('/profile');
        }   
});

//User logout
router.get('/logout', function(req, res, next) {
    req.logout();
    
    //Product return to live
    var cart = req.session.cart;
    if(cart){
        for(var i = 0; i < cart.length; i++){
            //Increment the live frontQuantity
            Live.findOneAndUpdate({product_id: cart[i].product},
                {$inc: { frontQuantity: cart[i].quantity }}, {new: true},function(err, newLive){
                    if(err) return next(err);

                    console.log(newLive);
            });

        }
    }

    //Remove old url
    delete req.session.returnTo;
    
    //Remove cart
    delete req.session.cart;
    
    res.redirect('/');
});

//Profile update form
router.get('/edit-profile', passportConfig.isAuthenticated, function(req, res, next){
    res.render('accounts/editProfile', { message: req.flash('success') });
});

//Profile update
router.post('/edit-profile', passportConfig.isAuthenticated, function(req, res, next){
    User.findOne({ _id: req.user._id }, function(err, user){
        if(err) return next(err);

        var bool;
        if(req.body.isSeller === "on"){
            bool = true;
        }
        else{
                bool = false;
        }

        if(req.body.name) user.profile.name = req.body.name;
        if(req.body.email) user.email = req.body.email;
        if(req.body.contact) user.contact = req.body.contact;
        
        user.isSeller = bool;

        user.save(function(err){
            if(err) return next(err);
            req.flash('success', 'Successfully edited profile');
            return res.redirect('/profile');
        });
    })
});

//Profile Address update form
router.get('/edit-address', passportConfig.isAuthenticated, function(req, res, next){
    res.render('accounts/editAddress', { message: req.flash('success') });
});

//Profile Address update
router.post('/edit-address', passportConfig.isAuthenticated, function(req, res, next){
    User.findOne({ _id: req.user._id }, function(err, user){
        if(err) return next(err);

        if(req.body.address1) user.address.address1 = req.body.address1;
        if(req.body.address2) user.address.address2 = req.body.address2;
        if(req.body.city) user.address.city = req.body.city;
        if(req.body.district) user.address.district = req.body.district;
        if(req.body.country) user.address.country = req.body.country;
        if(req.body.postalCode) user.address.postalCode = req.body.postalCode;

        user.save(function(err){
            if(err) return next(err);
            req.flash('success', 'Successfully edited address');
            return res.redirect('/profile');
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

//Add product from user form
router.get('/add-product',passportConfig.isAuthenticated, function(req, res, next){
    res.render('accounts/addProduct', { message: req.flash('success') });
});

//Add product from user function
router.post('/add-product',passportConfig.isAuthenticated, function(req, res, next){

    User.findOne({ _id: req.user._id }, function(err, user) {
        if(err) return next(err);
        

        Category.findOne({ name: req.body.categoryName }, function(err, category){

            if(err) return next(err);
            var newCategory = category;

            let product = new Product();

            product.category = newCategory._id;
            product.name = req.body.name;
            product.price = req.body.price;
            product.description = req.body.description;
            product.owner = req.user._id;
            //product.image = req.file.location;


            product.save(function(err, product){
                if(err) return next(err);
                req.flash('success', 'Successfully added product');
                return res.redirect('/add-product');
            });
        });

    });
});

module.exports = router;