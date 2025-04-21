const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
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

    category: {
        type: [
            {
                name: {
                    type: String,
                    required: true,
                    enum: [
                        "WORLD", "NATIONAL", "BUSINESS", "TECHNOLOGY",
                        "ENTERTAINMENT", "SPORTS", "SCIENCE", "HEALTH", "GENERAL"
                    ]
                },

                count: {
                    type: Number,
                    default: 1
                }
            }
        ],
        default: [
            { name: "WORLD", count: 1 },
            { name: "NATIONAL", count: 1 },
            { name: "BUSINESS", count: 1 },
            { name: "TECHNOLOGY", count: 1 },
            { name: "ENTERTAINMENT", count: 1 },
            { name: "SPORTS", count: 1 },
            { name: "SCIENCE", count: 1 },
            { name: "HEALTH", count: 1 },
            { name: "GENERAL", count: 1 }
        ]
    },

    totalCategoryCount: {
        type: Number,
        default: 9
    },


    history : {
        
    }
})

const User = mongoose.model('user', UserSchema);
module.exports = User;
