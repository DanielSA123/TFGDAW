const Artist = require('../models/artist');
const Album = require('../models/album');
const Song = require('../models/song');
const mongoosePaginate = require('mongoose-pagination');
const fs = require('fs');
const path = require('path');

/**
 * Funcion para obtener una artista de la base de datos
 * 
 * @param {*} req 
 * @param {*} res 
 */
function getArtist(req, res) {
    var artistId = req.params.id;
    Artist.findById(artistId, (err, artist) => {
        if (err) {
            res.status(500).send({ messsage: 'Error en la peticion' });
        } else {
            if (!artist) {
                res.status(404).send({ messsage: 'No existe el artista' });
            } else {
                res.status(200).send({ artist });
            }
        }
    })
}

/**
 * Funcion para obtener todos los artistas de la base de datos paginados
 * 
 * @param {*} req 
 * @param {*} res 
 */
function getArtists(req, res) {
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }
    var itemsPerPage = 8;

    Artist.find().sort('name').paginate(page, itemsPerPage, (err, artists, total) => {
        if (err) {
            res.status(500).send({ messsage: 'Error en la peticion' });
        } else {
            if (!artists) {
                res.status(404).send({ messsage: 'No hay artistas' });
            } else {
                return res.status(200).send({
                    total_items: total,
                    artists: artists
                });
            }
        }
    })
}


/**
 * Funcion para guardar una artista en la base de datos
 * 
 * @param {*} req 
 * @param {*} res 
 */
function saveArtist(req, res) {
    var artist = new Artist();
    var params = req.body;
    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.save((err, artistStored) => {
        if (err) {
            res.status(500).send({ messsage: 'Error al guardar el artista' });
        } else {
            if (!artistStored) {
                res.status(404).send({ messsage: 'No se ha guardado el artista' });
            } else {
                res.status(200).send({ artist: artistStored });
            }
        }
    })
}

/**
 * Funcion para actualizar un artista en la base de datos
 * 
 * @param {*} req 
 * @param {*} res 
 */
function updateArtist(req, res) {
    var artistId = req.params.id;
    var update = req.body;

    Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
        if (err) {
            res.status(500).send({ messsage: 'Error en la peticion' });
        } else {
            if (!artistUpdated) {
                res.status(404).send({ messsage: 'No se ha actualizado el artista' });
            } else {
                res.status(200).send({ artist: artistUpdated });
            }
        }
    });
}

/**
 * Funcion para borrar un artista de la base de datos
 * 
 * @param {*} req 
 * @param {*} res 
 */
function deleteArtist(req, res) {
    var artistId = req.params.id;
    Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
        if (err) {
            res.status(500).send({ messsage: 'Error en la peticion' });
        } else {
            if (!artistRemoved) {
                res.status(404).send({ messsage: 'No se ha eliminado el artista' });
            } else {
                Album.find({ artist: artistRemoved._id }).remove((err, albumRemoved) => {
                    if (err) {
                        res.status(500).send({ messsage: 'Error en la peticion' });
                    } else {
                        if (!albumRemoved) {
                            res.status(404).send({ messsage: 'No se ha eliminado el album' });
                        } else {
                            Song.find({ album: albumRemoved._id }).remove((err, songRemoved) => {
                                if (err) {
                                    res.status(500).send({ messsage: 'Error en la peticion' });
                                } else {
                                    if (!songRemoved) {
                                        res.status(404).send({ messsage: 'No se ha eliminado la cancion' });
                                    } else {
                                        if (artistRemoved.image && artistRemoved.image != 'null') {
                                            fs.rm('./uploads/artists/' + artistRemoved.image, (err) => {
                                                console.log(err);
                                            });
                                        }
                                        if (albumRemoved.image && albumRemoved.image != 'null') {
                                            fs.rm('./uploads/albums/' + albumRemoved.image, (err) => {
                                                console.log(err);
                                            });
                                        }
                                        if (songRemoved.file && songRemoved.file != 'null') {
                                            fs.rm('./uploads/songs/' + songRemoved.file, (err) => {
                                                console.log(err);
                                            });
                                        }
                                        res.status(200).send({ artist: artistRemoved });
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });
}

/**
 * Funcion para subir una imagen  de un artista
 * 
 * @param {*} req 
 * @param {*} res 
 */
function uploadImage(req, res) {
    var artistId = req.params.id;
    var filename = "No subido";
    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_split = file_name.split('.');
        var file_ext = ext_split[1];


        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
            Artist.findByIdAndUpdate(artistId, { image: file_name }, (err, artistUpdated) => {
                if (err) {
                    res.status(500).send({ message: "Error al actualizar el artista" })
                } else {
                    if (!artistUpdated) {
                        res.status(404).send({ message: "No se ha podido actualizar el artista" })
                    } else {
                        if (artistUpdated.image && artistUpdated.image != 'null') {
                            fs.rm('./uploads/artists/' + artistUpdated.image, (err) => {
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
 * Funcion para obtener la imagen de un artista
 * 
 * @param {*} req 
 * @param {*} res 
 */
function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var path_file = './uploads/artists/' + imageFile;

    fs.exists(path_file, function(exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(404).send({ message: 'No existe la imagen' })
        }
    })
}

module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile,
}