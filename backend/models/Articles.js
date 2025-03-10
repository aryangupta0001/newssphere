const mongoose = require("mongoose");
const { schema } = require("./User");

const ArticleSchema = new schema({
    title : {
        type : String,
        required : true
    },
    
    url : {
        type : String,
        required : true
    },

    excerpt : {
        type : String
    },

    thumbnail : {
        type : String
    },

    date : {
        type : String
    },

    authors : {
        type : String
    },

    publisher : {
        type : String
    }
    
})


module.exports = mongoose.model("article", ArticleSchema)