var mongoose = require("mongoose");

var challengeSchema = mongoose.Schema({
    title : {
        type : String,
        unique : true
    } ,
    dateCreated : Date,
    contest : {
        type : mongoose.Schema.objectId,
        ref : "Contest"
    },
    difficulty :{
        type :String,
        enum : ["easy", "medium" ,"difficult","advanced","expert"]
    },
    score : String,
    description : String,
    problemStatement : String,
    inputFormat : String,
    constraints :String,
    outputFormat :String,
    sampleInput :String,
    sampleOutput :String,

    testCases : [{
        strength : Number,
        isSample : Boolean,
        input : String,
        output : String
    }],
    languages : {
        type :String,
        enum : ["c"]    //languages
    }

});

module.exports = mongoose.model("Challenge",challengeSchema);
