var mongoose = require("mongoose");

var submissionSchema = mongoose.Schema({
    user : {
        type : mongoose.Schema.objectId,
        ref : "User"
    },
    challenge : {
        type : mongoose.Schema.objectId,
        ref : "Challenge"
    },
    testCases : [{
        type : Boolean,
        default : false
    }],
    code : String,
    language : String,
    timeSubmitted : Date,
    score : Number
});

module.exports = mongoose.model("Submission",submissionSchema);
