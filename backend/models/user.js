const mongoose = require('mongoose');
const { Schema } = mongoose;

var UserSchema = new Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    role: String,
    image: String,
    artistId: String
})

module.exports = mongoose.model('User', UserSchema);