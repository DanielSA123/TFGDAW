const mongoose = require('mongoose');
const { Schema } = mongoose;

var AlbumSchema = new Schema({
    title: String,
    description: String,
    year: Number,
    image: String,
    artist: { type: Schema.ObjectId, ref: 'Artist' },
    license: String
})

module.exports = mongoose.model('Album', AlbumSchema);