const express = require('express');

const auth = require('../middleware/auth');

const db = require('../controllers/auth');

const router = express.Router();


router.get('/', db.getUsers);

router.post('/create-user', db.signup);

router.post('/login', db.login);

router.put('/:userId', auth, db.editUser);

router.delete('/:userId', auth, db.deleteUser);


router.post('/enroll/:courseId', auth, db.enrollInCourse);

module.exports = router;
