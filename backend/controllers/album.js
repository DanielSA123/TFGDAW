const Artist = require('../models/artist');
const Album = require('../models/album');
const Song = require('../models/song');
const mongoosePaginate = require('mongoose-pagination');
const fs = require('fs');
const path = require('path');

function getAlbum(req, res) {
    res.status(200).send({ message: "done" });
}

module.exports = {
    getAlbum,
}