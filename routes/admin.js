const express = require('express');

const auth = require('../middleware/auth');

const db = require('../controllers/admin');

const router = express.Router();


router.get('/courses/reported', db.getReportedCourses);

router.post('/auth/create-user', db.signup);

router.post('/auth/login', db.login);

router.delete('/admin/course/:courseId', auth, db.deleteReportedCourse);

module.exports = router;
