const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');


const secret = require('./config/secret');
var Category = require('./models/category');

const app = express();

//MongoDB Connection
mongoose.connect(secret.database, function(err){
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
app.use(cookieParser());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: secret.secretKey,
    store: new MongoStore({ url: secret.database, autoReconnect: true })
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
    res.locals.user = req.user;
    next();
});

app.use(function(req, res, next){
    Category.find({}, function(err, categories){
        if(err) return next(err);
        res.locals.categories = categories;
        next();
    });
});

//View engine
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');


//Controllers Import
var mainCon = require('./routes/mainController');
var userCon = require('./routes/userController');
var adminCon = require('./routes/adminController');
var apiCon = require('./api/api');


//Routes
app.use(mainCon);
app.use(userCon);
app.use(adminCon);
app.use('/api', apiCon);


app.listen(secret.port, function(err){
    if(err) throw err;
    console.log('Server is Running on http://127.0.0.1:3000/');
})