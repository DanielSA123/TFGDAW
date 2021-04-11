const Artist = require('../models/artist');
const Album = require('../models/album');
const Song = require('../models/song');
const mongoosePaginate = require('mongoose-pagination');
const fs = require('fs');
const path = require('path');
const album = require('../models/album');

/**
 * Envia el album con el id que se pasa en los paramertos del request de html
 * 
 * @param {*} req 
 * @param {*} res 
 */
function getAlbum(req, res) {
    var albumId = req.params.id;

    Album.findById(albumId).populate({ path: 'artist' }).exec((err, album) => {
        if (err) {
            res.status(500).send({ message: "Error en la peticion" });
        } else {
            if (!album) {
                res.status(404).send({ message: "No existe el album" });
            } else {
                res.status(200).send({ album });
            }
        }
    });

}
/**
 * Guarda en la base de datos los datos del album que recibe el request de html
 * 
 * @param {*} req 
 * @param {*} res 
 */
function saveAlbum(req, res) {
    var album = new Album();
    var params = req.body;

    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;

    album.save((err, albumStored) => {
        if (err) {
            res.status(500).send({ message: "Error en la peticion" });
        } else {
            if (!albumStored) {
                res.status(404).send({ message: "No se ha guardado el album" });
            } else {
                res.status(200).send({ album: albumStored });
            }
        }
    });
}

/**
 * Envia los albums del artista que se pasa en los paramertos del request de html
 * En caso de que no se le pase un artista devuelve todos los albums de la base de datos
 * 
 * @param {*} req 
 * @param {*} res 
 */
function getAlbums(req, res) {
    var artistId = req.params.artist;
    if (!artistId) {
        //mostrar todos los albums
        var find = Album.find({}).sort('title').populate({ path: 'artist' }).exec((err, albums) => {
            if (err) {
                res.status(500).send({ message: "Error en la peticion" });
            } else {
                if (!albums) {
                    res.status(404).send({ message: "No hay albums" });
                } else {
                    res.status(200).send({ albums });
                }
            }
        });;
    } else {
        if (artistId.includes('page=')) {
            let dat = artistId.split('=')
            let page = dat[1];
            Album.find().sort('name').paginate(page, 8, (err, albums, total) => {
                if (err) {
                    res.status(500).send({ messsage: 'Error en la peticion' });
                } else {
                    if (!albums) {
                        res.status(404).send({ messsage: 'No hay albums' });
                    } else {
                        return res.status(200).send({
                            total_items: total,
                            albums: albums
                        });
                    }
                }
            });
        } else {
            //mostrar los albums de un artista
            var find = Album.find({ artist: artistId }).sort('year').populate({ path: 'artist' }).exec((err, albums) => {
                if (err) {
                    res.status(500).send({ message: "Error en la peticion" });
                } else {
                    if (!albums) {
                        res.status(404).send({ message: "No hay albums" });
                    } else {
                        res.status(200).send({ albums });
                    }
                }
            });
        }
    }
}


/**
 * Funcion para actualizar un album
 * 
 * @param {*} req 
 * @param {*} res 
 */
function updateAlbum(req, res) {
    var albumId = req.params.id;
    var update = req.body;

    Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
        if (err) {
            res.status(500).send({ message: "Error en la peticion" });
        } else {
            if (!albumUpdated) {
                res.status(404).send({ message: "No existe el album" });
            } else {
                res.status(200).send({ album: albumUpdated });
            }
        }
    })
}

/**
 * Funcion para eliminar un album del la base de datos
 * 
 * @param {*} req 
 * @param {*} res 
 */
function deleteAlbum(req, res) {
    var albumId = req.params.id;
    Album.findByIdAndRemove(albumId, (err, albumRemoved) => {
        if (err) {
            res.status(500).send({ messsage: 'Error en la peticion' });
        } else {
            if (!albumRemoved) {
                res.status(404).send({ messsage: 'No se ha eliminado el album' });
            } else {
                Song.find({ album: albumRemoved._id })
                    .remove((err, songRemoved) => {
                        if (err) {
                            res.status(500).send({ messsage: 'Error en la peticion' });
                        } else {
                            if (!songRemoved) {
                                res.status(404).send({ messsage: 'No se ha eliminado la cancion' });
                            } else {
                                console.log(songRemoved);
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
                                res.status(200).send({ album: albumRemoved });
                            }
                        }
                    });
            }
        }
    });
}

/**
 * Funcion para subir una imagen a un album
 * 
 * @param {*} req 
 * @param {*} res 
 */
function uploadImage(req, res) {
    var albumId = req.params.id;
    var filename = "No subido";
    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_split = file_name.split('.');
        var file_ext = ext_split[1];


        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
            Album.findByIdAndUpdate(albumId, { image: file_name }, (err, albumUpdated) => {
                if (err) {
                    res.status(500).send({ message: "Error al actualizar el album" })
                } else {
                    if (!albumUpdated) {
                        res.status(404).send({ message: "No se ha podido actualizar el album" })
                    } else {
                        if (albumUpdated.image && albumUpdated.image != 'null') {
                            fs.rm('./uploads/albums/' + albumUpdated.image, (err) => {
                                console.log(err);
                            });
                        }
                        res.status(200).send({ album: albumUpdated })
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
 * Funcion que devuelve la imagen de un album
 * 
 * @param {*} req 
 * @param {*} res 
 */
function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var path_file = './uploads/albums/' + imageFile;

    fs.exists(path_file, function(exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(404).send({ message: 'No existe la imagen' })
        }
    })
}

module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile,
}