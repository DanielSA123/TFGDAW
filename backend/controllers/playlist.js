const Artist = require('../models/artist');
const Album = require('../models/album');
const Song = require('../models/song');
const Playlist = require('../models/playlist');
const mongoosePaginate = require('mongoose-pagination');
const fs = require('fs');
const path = require('path');

/**
 * Funcion para obtener una lista de la base de datos
 * 
 * @param {*} req 
 * @param {*} res 
 */
function getPlaylist(req, res) {
    var playlistId = req.params.id;
    Playlist.findById(playlistId).populate({ path: 'songs' }).exec((err, playlist) => {
        if (err) {
            res.status(500).send({ messsage: 'Error en la peticion' });
        } else {
            if (!playlist) {
                res.status(404).send({ messsage: 'No existe la lista' });
            } else {
                res.status(200).send({ playlist });
            }
        }
    })
}

/**
 * Funcion para obtener todas las listas de un usuario de la base de datos
 * 
 * @param {*} req 
 * @param {*} res 
 */
function getPlaylsits(req, res) {
    var userId = req.params.user;
    Playlist.find({ user: userId }).sort('name').exec((err, playlist) => {
        if (err) {
            res.status(500).send({ messsage: 'Error en la peticion' });
        } else {
            if (!playlist) {
                res.status(404).send({ messsage: 'No existe la lista' });
            } else {
                res.status(200).send({ playlist });
            }
        }
    })
}

/**
 * Función para guardar una lista en la base de datos
 * 
 * @param {*} req 
 * @param {*} res 
 */
function savePlaylist(req, res) {
    var playlist = new Playlist();
    var params = req.body;

    playlist.name = params.name;
    playlist.image = 'null';
    playlist.user = params.user;
    playlist.songs = [];

    playlist.save((err, playlistStored) => {
        if (err) {
            res.status(500).send({ messsage: 'Error al guardar la lista' });
        } else {
            if (!playlistStored) {
                res.status(404).send({ messsage: 'No se ha guardado la lista' });
            } else {
                res.status(200).send({ playlist: playlistStored });
            }
        }
    });
}

/**
 * Funcion para actualizar una lista
 * 
 * @param {*} req 
 * @param {*} res 
 */
function updatePlaylist(req, res) {
    var playlistId = req.params.id;
    var update = req.body;

    Playlist.findByIdAndUpdate(playlistId, update, (err, playlistUpdated) => {
        if (err) {
            res.status(500).send({ message: "Error en la peticion" });
        } else {
            if (!playlistUpdated) {
                res.status(404).send({ message: "No existe la lista" });
            } else {
                res.status(200).send({ playlist: playlistUpdated });
            }
        }
    })
}

/**
 * Función para eliminar una lista de la base de datos
 * 
 * @param {*} req 
 * @param {*} res 
 */
function deletePlaylist(req, res) {
    var playlistId = req.params.id;
    Playlist.findByIdAndRemove(playlistId, (err, playlistRemoved) => {
        if (err) {
            res.status(500).send({ messsage: 'Error en la peticion' });
        } else {
            if (!playlistRemoved) {
                res.status(404).send({ messsage: 'No se ha eliminado la lista' });
            } else {
                if (playlistRemoved.image && playlistRemoved.image != 'null') {
                    fs.rm('./uploads/playlist/' + playlistRemoved.image, (err) => {
                        console.log(err);
                    });
                }
                res.status(200).send({ playlist: playlistRemoved });

            }
        }
    })
}

/**
 * Funcion para añadir una cancion a una lista si no la tiene
 * 
 * @param {*} req 
 * @param {*} res 
 */
function appendSong(req, res) {
    var playlistId = req.params.id
    var song = req.body.song;
    Playlist.findByIdAndUpdate(playlistId, { $addToSet: { songs: song } }, (err, playlistUpdated) => {
        if (err) {
            res.status(500).send({ message: "Error en la peticion" });
        } else {
            if (!playlistUpdated) {
                res.status(404).send({ message: "No existe la lista" });
            } else {
                res.status(200).send({ playlist: playlistUpdated });
            }
        }
    });
}

/**
 * Funcion para borrar una cancion de una lista
 * 
 * @param {*} req 
 * @param {*} res 
 */
function removeSong(req, res) {
    var playlistId = req.params.id
    var song = req.body.song;
    Playlist.findByIdAndUpdate(playlistId, { $pull: { songs: song } }, (err, playlistUpdated) => {
        if (err) {
            res.status(500).send({ message: "Error en la peticion" });
        } else {
            if (!playlistUpdated) {
                res.status(404).send({ message: "No existe la lista" });
            } else {
                res.status(200).send({ playlist: playlistUpdated });
            }
        }
    });
}

/**
 * Funcion para subir una imagen  de una lista
 * 
 * @param {*} req 
 * @param {*} res 
 */
function uploadImage(req, res) {
    var playlistId = req.params.id;
    var filename = "No subido";
    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_split = file_name.split('.');
        var file_ext = ext_split[1];


        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
            Playlist.findByIdAndUpdate(playlistId, { image: file_name }, (err, artistUpdated) => {
                if (err) {
                    res.status(500).send({ message: "Error al actualizar la lista" })
                } else {
                    if (!artistUpdated) {
                        res.status(404).send({ message: "No se ha podido actualizar la lista" })
                    } else {
                        if (artistUpdated.image && artistUpdated.image != 'null') {
                            fs.rm('./uploads/playlist/' + artistUpdated.image, (err) => {
                                console.log(err);
                            });
                        }
                        res.status(200).send({ artist: artistUpdated })
                    }
                }
            });
        } else {
            res.status(200).send({ message: 'Extension del archivo no valida' })
        }

    } else {
        res.status(200).send({ message: 'No has subido ninguna imagen' })

    }
}

/**
 * Funcion para obtener la imagen de una lista
 * 
 * @param {*} req 
 * @param {*} res 
 */
function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var path_file = './uploads/playlist/' + imageFile;

    fs.exists(path_file, function(exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(404).send({ message: 'No existe la imagen' })
        }
    })
}

module.exports = {
    getPlaylist,
    getPlaylsits,
    savePlaylist,
    updatePlaylist,
    deletePlaylist,
    appendSong,
    removeSong,
    uploadImage,
    getImageFile,
}