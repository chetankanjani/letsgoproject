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
        value: String, count: {type: String, default: 10}, userrating: [{
            uservalue: String, userid: String
        }]
    },
    imageurl:[String],
    userimageurl:[String],


    reviews:[{ userid:String,
        username: String,
                comment:String}]

};

module.exports=mongoose.model('Event',EventSchema);