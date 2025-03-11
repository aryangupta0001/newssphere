const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
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
                    required: true
                },

                count: {
                    type: Number,
                    default: 1
                }
            }
        ],
        default: [
            {
                name: "General",
                count: 1
            }
        ]
    },
    
    totalCategoryCount: {
        type: Number,
        default: 1
    }
})

const User = mongoose.model('user', UserSchema);
module.exports = User;
