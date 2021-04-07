const express = require('express');
const router = express.Router();
var UserController = require('../controllers/user');
const md_auth = require('../middlewares/authenticated');
const multipart = require('connect-multiparty');

var md_upload = multipart({ uploadDir: 'uploads/users' });

router.get('/', md_auth.ensureAuth, UserController.pruebas);
router.post('/register', UserController.saveUser);
router.post('/login', UserController.loginUser);
router.post('/upload-image/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
router.put('/:id', md_auth.ensureAuth, UserController.updateUser);
router.get('/get-image/:imageFile', UserController.getImageFile);

module.exports = router;