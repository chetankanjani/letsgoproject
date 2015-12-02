var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;


var User = require('./app/models/users');
var config = require('./config');

module.exports = function (passport) {


    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });

    });


    //passport.use('local-signup', new LocalStrategy({
    //        usernameField: 'username',
    //        passwordField: 'password',
    //        passReqToCallback: true
    //    },
    //    function(res, username, password, done){
    //        process.nextTick(function(){
    //            User.findOne({'local.username': username}, function(err, user){
    //                if(err)
    //                    return done(err);
    //                if(user){
    //                    console.log(user);
    //                    return done(null, false, res.json('username already taken'));
    //                } else {
    //                    var newUser = new User();
    //                    newUser.local.username = email;
    //                    newUser.local.password = newUser.generateHash(password);
    //
    //                    newUser.save(function(err){
    //                        if(err)
    //                            throw err;
    //                        return done(null, newUser);
    //                    })
    //                }
    //            })
    //
    //        });
    //    }));
    //
    //passport.use('local-login', new LocalStrategy({
    //        usernameField: 'username',
    //        passwordField: 'password',
    //        passReqToCallback: true
    //    },
    //    function(req, username, password, done){
    //        process.nextTick(function(){
    //            User.findOne({ 'local.username': username}, function(err, user){
    //                if(err)
    //                    return done(err);
    //                if(!user)
    //                    return done(null, false, req.flash('loginMessage', 'No User found'));
    //                //if(!user.validPassword(password)){
    //                //    return done(null, false, req.flash('loginMessage', 'invalid password'));
    //                //}
    //                return done(null, user);
    //
    //            });
    //        });
    //    }
    //));


    passport.use(new FacebookStrategy({
            clientID: config.facebook.appId,
            clientSecret: config.facebook.appSecret,
            callbackURL: config.facebook.redirectUrl,
            profileFields: ['id', 'name', 'displayName', 'emails', 'photos']

        },
        function (accessToken, refreshToken, profile, done) {
            process.nextTick(function () {

                User.findOne({'facebook.id': profile.id}, function (err, user) {

                        console.log(profile);

                    if (err) {
                         console.log(err);
                       // return done(err);
                    }

                    if (user)
                        return done(null, user);
                    else {
                        var newUser = new User();

                        newUser.local=null;
                        newUser.facebook.id = profile.id;
                        newUser.facebook.token = accessToken;
                        newUser.facebook.name = profile.displayName;
                        newUser.facebook.email = profile.emails[0].value;
                        newUser.facebook.picurl = profile.photos[0].value;
                        // console.log("access to ken is "+accessToken);
                        //console.log(newUser.facebook.id);

                        newUser.save(function (err) {
                            if (err)
                                throw err;

                            return done(null, newUser);
                        })
                    }
                });
                });
           // done(null, profile);
        }
    ));


};