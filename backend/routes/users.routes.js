const express = require('express');
const router = express.Router();
var UserController = require('../controllers/user');
const md_auth = require('../middlewares/authenticated');
const multipart = require('connect-multiparty');

var md_upload = multipart({ uploadDir: 'uploads/users' }); //ruta donde se guardan las imagenes


router.post('/register', UserController.saveUser); //registrar un usuario
router.post('/login', UserController.loginUser); //loguearse con un usuario
router.post('/upload-image/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage); //subir imagen de usuario
router.put('/user/:id', md_auth.ensureAuth, UserController.updateUser); //Editar un usuario
router.get('/get-image/:imageFile', UserController.getImageFile); //obtener imagen del ususario

module.exports = router;