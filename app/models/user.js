var mongoose = require("mongoose");

var userSchema = mongoose.Schema({
    username : {
        type: String,
        unique : true
    },
    email : String,
    password : String,
    dateCreated : Date,
    contests : [{
        type : mongoose.Schema.objectId,
        ref : "Contest"
    }],
    registeredContests : [{
        type : mongoose.Schema.objectId,
        ref : "Contest"
    }]
});

module.exports = mongoose.model("User",userSchema);
