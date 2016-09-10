var mongoose = require("mongoose");

var contestSchema = mongoose.Schema({
    title : {
        type : String,
        unique : true
    },
    dateCreated : Date ,
    owner : {
        type : mongoose.Schema.objectId,
        ref : "User"
    },
    challenges : [{
        type :mongoose.Schema.objectId,
        ref : "Challenge"
    }],
    details : {
        tagline : String,
        description :String,
        prizes : String
    },
    startTime : Date,
    endTime : Date
});

module.exports = mongoose.model("Contest",contestSchema);
