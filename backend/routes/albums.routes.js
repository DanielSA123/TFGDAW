const express = require('express');
const router = express.Router();
const AlbumController = require('../controllers/album');
const md_auth = require('../middlewares/authenticated');
const multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: 'uploads/artists' });


router.get('/:artist?', md_auth.ensureAuth, AlbumController.getAlbums); //ver todos los albums/ ver los albums de un artista

router.post('/', md_auth.ensureAuth, AlbumController.saveAlbum); //crear album
router.get('/album/:id', md_auth.ensureAuth, AlbumController.getAlbum); //ver album
router.put('/album/:id', md_auth.ensureAuth, AlbumController.updateAlbum); //editar album
router.delete('/album/:id', md_auth.ensureAuth, AlbumController.deleteAlbum); //borrar album

router.post('/upload-image/:id', [md_auth.ensureAuth, md_upload], AlbumController.uploadImage); //subir imagen de album
router.get('/get-image/:imageFile', AlbumController.getImageFile); //ver imagen de album


module.exports = router;