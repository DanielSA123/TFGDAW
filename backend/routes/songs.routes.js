const express = require('express');
const router = express.Router();
const SongController = require('../controllers/song');
const md_auth = require('../middlewares/authenticated');
const multipart = require('connect-multiparty');

var md_upload = multipart({ uploadDir: 'backend/uploads/songs' });

router.get('/:album?', md_auth.ensureAuth, SongController.getSongs); //ver todas/ canciones de un album

router.post('/', md_auth.ensureAuth, SongController.saveSong); //crear cancion
router.get('/song/:id', md_auth.ensureAuth, SongController.getSong); //ver cancion
router.put('/song/:id', md_auth.ensureAuth, SongController.updateSong); //editar cancion
router.delete('/song/:id', md_auth.ensureAuth, SongController.deleteSong); //borrar cancion

router.post('/upload-file/:id', [md_auth.ensureAuth, md_upload], SongController.uploadFile); //subir audio de cancion
router.get('/get-song/:songFile', SongController.getSongFile); //ver audio de cancion

module.exports = router;