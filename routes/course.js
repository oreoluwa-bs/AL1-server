const express = require('express');

const auth = require('../middleware/auth');
const tutor = require('../middleware/tutor');

const db = require('../controllers/course');

const router = express.Router();


router.get('/', db.getCourses);

router.post('/create-course', auth, tutor, db.createCourse);

router.delete('/:courseId', auth, tutor, db.deleteCourse);

router.put('/:courseId', auth, tutor, db.editCourse);

router.post('/:courseId/create-lesson', auth, tutor, db.createLesson);

router.delete('/:courseId/:lessonId', auth, tutor, db.deleteLesson);

router.put('/:courseId/:lessonId', auth, tutor, db.editLesson);

router.post('/:courseId/create-test', auth, tutor, db.createTest);

router.delete('/:courseId/test/:questionId', auth, tutor, db.deleteQuestion);

router.delete('/:courseId/test/', auth, tutor, db.deleteTest);

router.put('/:courseId/test/:questionId', auth, tutor, db.editQuestion);

router.post('/:courseId/rate', auth, db.rateCourse);

// router.post('/login', auth, db.login);

module.exports = router;
