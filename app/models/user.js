var mongoose = require("mongoose");
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = mongoose.Schema({
    username : {
        type: String,
        unique : true,
        required : 'Username is required',
        match : [/^[a-zA-Z0-9_]{5,20}$/,'Username can contain only letters , numbers and underscore and can be of length >= 5 and <= 20']
    },
    email : {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    dateCreated : {
        type : Date,
        required : true
    },
    contests : [{
        type : mongoose.Schema.ObjectId,
        ref : "Contest"
    }],
    registeredContests : [{
        type : mongoose.Schema.ObjectId,
        ref : "Contest"
    }]
});
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);
