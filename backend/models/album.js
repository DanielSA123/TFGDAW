const mongoose = require('mongoose');
const { Schema } = mongoose;

var AlbumSchema = new Schema({
    title: String,
    description: String,
    year: Number,
    image: String,
    artist: { type: Schema.ObjectId, ref: 'Artist' }
})

module.exports = mongoose.model('Album', AlbumSchema);