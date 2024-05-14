const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://koushubhy2k:zBJCMApdTsaWO6Yv@paytm.kuks8oo.mongodb.net/");

//user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
});

// create model from schema
const User = mongoose.model("User", userSchema);

module.exports = {
    User
};