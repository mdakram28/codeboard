var mongoose = require("mongoose");

var challengeSchema = mongoose.Schema({
    title : {
        type : String,
        unique : true,
        uppercase : true,
        required : true,
        match : [/^[a-zA-Z0-9 \-]{5,40}$/,"Title can contain letters , numbers , space and hyphen . Length >=5 and <=20."]
    } ,
    dateCreated : {
        type : Date ,
        required : true
    },
    contest : {
        type : mongoose.Schema.ObjectId,
        ref : "Contest",
        required : true
    },
    difficulty :{
        type :String,
        enum : ["easy", "medium" ,"difficult","advanced","expert"],
        required : true
    },
    score : {
        type : String ,
        required : true
    },
    description : String,
    problemStatement : String,
    inputFormat : String,
    constraints :String,
    outputFormat :String,
    sampleInput :String,
    sampleOutput :String,

    testcases : [{
        score : Number,
        input : String,
        output : String
    }],
    languages : [{
        type :String,
        enum : ["cpp","java","python","node"]    //languages
    }]

});


challengeSchema.statics.getAllContestChallenges = function(contestId,callback){
    Challenge.find({contest : contestId},callback);
}
var Challenge = mongoose.model("Challenge",challengeSchema);

module.exports = Challenge;
