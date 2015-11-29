var config=require('./config');
var mongoose=require('mongoose');
var bodyparser=require('body-parser');
var express = require('express');
var morgan=require('morgan');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');
var nodemailer = require('nodemailer');

var app = express();


app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());
app.use(morgan('dev'));

app.use(session({
    secret: 'anystringoftext',
    saveUninitialized: true,
    resave: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/public',express.static(__dirname + '/public'));


mongoose.connect(config.database,function(err){
    if(err)
        console.log(err);
    else
        console.log('database connected');
});

require('./passport')(passport);


app.get('/',function(req,res){
    res.sendFile(__dirname +'/public/app/views/index.html' );
});
app.use(flash()); // use connect-flash for flash messages stored in session


app.listen(config.port,function(err){
    if(err)
        console.log(err);
    else
        console.log('server running at  '+config.port);

});


var api = require('./routes/api')(app, express, passport);

app.use('/api',api);










