const express = require('express');
const router = express.Router();
const ArtistController = require('../controllers/artists');
const md_auth = require('../middlewares/authenticated');
const multipart = require('connect-multiparty');

var md_upload = multipart({ uploadDir: 'backend/uploads/artists' });

router.get('/:page?', md_auth.ensureAuth, ArtistController.getArtists); //ver todos los artistas

router.post('/', md_auth.ensureAuth, ArtistController.saveArtist); //crear artista
router.get('/artist/:id', md_auth.ensureAuth, ArtistController.getArtist); //ver artista
router.put('/artist/:id', md_auth.ensureAuth, ArtistController.updateArtist); //editar artista
router.delete('/artist/:id', md_auth.ensureAuth, ArtistController.deleteArtist); //borrar artista

router.post('/upload-image/:id', [md_auth.ensureAuth, md_upload], ArtistController.uploadImage); //subir imagen de artista
router.get('/get-image/:imageFile', ArtistController.getImageFile); //ver imagen de artista


module.exports = router