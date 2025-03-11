const mongoose = require("mongoose");
const mongoURI = "mongodb://localhost:27017/newssphere";

const connectToMongo = () => {
    mongoose.connect(mongoURI)
        .then(
            () => {
                console.log("Connected to mongo successfully");
            }
        )
        .catch(
            err => console.log(err)
        );
}

module.exports = connectToMongo;