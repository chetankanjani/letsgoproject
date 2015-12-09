var mongoose = require('mongoose');
var User = require('../app/models/users');
var Event = require('../app/models/event');

var config = require('../config');

var jsonwebtoken = require('jsonwebtoken');


function createToken(user) {

    var token = jsonwebtoken.sign({

        _id: user._id,
        name: user.local.name,
        username: user.local.username

    }, config.superSecret, {
        expiresInMinutes: 1440

    });


    return token;


}

/*

 var FB = require('fb');

 FB.api('4', function (res) {
 if(!res || res.error) {
 console.log(!res ? 'error occurred' : res.error);
 return;
 }
 console.log(res.id);
 console.log(res.name);
 });

 */


module.exports = function (app, express, passport) {

    var api = express.Router();


    api.post('/signup', function (req, res) {

        var user = new User();

        user.local.name = req.body.name;
        user.local.username = req.body.username;
        user.local.password = req.body.password;
        //console.log(req.body.username);
        //console.log(user.local.password);
        user.facebook=null;


        user.save(function (err) {
            if (err) {
                if (err.code == 1100)
                    return res.json({message: "User with this username already exist ", success: false});
                else {
                    console.log(err);
                    return res.json({message: "User not created", success: false});

                }
            }
            else
                return res.json({message: "User created Successfully!", success: true});


        });

    });


    api.post('/login', function (req, res) {


        User.findOne({

            'local.username': req.body.username
        }).select('local.password').exec(function (err, user) {

            console.log(user);
            if (err)
                throw err;
            if (!user) {
                res.json({message: "User doesn't exist", success: false, userprofile: user});


            } else if (user) {
                var validPassword = user.comparePassword(req.body.password);

                if (!validPassword) {
                    res.json({message: "Invalid Password", success: false})
                }
                else {
                    var token = createToken(user);

                    res.json({
                        success: true,
                        message: "Successfully login",
                        token: token,
                        userid: user._id


                    });

                }

            }
        });
    });


    //api.post('/login', passport.authenticate('local-login', {
    //successRedirect: '/#/home',
    //    failureRedirect: '/#/login',
    //    failureFlash: true
    //}));
    //
    //
    //
    //api.post('/signup', passport.authenticate('local-signup', {
    //    successRedirect: '/#/home',
    //    failureRedirect: '/#/signup',
    //    failureFlash: true
    //}));
    api.post('/removefavourites', function (req, res) {
        // _id: req.body.id;
        User.findByIdAndUpdate({_id: req.body.userid},
            {$pull: {favouriteid: {eventid: req.body.eventid}}},
            function (err) {
                if (err)
                    return err;
                else
                    res.json({success: true});
            });
    });
    api.get('/auth/facebook', function (req, res, next) {

        passport.authenticate('facebook', {scope: ['email']})(req, res, next);
    });


    api.get('/auth/facebook/callback',

        passport.authenticate('facebook', {


            successRedirect: '#/home',
            failureRedirect: '#/login'


        })

    );





    api.post('/addimageurl', function (req, res) {


        Event.findByIdAndUpdate({_id: req.body.eventid},
            {$push: {"imageurl": req.body.imageurl}},
            // {$push: {"userimageurl": req.body.userimageurl}},
            {upsert: true},
            function (err, events) {
                if (err)
                    res.json(err);
                else
                    res.json({success: true});

            });

    });

    api.post('/addfavourites', function (req, res) {
        // _id: req.body.id;
        User.findByIdAndUpdate({_id: req.body.userid},
            {$push: {favouriteid: {eventid: req.body.eventid}}},
            {upsert: true},
            function (fav) {
                res.json({success: true});
            });
    });
    //api.post('/removefavourites', function (req, res) {
    //    // _id: req.body.id;
    //    User.findByIdAndUpdate({_id: req.body.userid},
    //        {favouriteid: {eventid: req.body.eventid}},
    //        {upsert: true},
    //        function (fav) {
    //            res.json({success: true, user: fav});
    //        });
    //});


    api.get('/getfavourites', function (req, res) {


        var userid = req.param('userid');
        array = [];


        User.findById({_id: userid}, function (err, users) {
            if (err) {
                res.send(err);
                return;
            }
            else {

                if (users != null) {
                    var i;
                    var length = users.favouriteid.length;


                    for (i = 0; i < length; i++) {


                        var temp = {eid: users.favouriteid[i].eventid};


                        Event.findById({_id: temp.eid}, function (err, events) {
                            if (err) {
                                res.send(err);
                                return;
                            }
                            else {

                                array.push(events);


                            }
                            if (array.length === length) {//it is true when all events are pushed
                                res.json(array);
                            }

                        })


                    }

                }

            }

        });

    });


    /*
     api.get('/getfavourites',function(req,res) {

     var userid = req.param('userid');


     User.findById({_id: userid}, function (err, users) {

     if (err) {
     res.send(err);
     return;
     }
     else{

     var length=users.favouriteid.length;

     //   console.log(length);

     var i=0;






     var output=[];

     function mainProgram(output,callback) {


     function findevent(i) {
     var temp = {eid: users.favouriteid[i].eventid};


     Event.findById({_id: temp.eid}, function (err, events) {
     if (err) {
     res.send(err);
     return;
     }
     else {
     output.push(events);
     console.log("inside finding events value of i s " + i);
     i++;
     console.log(+i);

     if (i < length) {
     findevent(i);

     }
     else
     mainprogram(output);


     }

     });
     }
     }

     function mainprogram (output){
     res.json(output);
     }


     }
     });


     });

     */


    api.get('/sortby_price', function (req, res) {
        Event.find({}, function (err, events) {
            if (err) {

                res.send(err);
                return;
            }

            var ascending = true;//change to false for descending
            events.sort(function (a, b) {
                return (a.price - b.price) * (ascending ? 1 : -1);
            });
            var array=[];
            var array1=[];
            array1.push(events);
            array1.push(array);
            res.json(array1);
        });
    });
    api.get('/sortby_rating', function (req, res) {
        Event.find({}, function (err, events) {
            if (err) {
                res.send(err);
                return;
            }

            var ascending = false;//change to false for descending
            events.sort(function (a, b) {
                return (a.rating.value - b.rating.value) * (ascending ? 1 : -1);
            });//"message": "'$push' is empty. You must specify a field like so: {$push: {<field>: ...}}",

            var array=[];
            var array1=[];
            array1.push(events);
            array1.push(array);
            res.json(array1);
        });
    });


    api.post('/addcomment', function (req, res) {


        var username;

        User.findById({_id: req.body.userid}, function (err, user) {
            if (err)
                console.log("username cannot be found request : add comment");
            else {

                //return user.username;

                // console.log(user.name);
                updatecomment(user);


            }
        })


        function updatecomment(user) {

            if(user.facebook.name!=null&&user.facebook.picurl!=null) {
                var a = user.facebook.name;
                var b=user.facebook.picurl;
            }
            else {
                var a = user.local.name;
                var b ="http://tr3.cbsistatic.com/fly/280-fly/bundles/techrepubliccore/images/icons/standard/icon-user-default.png";
            }



            console.log(a);
            Event.findByIdAndUpdate({_id: req.body.eventid},
                {
                    $push: {
                        "reviews": {
                            userid: req.body.userid, username: a


                            , comment: req.body.content,
                            picurl:b
                        }
                    }
                },
                {upsert: true},
                function (err, events) {
                    if (err)
                        res.json(err);
                    else
                        res.json({success: true});

                });

        }


    });


    api.post('/search', function (req, res) {
        Event.find({
            $or: [{'name': req.body.name}, {'location': req.body.name}]
        }, function (err, events) {
            if (err)
                return res.json(err);
            else
                res.json(events);
        });
    });

    api.get('/eventfeed', function (req, res) {

        var array = [];

        Event.find({}, function (err, event) {
            if (err)
                console.log(err);
            else {
                array.push(event);

                resp(array);

            }


        });
        function resp(array1) {


            var userid = req.param('userid');
            array = [];


            User.findById({_id: userid}, function (err, users) {
                if (err) {
                    res.send(err);
                    return;
                }
                else {


                    var i;

                    //if(users.favouriteid==null)
                    console.log('inside second function inside get reues');
                    console.log(users);

                    if (users != null) {
                        var length = users.favouriteid.length;
                        //else
                        //var length=0;

                        if (length > 0) {
                            for (i = 0; i < length; i++) {


                                var temp = {eid: users.favouriteid[i].eventid};


                                Event.findById({_id: temp.eid}, function (err, events) {
                                    if (err) {
                                        res.send(err);
                                        return;
                                    }
                                    else {

                                        array.push(events._id);


                                    }
                                    if (array.length === length) {//it is true when all events are pushed
                                        {
                                            array1.push(array);
                                            res.json(array1);
                                        }
                                    }

                                })


                            }
                        }
                        else {
                            array1.push(array);
                            res.json(array1);
                        }

                    }
                }

            });


        }

    });
    api.post('/email', function (req, res) {
        var nodemailer = require('nodemailer');
        var transporter = nodemailer.createTransport("SMTP", {
            service: 'Gmail',
            auth: {
                user: 'letsgominor@gmail.com',
                pass: 'letsgo_123'
            }
        }, {
            // default values for sendMail method
            from: req.body.from,
            headers: {
                'My-Awesome-Header': '123'
            }

        });
        //console.log("here we go");
        transporter.sendMail({
            to: 'letsgominor@gmail.com',
            subject: 'Feedback From ' + req.body.name + '@ ' + req.body.email,
            text: req.body.message
        }, function (err, res) {
            // console.log("close");
            if (err)
                console.log(err);
            else
                console.log("email sent");

        });
        res.json({message: "email sent"});
    });


    api.post('/rateevent', function (req, res) {

        var userid = req.body.userid;
        var uservalue = req.body.uservalue;
        var eventid = req.body.eventid;

        Event.findByIdAndUpdate({_id: eventid},
            {$push: {'rating.userrating': {uservalue: uservalue, userid: userid}}},
            {upsert: true},
            function (err, events) {
                if (err) {
                    res.send(err);
                    return;
                }
                else {

                    //console.log(uservalue);

                    calculaterating(events, uservalue);
                }
            });

        function calculaterating(event, uservalue) {


            Event.findById({_id: eventid},
                function (err, events) {
                    if (err) {
                        res.send(err);
                        return;
                    }
                    else {


                        var count = events.rating.count;
                        count = count + 1;
                        var value = events.rating.value;
                        //console.log(value);
                        //console.log(count);
                        //console.log(uservalue);
                        value = (value * (count - 1));
                        var u=+uservalue;
                        value=value+u;
                        value/=count;
                        events.rating.value = value;
                        events.rating.count = count;
                        //console.log(value);                        //console.log(count);
                        Event.findOneAndUpdate(
                            {'_id': eventid},
                            {$set: {
                                'rating.count': count,
                                'rating.value': value
                            }},
                            function(err, event){
                                if (err) {
                                    res.send(err);
                                    return;
                                }
                                else {
                                    //res.json({success:true});
                                   // console.log(event);
                                }
                            });
                    }
                });


            res.json({success:true});
        }
    });

    //
    //
    //api.post('/rateevent', function (req, res) {
    //
    //    var userid = req.body.userid;
    //    var uservalue = req.body.uservalue;
    //    var eventid = req.body.eventid;
    //
    //    Event.findByIdAndUpdate({_id: eventid},
    //        {$push: {'rating.userrating': {uservalue: uservalue, userid: userid}}},
    //        {upsert: true},
    //        function (err, events) {
    //            if (err) {
    //                res.send(err);
    //                return;
    //            }
    //            else {
    //
    //                //console.log(uservalue);
    //
    //                calculaterating(events, uservalue);
    //            }
    //        });
    //
    //    function calculaterating(event, uservalue) {
    //
    //
    //        Event.findById({_id: eventid},
    //            function (err, events) {
    //                if (err) {
    //                    res.send(err);
    //                    return;
    //                }
    //                else {
    //
    //
    //                    var count = event.rating.count;
    //                    count = count + 1;
    //                    var value = event.rating.value;
    //                    console.log(value);
    //                    console.log(count);
    //                    console.log(uservalue);
    //                    value = (value * (count - 1));
    //                    var u=+uservalue;
    //                    value=value+u;
    //                    value/=count;
    //                    events.rating.value = value;
    //                    events.rating.count = count;
    //                    console.log(value);
    //                    console.log(count);
    //                }
    //            });
    //        Event.findByIdAndUpdate(
    //            {'_id': eventid},
    //            {$set: {
    //                'rating.count': event.rating.count,
    //                'rating.value': event.rating.value
    //            }},
    //            function(err, event){
    //                if (err) {
    //                    res.send(err);
    //                    return;
    //                }
    //                else {
    //                    //res.json({success:true});
    //                    console.log(event);
    //                }
    //            });
    //
    //        res.json({success:true});
    //    }
    //});

    //api.post('/rateevent', function (req, res) {
    //
    //    var userid = req.body.userid;
    //    var uservalue = req.body.uservalue;
    //    var eventid = req.body.eventid;
    //
    //    Event.findByIdAndUpdate({_id: eventid},
    //        {$push: {'rating.userrating': {uservalue: uservalue, userid: userid}}},
    //        {upsert: true},
    //        function (err, events) {
    //            if (err) {
    //                res.send(err);
    //                return;
    //            }
    //            else {
    //
    //                //console.log(uservalue);
    //
    //                calculaterating(events, uservalue);
    //            }
    //        });
    //
    //    function calculaterating(event, uservalue) {
    //
    //        console.log(event);
    //
    //        var count = event.rating.count;
    //        count = count + 1;
    //        var value = event.rating.value;
    //
    //        value = (value * (count - 1) + uservalue) / count
    //
    //
    //        Event.findById({_id: eventid},
    //            // {$push:\ {'rating.userrating' : 'value','rating.count':'count'}},
    //            //   {upsert: true},
    //            function (err, events) {
    //                if (err) {
    //                    res.send(err);
    //                    return;
    //                }
    //                else {
    //
    //                    events.rating.value = value;
    //                    events.rating.count = count;
    //                    console.log(events);
    //
    //
    //                    res.json('rating updated');
    //                }
    //            });
    //
    //    }
    //
    //
    //});

    api.post('/getratedetails',function(req,res) {

        var eventid=req.body.eventid;
        var userid=req.body.userid;


        Event.findOne({'_id': eventid,'rating.userrating.userid':userid}, function (err, events) {
            if (err) {
                res.send(err);
                return;
            }
            else {
                //    rating.userrating.userid':userid
                console.log(events);
                if(events!=null) {
                    if (events.rating != null) {
                        if (events.rating.userrating != null) {
                            res.json({success: true, 'uservalue': events.rating.userrating.uservalue});
                        }else
                            res.json({success:false});

                    }else
                    res.json({success:false});


                }else
                    res.json({success:false});
            }
        });






    });


    api.get('/getfbuseridweb', function (req, res) {


        var fbid = req.param('fbid');

        console.log(fbid);


        User.findOne({'facebook.id': fbid}, function (err, user) {
            if (err)
                console.log(err);
            else {

                if(user!=null)
                    res.json({userid: user._id,success:true});

            }

        });

    });

    api.post('/getfbuserid', function (req, res) {


        var fbid = req.body.fbid;


        User.findOne({'facebook.id': fbid}, function (err, user) {
            if (err)
                console.log(err);
            else {
              //  console.log(user._id);
                if(user!=null)
                res.json({userid: user._id,success:true});
                else
                {
                    var user = new User();

                    user.local=null;
                    user.facebook.id=req.body.fbid;
                    user.facebook.token=req.body.token;
                    user.facebook.email=req.body.email;
                    user.facebook.name=req.body.name;
                    user.facebook.picurl=req.body.picurl;


                    user.save(function (err) {
                        if (err) {
                            if (err.code == 1100)
                                return res.json({message: " fb user account not created  ", success: false});
                            else {
                                console.log(err);
                                return res.json({message: "User not created", success: false});

                            }
                        }
                        else
                            return res.json({userid: user._id , success: true});


                    });

                }
            }
        });





    });


    api.get('/getevent', function (req, res) {


        var eventid = req.param('eventid');

        Event.findById({_id: eventid}, function (err, events) {
            if (err) {
                res.send(err);
                return;
            }
            else {
                res.json(events);
            }
        });

    });
    api.get('/getuser', function (req, res) {


        var userid = req.param('userid');

        User.findById({_id: userid}, function (err, users) {
            if (err) {
                res.send(err);
                return;
            }
            else {
                res.json(users);
            }
        });

    });
    api.post('/addrecent', function (req, res) {

        User.findByIdAndUpdate({_id: req.body.userid}, {
                $push: {
                    "recent": {
                        $each: [{eventid: req.body.eventid}],
                        $slice: -5
                    }
                }
            },
            {upsert: true},
            function (err, user) {
                if (err)
                    res.json(err);
                else
                    res.json(user);
            });

    });

    api.get('/getrecent', function (req, res) {

        var userid = req.param('userid');
        array = [];


        User.findById({_id: userid}, function (err, users) {
            if (err) {
                res.send(err);
                return;
            }
            else {

                if (users != null) {
                    var i;
                    var length = users.recent.length;


                    for (i = 0; i < length; i++) {


                        var temp = {eid: users.recent[i].eventid};


                        Event.findById({_id: temp.eid}, function (err, events) {
                            if (err) {
                                res.send(err);
                                return;
                            }
                            else {

                                array.push(events);


                            }
                            if (array.length === length) {//it is true when all events are pushed
                                res.json(array);
                            }

                        })


                    }

                }

            }

        });

    });
    /*
     //authentication
     api.use(function(req, res, next) {


     console.log("Somebody just came to our app!");

     var token = req.body.token || req.param('token') || req.headers['x-access-token'];

     // check if token exist
     if(token) {

     jsonwebtoken.verify(token, config.superSecret, function(err, decoded) {

     if(err) {
     res.status(403).send({ success: false, message: "Failed to authenticate user"});

     } else {

     //
     req.decoded = decoded;
     next();
     }
     });
     } else {
     res.status(403).send({ success: false, message: "No Token Provided"});
     }

     });



     */


    api.get('/getusers', function (req, res) {

        User.find({}, function (err, user) {
            if (err)
                console.log(err);
            else
                res.json(user);

        });

    });



    api.post('/newevent', function (req, res) {
        var event = new Event();

        event.name = req.body.name;
        event.location = req.body.location;

        event.description = req.body.description;
        event.price = req.body.price;
        event.lat = req.body.lat;
        event.long = req.body.long;
        event.rating.value = req.body.rating;
        event.imageurl = req.body.imageurl;
        event.userimageurl = req.body.userimageurl;
        event.save(function (err) {
            if (err) {
                if (err.code == 1100)
                    return res.json({message: "Event with this name already exist "});
                else
                    res.json(err);
                    return res.json({message: "event not created"});
            }
            else
                return res.json({message: "Event created Successfully!"});
            //   console.log('event created');

        });
    });


    //return res.json({message:"Event created Successfully!"});


    api.get('/getgeojson', function (req, res) {

        //Data
        var cities = [
            {
                city: 'Toronto',
                desc: 'This is the best city in the world!',
                lat: 43.7000,
                long: -79.4000
            },
            {
                city: 'New York',
                desc: 'This city is aiiiiite!',
                lat: 40.6700,
                long: -73.9400
            },
            {
                city: 'Chicago',
                desc: 'This is the second best city in the world!',
                lat: 41.8819,
                long: -87.6278
            },
            {
                city: 'Los Angeles',
                desc: 'This city is live!',
                lat: 34.0500,
                long: -118.2500
            },
            {
                city: 'Las Vegas',
                desc: 'Sin City...\'nuff said!',
                lat: 36.0800,
                long: -115.1522
            }
        ];


        res.json(cities);

    });


    return api;

}





