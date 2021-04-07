const express = require('express');
const router = express.Router();
const ArtistController = require('../controllers/artists');
const md_auth = require('../middlewares/authenticated');
const multipart = require('connect-multiparty');

var md_upload = multipart({ uploadDir: 'backend/uploads/artists' });

router.get('/artist/:id', md_auth.ensureAuth, ArtistController.getArtist);
router.put('/artist/:id', md_auth.ensureAuth, ArtistController.updateArtist);
router.delete('/artist/:id', md_auth.ensureAuth, ArtistController.deleteArtist);
router.post('/', md_auth.ensureAuth, ArtistController.saveArtist);
router.get('/:page?', md_auth.ensureAuth, ArtistController.getArtists);
router.post('/upload-image/:id', [md_auth.ensureAuth, md_upload], ArtistController.uploadImage);
router.get('/get-image/:imageFile', ArtistController.getImageFile);


module.exports = router