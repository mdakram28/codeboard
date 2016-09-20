var mongoose = require("mongoose");

var submissionSchema = mongoose.Schema({
    user : {
        type : mongoose.Schema.ObjectId,
        ref : "User"
    },
    challenge : {
        type : mongoose.Schema.ObjectId,
        ref : "Challenge"
    },
    testcases : [{
    }],
    code : String,
    language : String,
    timeSubmitted : Date,
    score : Number
});

module.exports = mongoose.model("Submission",submissionSchema);
