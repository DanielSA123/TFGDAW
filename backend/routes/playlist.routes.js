const express = require('express');
const router = express.Router();
const PlaylistController = require('../controllers/playlist');
const md_auth = require('../middlewares/authenticated');
const multipart = require('connect-multiparty');

var md_upload = multipart({ uploadDir: 'uploads/playlist' }); //ruta donde se guardan las imagenes

router.get('/:user', md_auth.ensureAuth, PlaylistController.getPlaylsits); //ver todas las listas de un usuario

router.post('/', md_auth.ensureAuth, PlaylistController.savePlaylist); //crear Playlist
router.get('/playlist/:id', md_auth.ensureAuth, PlaylistController.getPlaylist); //ver Playlist
router.put('/playlist/:id', md_auth.ensureAuth, PlaylistController.updatePlaylist); //editar Playlist
router.put('/add-song/:id', md_auth.ensureAuth, PlaylistController.appendSong); //añadir cancion a Playlist
router.put('/remove-song/:id', md_auth.ensureAuth, PlaylistController.removeSong); //eliminar cancion de Playlist
router.delete('/playlist/:id', md_auth.ensureAuth, PlaylistController.deletePlaylist); //borrar Playlist


router.post('/upload-image/:id', [md_auth.ensureAuth, md_upload], PlaylistController.uploadImage); //subir imagen de artista
router.get('/get-image/:imageFile', PlaylistController.getImageFile); //ver imagen de artista


module.exports = router