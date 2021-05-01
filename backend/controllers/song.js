const Artist = require('../models/artist');
const Album = require('../models/album');
const Song = require('../models/song');
const mongoosePaginate = require('mongoose-pagination');
const fs = require('fs');
const mp3Dur = require('mp3-duration');
const path = require('path');

/**
 * Función para obtener una cancion de la base de datos
 * 
 * @param {*} req 
 * @param {*} res 
 */
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

/**
 * Función para obtener todas las canciones de la base de datos
 * si se le pasa un albun obtiene las canciones de ese album
 * 
 * @param {*} req 
 * @param {*} res 
 */
function getSongs(req, res) {
    var albumId = req.params.album;

    if (!albumId) {
        Song.find({}).sort('name').populate({ path: 'album', populate: { path: 'artist' } }).exec((err, songs) => {
            if (err) {
                res.status(500).send({ messsage: 'Error en la peticion' });
            } else {
                if (!songs) {
                    res.status(404).send({ messsage: 'No hay canciones' });
                } else {
                    return res.status(200).send({ songs });
                }
            }
        });
    } else {
        if (albumId.includes('page=')) {
            let dat = albumId.split('=')
            let page = dat[1];
            Song.find().sort('name').populate({ path: 'album', populate: { path: 'artist' } }).paginate(page, 8, (err, songs, total) => {
                if (err) {
                    res.status(500).send({ messsage: 'Error en la peticion' });
                } else {
                    if (!songs) {
                        res.status(404).send({ messsage: 'No hay canciones' });
                    } else {
                        return res.status(200).send({
                            total_items: total,
                            songs: songs
                        });
                    }
                }
            });
        } else {
            Song.find({ album: albumId }).sort('number').populate({ path: 'album', populate: { path: 'artist' } }).exec((err, songs) => {
                if (err) {
                    res.status(500).send({ messsage: 'Error en la peticion' });
                } else {
                    if (!songs) {
                        res.status(404).send({ messsage: 'No hay canciones' });
                    } else {
                        return res.status(200).send({ songs });
                    }
                }
            });
        }
    }

}

function searchSong(req, res) {
    var songName = req.params.name;
    Song.find({ name: { "$regex": songName, "$options": 'i' } }).sort('name').populate({ path: 'album', populate: { path: 'artist' } }).exec((err, songs) => {
        if (err) {
            res.status(500).send({ messsage: 'Error en la peticion' });
        } else {
            if (!songs) {
                res.status(404).send({ messsage: 'No hay canciones con el nombre ' + songName });
            } else {
                return res.status(200).send({ songs });
            }
        }
    });
}

/**
 * Función para guardar una canción en la base de datos
 * 
 * @param {*} req 
 * @param {*} res 
 */
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
            res.status(500).send({ messsage: 'Error al guardar la canción' });
        } else {
            if (!songStored) {
                res.status(404).send({ messsage: 'No se ha guardado la canción' });
            } else {
                res.status(200).send({ song: songStored });
            }
        }
    });
}

/**
 * Función para actualizar una canción
 * 
 * @param {*} req 
 * @param {*} res 
 */
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

/**
 * Función para eliminar una canción de la base de datos
 * 
 * @param {*} req 
 * @param {*} res 
 */
function deleteSong(req, res) {
    var songId = req.params.id;
    Song.findByIdAndRemove(songId, (err, songRemoved) => {
        if (err) {
            res.status(500).send({ messsage: 'Error en la peticion' });
        } else {
            if (!songRemoved) {
                res.status(404).send({ messsage: 'No se ha eliminado la cancion' });
            } else {
                if (songRemoved.file && songRemoved.file != 'null') {
                    fs.rm('./uploads/songs/' + songRemoved.file, (err) => {
                        console.log(err);
                    });
                }
                res.status(200).send({ song: songRemoved });

            }
        }
    })
}

/**
 * Función para subir un fichero mp3 a una canción
 * 
 * @param {*} req 
 * @param {*} res 
 */
function uploadFile(req, res) {
    var songId = req.params.id;
    var filename = "No subido";
    if (req.files) {
        var file_path = req.files.file.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_split = file_name.split('.');
        var file_ext = ext_split[1];
        let file_duration = '0';
        mp3Dur('./uploads/songs/' + file_name, function(err, duration) {
            if (err) return console.log(err.message);
            file_duration = Math.floor(duration / 60) + ':' + Math.floor(duration % 60);
            if (file_ext == 'mp3') {
                Song.findByIdAndUpdate(songId, { duration: file_duration, file: file_name }, (err, songUpdated) => {
                    if (err) {
                        res.status(500).send({ message: "Error al actualizar la cancion" })
                    } else {
                        if (!songUpdated) {
                            res.status(404).send({ message: "No se ha podido actualizar la cancion" })
                        } else {
                            if (songUpdated.file && songUpdated.file != 'null') {
                                fs.rm('./uploads/songs/' + songUpdated.file, (err) => {
                                    console.log(err);
                                });
                            }
                            res.status(200).send({ song: songUpdated })
                        }
                    }
                });
            } else {
                res.status(200).send({ message: 'Extension del archivo no valida' })
            }
        });
    } else {
        res.status(200).send({ message: 'No has subido ningun audio' })

    }
}

/**
 * Función para obtener el fichero de aucio de una canción
 * 
 * @param {*} req 
 * @param {*} res 
 */
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
    searchSong,
}