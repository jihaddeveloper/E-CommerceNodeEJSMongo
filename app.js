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
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: secret.secretKey,
    store: new MongoStore({ url: secret.database, autoReconnect: true })
}));
app.use(flash());
app.use(passport.initialize());


//Controllers Import
var mainCon = require('./routes/mainController');
var userCon = require('./routes/userController');


//Routes
app.use('/', mainCon);
app.use('/user',userCon);


app.listen(secret.port, function(err){
    if(err) throw err;
    console.log('Server is Running on http://127.0.0.1:3000/');
})