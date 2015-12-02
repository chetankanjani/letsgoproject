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

//var FB=require('fb');
////var app = express();
//FB.permissions=['publish_actions','status_update'];
//FB.forceDialogAuth=true;
//
//app.post('/post',function(req,res) {
//
//    FB.setAccessToken('CAARrsyVHXFEBAGWZB1OOK3xXm4Pulr3QGI6BFPfBHtAcw8wt01lMquPAVwZBzZBySvVJ36Pea7kOKs1tT2shahBuZAtxxXION5oxvi4m86TXEWfrsYF8WCZCM07ZA3LRNCzODU2mAMPke2BuN45SZAgtdaxZAFbxaCuUfSUFFoTkWR1O4nEMAxSm7ZAbzw6QKHgDvc2eqrZAElhyRVSOb8185399sZBhhnOH08ZD');
//
//    var body = 'yuhuuuuuuuu';
//    console.log('yolo');
//
//    FB.api('me/feed', 'post', {message: body}, function (res) {
//        if (!res || res.error) {
//            console.log(!res ? 'error' : res.error);
//            return;
//        }
//        console.log('post id:' + res.id);
//    });
//});


app.listen(config.port,function(err){
    if(err)
        console.log(err);
    else
        console.log('server running at  '+config.port);

});


var api = require('./routes/api')(app, express, passport);

app.use('/api',api);










