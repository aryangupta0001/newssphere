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

    content: {
        type: String
    },

    photo_url: {
        type: String
    },

    photo_data: {
        type: Buffer
    },

    thumbnail_url: {
        type: String
    },

    thumbnail_data: {
        type: Buffer
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

    bert_embedding: {
        type: [Number]
    },

    category: {
        type: String,
        default: "GENERAL"
    }

})


module.exports = mongoose.model("article", ArticleSchema)