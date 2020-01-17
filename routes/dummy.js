const express = require('express');

// const auth = require('../middleware/auth');
// const tutor = require('../middleware/tutor');

const db = require('../controllers/dummy');

const router = express.Router();

router.post('/create-dummies', db.createDummies);

router.delete('/delete-dummies', db.deleteDummies);

module.exports = router;
