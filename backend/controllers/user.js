const User = require('../models/user');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const fs = require('fs');
const path = require('path');

function pruebas(req, res) {
    res.status(200).send({ message: 'probando una accion del controlador de usuarios del api rest de node y mongo' })
}

/**
 * Función para registrar un usuario
 * 
 * @param {*} req 
 * @param {*} res 
 */
function saveUser(req, res) {
    var user = new User();

    var params = req.body;

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = "ROLE_USER";
    user.image = "null";
    user.artistId = 'null';

    if (params.password) {
        //encriptar y guardar
        bcrypt.hash(params.password, null, null, function(err, hash) {
            user.password = hash;
            if (user.name != null && user.surname != null && user.email != null) {
                //guardar el usuario si estan todos los datos
                user.save((err, userStored) => {
                    if (err) {
                        res.status(500).send({ message: 'Error al guardar el usuario' });
                    } else {
                        if (!userStored) {
                            res.status(404).send({ message: 'No se ha registrado el usuario' });
                        } else {
                            res.status(200).send({ user: userStored });
                        }
                    }
                })
            } else {
                res.status(200).send({ message: 'Introduce todos los campos' });
            }
        })
    } else {
        res.status(200).send({ message: 'Introduce la contraseña' });
    }
}

/**
 * Función para loguear un usuario
 * 
 * @param {*} req 
 * @param {*} res 
 */
function loginUser(req, res) {
    var params = req.body;
    var email = params.email;
    var password = params.password;
    User.findOne({ email: email.toLowerCase() }, (err, user) => {
        if (err) {
            res.status(500).send({ message: "Error en la peticion" })
        } else {
            if (!user) {
                res.status(404).send({ message: "El usuario no exite" })
            } else {
                //comprobar contraseña
                bcrypt.compare(password, user.password, (err, check) => {
                    if (check) {
                        //devolver los datos del usuario logueado
                        if (params.gethash) {
                            // devolver token del usuario
                            res.status(200).send({ token: jwt.createToken(user) });
                        } else {
                            res.status(200).send({ user })
                        }
                    } else {
                        res.status(404).send({ message: "El usuario no ha podido loguearse" })
                    }
                })
            }
        }
    })
}

/**
 * Función para actualizar los datos de un usuario
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;

    if (userId != req.user.sub) {
        return res.status(500).send({ message: "No tienes permiso para actualizar este usuario" });
    }
    User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
        if (err) {
            res.status(500).send({ message: "Error al actualizar el usuario" })
        } else {
            if (!userUpdated) {
                res.status(404).send({ message: "No se ha podido actualizar el usuario" })
            } else {
                res.status(200).send({ user: userUpdated })
            }
        }
    });

}

/**
 * Función para subir una imagen a un usuario
 * 
 * @param {*} req 
 * @param {*} res 
 */
function uploadImage(req, res) {
    var userId = req.params.id;
    var filename = "No subido";
    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_split = file_name.split('.');
        var file_ext = ext_split[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
            User.findByIdAndUpdate(userId, { image: file_name }, (err, userUpdated) => {
                if (err) {
                    res.status(500).send({ message: "Error al actualizar el usuario" })
                } else {
                    if (!userUpdated) {
                        res.status(404).send({ message: "No se ha podido actualizar el usuario" })
                    } else {
                        if (userUpdated.image && userUpdated.image != 'null') {
                            fs.rm('./uploads/users/' + userUpdated.image, (err) => {
                                console.log(err);
                            });
                        }
                        res.status(200).send({
                            user: userUpdated,
                            image: file_name
                        })
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
 * Funcion para obtener la imagen de un usuario
 * 
 * @param {*} req 
 * @param {*} res 
 */
function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var path_file = './uploads/users/' + imageFile;

    fs.exists(path_file, function(exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(404).send({ message: 'No existe la imagen' })
        }
    })
}

module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile,
};