var mongoose=require('mongoose');
var EventSchema=mongoose.Schema;


EventSchema={
    name:String,
    location:{ type:String },
    description:{type:String  },
    price: String,
    lat: String,
    long: String,
    rating: {
        value: Number, count: {type: Number, default: 10}, userrating: [{
            uservalue: Number, userid: String
        }]
    },
    imageurl:[String],
    userimageurl:[String],


    reviews:[{ userid:String,
                 username: String,
                comment:String , picurl:String}]

};

module.exports=mongoose.model('Event',EventSchema);