const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    link: {
        type: String,
        required: true,
        unique: true
    },

    snippet: {
        type: String
    },

    photo_url: {
        type: String
    },


    thumbnail_url: {
        type: String
    },

    published_datetime_utc: {
        type: Date
    },

    authors: {
        type: [String],
        default: []
    },

    source_name: {
        type: String
    },

    keywords: {
        type: [String],
        default: []
    }

})


module.exports = mongoose.model("article", ArticleSchema)