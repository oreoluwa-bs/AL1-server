const express = require('express');

const auth = require('../middleware/auth');

const multer = require('../middleware/multer-config');

const db = require('../controllers/videos');

const router = express.Router();


router.post('/', auth, multer, db.handleVidUpload);

router.delete('/:videoId', auth, db.handleVidDelete);

module.exports = router;
