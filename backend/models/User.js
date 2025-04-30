const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']

    },

    password: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    },

    bertEmbeddings: {
        type: [Number],
        // default: []
    },


    history: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
    }]
});

const User = mongoose.model('user', UserSchema);
module.exports = User;
