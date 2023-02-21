const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    userName: String,
    email: String,
    password: String,
    address: String,
    phoneNumber: Number,
    gender: String,
    qualification: String,
    experience: String,
    userType: String
})

const User = new mongoose.model("User", userSchema);
module.exports = User;