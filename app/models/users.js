var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var bcrypt=require('bcrypt-nodejs');

/*
var UserSchema=new Schema();


    UserSchema={
        name:String,
        username:{ type:String , required:true, index:{unique:true}},
        password:{type:String , required:true, select:false  },
        favouriteid:[{eventid:[String]}]

};
*/
/*
 UserSchema.pre('save',function(next){
 var user= this;

 if(!user.isModified('password'))
     return next();

       bcrypt.hash(user.password,null,null,function(err,hash){
       if(err)
          return next(err);

        user.password=hash;

           next();
       });

 });





 UserSchema.methods.comparePassword=function(password){
        var user=this;
        return bcrypt.compareSync(password,user.password);

 }
 */

// before facebook integration
//var UserSchema = new Schema({
//
//    name: String,
//    username: { type: String, required: true, index: { unique: true }},
//    password: { type: String, required: true, select: false},
//    favouriteid:[{eventid:String}]
//
//});
//
//
//UserSchema.methods.comparePassword = function(password) {
//
////    var user = this;
//
//    return bcrypt.compareSync(password, user.password);
//    }

// after facebook integration


var UserSchema = mongoose.Schema({
    local: {

        name: String,
        username: {type: String, },
        password: {type: String, select: false}
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String,
        picurl: String,
    },
    favouriteid: [{eventid: String}],
    recent: [{eventid: String}]

});


UserSchema.pre('save', function(next) {

    var user = this;


    if (!user.isModified('local.password')) return next();

    bcrypt.hash(user.local.password, null, null, function (err, hash) {
        if(err) return next(err);

        user.local.password = hash;
        next();

    });
});

UserSchema.methods.comparePassword = function(password) {

    var user = this;

    var a = bcrypt.compareSync(password, user.local.password);

    if (a == true)
        return true;
    else {
        console.log('error in compare paasword');
        return false;
    }

}


//
//UserSchema.methods.generateHash = function(password){
//    return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
//}
//
//UserSchema.methods.validPassword = function(password){
//    return bcrypt.compareSync(password, this.local.password);
//}




module.exports=mongoose.model('User',UserSchema);
