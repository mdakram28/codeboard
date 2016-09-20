var mongoose = require("mongoose");
var moment = require('moment');

var contestSchema = mongoose.Schema({
    title : {
        type : String,
        unique : true,
        uppercase : true,
        required : true,
        match : [/^[a-zA-Z0-9 \-]{5,20}$/,"Title can contain letters , numbers , space and hyphen . Length >=5 and <=20."]
    },
    dateCreated : {
        type : Date ,
        required : true
    },
    owner : {
        type : mongoose.Schema.ObjectId,
        ref : "User",
        required : true
    },
    details : {
        tagline : String,
        description :String,
        prizes : String
    },
    startTime : Date,
    endTime : Date,
    image : {
        type : String,
        match : [/^([0-9a-b]{24}|default)\.(jpg|jpeg|png)$/i,"Invalid image name"],
        default : "default.jpg"
    }
});

contestSchema.statics.createNew = function(options,callback){
    var newContest = new Contest(options);
    newContest.save(callback);
}

contestSchema.statics.getLeanById = function(id,callback){
    Contest.findOne({_id:id}).lean().exec(function(err,contest){
        if(err)return callback(err);
        if(contest.startTime){
            contest.startDate = moment(contest.startTime).format("MM/DD/YYYY");
            contest.startTime = moment(contest.startTime).format("H:m");
        }
        if(contest.endTime){
            contest.endDate = moment(contest.endTime).format("MM/DD/YYYY");
            contest.endTime = moment(contest.endTime).format("H:m");
        }
        callback(err,contest);
    });
}
contestSchema.statics.getById = function(id,callback){
    Contest.findOne({_id:id}).exec(callback);
}

var Contest = mongoose.model("Contest",contestSchema);

module.exports = Contest;
