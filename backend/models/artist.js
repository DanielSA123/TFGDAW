const mongoose = require('mongoose');
const { Schema } = mongoose;

var ArtistSchema = new Schema({
    name: String,
    description: String,
    image: String
})

module.exports = mongoose.model('Artist', ArtistSchema);