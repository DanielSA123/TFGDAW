const mongoose = require('mongoose');
const { Schema } = mongoose;

var PlaylistSchema = new Schema({
    name: String,
    image: String,
    user: { type: Schema.ObjectId, ref: 'User' },
    songs: [{ type: Schema.ObjectId, ref: 'Song' }]
})

module.exports = mongoose.model('Playlist', PlaylistSchema);