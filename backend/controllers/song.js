const Artist = require('../models/artist');
const Album = require('../models/album');
const Song = require('../models/song');
const mongoosePaginate = require('mongoose-pagination');
const fs = require('fs');
const path = require('path');

function getSong(req, res) {
    var songId = req.params.id;
    Song.findById(songId).populate({ path: 'album', populate: { path: 'artist' } }).exec((err, song) => {
        if (err) {
            res.status(500).send({ messsage: 'Error en la peticion' });
        } else {
            if (!song) {
                res.status(404).send({ messsage: 'No existe la cancion' });
            } else {
                res.status(200).send({ song });
            }
        }
    })
}

function getSongs(req, res) {
    var albumId = req.params.album;

    if (!albumId) {
        var find = Song.find({}).sort('name');
    } else {
        var find = Song.find({ album: albumId }).sort('number');
    }
    find.populate({ path: 'album', populate: { path: 'artist' } }).exec((err, songs) => {
        if (err) {
            res.status(500).send({ messsage: 'Error en la peticion' });
        } else {
            if (!songs) {
                res.status(404).send({ messsage: 'No hay canciones' });
            } else {
                res.status(200).send({ songs });
            }
        }
    })

}

function saveSong(req, res) {
    var song = new Song();
    var params = req.body;

    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = 'null';
    song.album = params.album;

    song.save((err, songStored) => {
        if (err) {
            res.status(500).send({ messsage: 'Error al guardar la cancion' });
        } else {
            if (!songStored) {
                res.status(404).send({ messsage: 'No se ha guardado la cancion' });
            } else {
                res.status(200).send({ song: songStored });
            }
        }
    });
}

function updateSong(req, res) {
    var songId = req.params.id;
    var update = req.body;

    Song.findByIdAndUpdate(songId, update, (err, songUpdated) => {
        if (err) {
            res.status(500).send({ messsage: 'Error en la peticion' });
        } else {
            if (!songUpdated) {
                res.status(404).send({ messsage: 'No se ha actualizado la cancion' });
            } else {
                res.status(200).send({ song: songUpdated });
            }
        }
    })
}

function deleteSong(req, res) {
    var songId = req.params.id;
    Song.findByIdAndRemove(songId, (err, songRemoved) => {
        if (err) {
            res.status(500).send({ messsage: 'Error en la peticion' });
        } else {
            if (!songRemoved) {
                res.status(404).send({ messsage: 'No se ha eliminado la cancion' });
            } else {
                res.status(200).send({ song: songRemoved });
            }
        }
    })
}

function uploadFile(req, res) {
    var songId = req.params.id;
    var filename = "No subido";
    if (req.files) {
        var file_path = req.files.file.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_split = file_name.split('.');
        var file_ext = ext_split[1];


        if (file_ext == 'mp3') {
            Song.findByIdAndUpdate(songId, { file: file_name }, (err, songUpdated) => {
                if (err) {
                    res.status(500).send({ message: "Error al actualizar la cancion" })
                } else {
                    if (!songUpdated) {
                        res.status(404).send({ message: "No se ha podido actualizar la cancion" })
                    } else {
                        res.status(200).send({ song: songUpdated })
                    }
                }
            });
        } else {
            res.status(200).send({ message: 'Extension del archivo no valida' })
        }

    } else {
        res.status(200).send({ message: 'No has subido ningun audio' })

    }
}

function getSongFile(req, res) {
    var songFile = req.params.songFile;
    var path_file = './uploads/songs/' + songFile;

    fs.exists(path_file, function(exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(404).send({ message: 'No existe la cancion' })
        }
    })
}

module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile,
}