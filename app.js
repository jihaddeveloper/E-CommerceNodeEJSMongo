const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
var ejsMate = require('ejs-mate');

const app = express();

//Imports
var User = require('./models/user');

//MongoDB Connection
mongoose.connect('mongodb://jihad:jihad1234@ds115353.mlab.com:15353/e-commerce_db', function(err){
    if(err){
        console.log(err);
    }else{
        console.log('Conntected to MongoDB');
    }
});

//Middelwire
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');


//Home Route
app.get('/', function(req, res, next){
    res.render('main/home');
});

//About Route
app.get('/about', function(req, res, next){
    res.render('main/about');
});

//User Creation
app.post('/create-user', function(req, res, next){
    var newUser = new User();

    newUser.profile.name = req.body.name;
    newUser.password = req.body.password;
    newUser.email = req.body.email;

    newUser.save(function(err){
        if(err) return next(err);
        res.json('Successfully created a new User');
    });

});

app.listen(3000, function(err){
    if(err) throw err;
    console.log('Server is Running on http://127.0.0.1:3000/');
})