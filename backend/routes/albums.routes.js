const express = require('express');
const router = express.Router();
const AlbumController = require('../controllers/album');
const md_auth = require('../middlewares/authenticated');
const multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: 'backend/uploads/artists' });


router.get('/', md_auth.ensureAuth, AlbumController.getAlbum);

module.exports = router;