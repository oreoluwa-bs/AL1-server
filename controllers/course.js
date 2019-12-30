/* eslint-disable camelcase */
/* eslint-disable no-console */
const jwt = require('jsonwebtoken');
const fs = require('fs');

const config = require('../config');

const Course = require('../models/course');
const { Lesson } = require('../models/lesson');
const { Test } = require('../models/test');
const User = require('../models/user');
const ReportedCourses = require('../models/reportedCourses');

const getCourses = (req, res) => {
    Course.find().then((courses) => {
        res.status(200).json(courses);
    }).catch((err) => {
        res.status(400).json({
            status: 'error',
            message: err,
        });
    });
};

const getCourse = (req, res) => {
    Course.findById(req.params.courseId).then((course) => {
        res.status(200).json(course);
    }).catch((err) => {
        res.status(400).json({
            status: 'error',
            message: err,
        });
    });
};

const createCourse = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];

    User.findById(jwt.verify(token, config.decrypt_me).userId)
        .then((userrr) => {
            const course = new Course({
                title: req.body.title,
                description: req.body.description,
                authorId: jwt.verify(token, config.decrypt_me).userId,
                authorName: `${userrr.firstname} ${userrr.lastname}`,
                ratings: [0],
            });

            course.save().then((ress) => {
                const user = userrr;
                user.createdCourses.push({
                    _id: ress.id,
                });

                user.save().then(() => {
                    res.status(201).json({
                        status: 'success',
                        data: ress.id,
                        message: 'Course Created',
                    });
                }).catch((err) => {
                    res.status(400).json({
                        status: 'error',
                        message: err,
                    });
                });
            }).catch((err) => {
                res.status(400).json({
                    status: 'error',
                    message: err,
                });
            });
        }).catch((err) => {
            res.status(400).json({
                status: 'error',
                message: err,
            });
        });
};

const editCourse = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const editorId = jwt.verify(token, config.decrypt_me).userId;
    Course.findById(req.params.courseId).then((ress) => {
        const course = new Course({
            _id: req.params.courseId,
            title: req.body.title,
            description: req.body.description,
            authorName: ress.authorName,
            lessons: ress.lessons,
            test: ress.test,
            ratings: ress.ratings,
        });
        Course.updateOne({ _id: req.params.courseId, authorId: editorId }, course).then(() => {
            res.status(201).json({
                status: 'success',
                message: 'Course has been edited',
            });
        }).catch((err) => {
            res.status(400).json({
                status: 'error',
                message: err,
            });
        });
    }).catch((err) => {
        res.status(400).json({
            status: 'error',
            message: err,
        });
    });
};


const deleteCourse = (req, res) => {
    Course.findById(req.params.courseId).then((result) => {
        const { lessons } = result;

        lessons.forEach((lesson) => {
            const url = `${req.protocol}://${req.get('host')}/videos`;
            const fileme = lesson.videoURL.split(url)[1];
            fs.unlink(`videos/${fileme}`, (err) => {
                if (err) {
                    console.log(err);
                }
            });
        });

        Course.deleteOne({ _id: req.params.courseId }).then(() => {
            res.status(200).json({
                status: 'success',
                message: 'Course has been Deleted',
            });
        }).catch((err) => {
            res.status(400).json({
                status: 'error',
                message: err,
            });
        });
    }).catch((err) => {
        res.status(400).json({
            status: 'error',
            message: err,
        });
    });
};

const createLesson = (req, res) => {
    if (req.body.vidData) {
        const url = `${req.protocol}://${req.get('host')}`;
        const lesson = new Lesson({
            title: req.body.title,
            videoURL: `${url}/videos/${req.body.vidData.filename}`,
            textContent: req.body.textContent,
            references: [],
        });
        req.body.references.forEach((ref) => {
            lesson.references.push({ reference: ref.reference, link: ref.link });
        });
        Course.findById(req.params.courseId).then((result) => {
            result.lessons.push(lesson);
            result.save()
                .then(() => {
                    res.status(200).json({
                        status: 'success',
                        message: 'Lesson created',
                    });
                }).catch((err) => {
                    res.status(400).json({
                        status: 'error',
                        message: err,
                    });
                });
        }).catch((err) => {
            res.status(400).json({
                status: 'error',
                message: err,
            });
        });
    } else {
        const lesson = new Lesson({
            title: req.body.title,
            videoURL: null,
            textContent: req.body.textContent,
            references: [],
        });
        req.body.references.forEach((ref) => {
            lesson.references.push({ reference: ref.reference, link: ref.link });
        });
        Course.findById(req.params.courseId).then((result) => {
            result.lessons.push(lesson);
            result.save()
                .then(() => {
                    res.status(200).json({
                        status: 'success',
                        message: 'Lesson created',
                    });
                }).catch((err) => {
                    res.status(400).json({
                        status: 'error',
                        message: err,
                    });
                });
        }).catch((err) => {
            res.status(400).json({
                status: 'error',
                message: err,
            });
        });
    }
};


const deleteLesson = (req, res) => {
    Course.findById(req.params.courseId)
        .then((result) => {
            // eslint-disable-next-line no-param-reassign
            result.lessons = result.lessons.filter((lesson) => {
                const id = lesson.id.toString();
                const url = `${req.protocol}://${req.get('host')}/videos`;
                const fileme = lesson.videoURL.split(url)[1];
                fs.unlink(`videos/${fileme}`, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
                return id !== req.params.lessonId;
            });
            result.save()
                .then(() => {
                    res.status(200).json({
                        status: 'success',
                        message: 'Lesson deleted',
                    });
                }).catch((err) => {
                    res.status(400).json({
                        status: 'error',
                        message: err,
                    });
                });
        }).catch((err) => {
            res.status(400).json({
                status: 'error',
                message: err,
            });
        });
};

const editLesson = (req, res) => {
    if (req.body.vidData) {
        const url = `${req.protocol}://${req.get('host')}`;
        Course.findById(req.params.courseId).then((result) => {
            const oldLesson = result.lessons.find((lesson) => {
                const id = lesson.id.toString();
                return id === req.params.lessonId;
            });
            const newLesson = new Lesson({
                _id: oldLesson.id,
                title: req.body.title,
                videoURL: `${url}/videos/${req.body.vidData.filename}`,
                textContent: req.body.textContent,
                references: [],
            });
            req.body.references.forEach((ref) => {
                newLesson.references.push({ reference: ref.reference, link: ref.link });
            });

            const ed = result.lessons.findIndex((lesson) => {
                const id = lesson.id.toString();
                return id === req.params.lessonId;
            });
            // eslint-disable-next-line no-param-reassign
            result.lessons[ed] = newLesson;
            result.save().then(() => {
                res.status(200).json({
                    status: 'success',
                    message: 'Lesson Edited',
                });
            }).catch((err) => {
                res.status(400).json({
                    status: 'error',
                    message: err,
                });
            });
        }).catch((err) => {
            res.status(400).json({
                status: 'error',
                message: err,
            });
        });
    } else {
        Course.findById(req.params.courseId).then((result) => {
            const oldLesson = result.lessons.find((lesson) => {
                const id = lesson.id.toString();
                return id === req.params.lessonId;
            });
            const newLesson = new Lesson({
                _id: oldLesson.id,
                title: req.body.title,
                videoURL: oldLesson.videoURL,
                textContent: req.body.textContent,
                references: [],
            });
            req.body.references.forEach((ref) => {
                newLesson.references.push({ reference: ref.reference, link: ref.link });
            });

            const ed = result.lessons.findIndex((lesson) => {
                const id = lesson.id.toString();
                return id === req.params.lessonId;
            });
            // eslint-disable-next-line no-param-reassign
            result.lessons[ed] = newLesson;
            result.save().then(() => {
                res.status(200).json({
                    status: 'success',
                    message: 'Lesson Edited',
                });
            }).catch((err) => {
                res.status(400).json({
                    status: 'error',
                    message: err,
                });
            });
        }).catch((err) => {
            res.status(400).json({
                status: 'error',
                message: err,
            });
        });
    }
};

const createTest = (req, res) => {
    const question = new Test({
        question: req.body.question,
        answer: req.body.answer,
        answers: [],
    });
    req.body.options.forEach((option) => {
        question.answers.push({ value: option.value, text: option.text });
    });
    Course.findById(req.params.courseId).then((result) => {
        result.test.push(question);
        result.save().then(() => {
            res.status(200).json({
                status: 'success',
                message: 'Test created',
            });
        }).catch((err) => {
            res.status(400).json({
                status: 'error',
                message: err,
            });
        });
    }).catch((err) => {
        res.status(400).json({
            status: 'error',
            message: err,
        });
    });
};

const deleteTest = (req, res) => {
    Course.findById(req.params.courseId).then((result) => {
        // eslint-disable-next-line no-param-reassign
        result.test = [];
        result.save().then(() => {
            res.status(200).json({
                status: 'success',
                message: 'Test has been deleted',
            });
        }).catch((err) => {
            res.status(400).json({
                status: 'error',
                message: err,
            });
        });
    }).catch((err) => {
        res.status(400).json({
            status: 'error',
            message: err,
        });
    });
};

const deleteQuestion = (req, res) => {
    Course.findById(req.params.courseId).then((result) => {
        // eslint-disable-next-line no-param-reassign
        result.test = result.test.filter((question) => {
            const id = question.id.toString();
            return id !== req.params.questionId;
        });
        result.save().then(() => {
            res.status(200).json({
                status: 'success',
                message: 'Test question has been deleted',
            });
        }).catch((err) => {
            res.status(400).json({
                status: 'error',
                message: err,
            });
        });
    }).catch((err) => {
        res.status(400).json({
            status: 'error',
            message: err,
        });
    });
};

const editQuestion = (req, res) => {
    Course.findById(req.params.courseId).then((result) => {
        const oldQuestion = result.test.find((quest) => {
            const id = quest.id.toString();
            return id === req.params.questionId;
        });

        const newQuestion = new Test({
            _id: oldQuestion.id,
            question: req.body.question,
            answer: req.body.answer,
            answers: [],
        });
        req.body.options.forEach((option) => {
            newQuestion.answers.push({ value: option.value, text: option.text });
        });
        const ed = result.test.findIndex((quest) => {
            const id = quest.id.toString();
            return id === req.params.questionId;
        });

        // eslint-disable-next-line no-param-reassign
        result.test[ed] = newQuestion;
        result.save().then(() => {
            res.status(200).json({
                status: 'success',
                message: 'Test question has been edited',
            });
        }).catch((err) => {
            res.status(400).json({
                status: 'error',
                message: err,
            });
        });
    }).catch((err) => {
        res.status(400).json({
            status: 'error',
            message: err,
        });
    });
};

const rateCourse = (req, res) => {
    Course.findById(req.params.courseId).then((result) => {
        result.ratings.push(req.body.rating);
        result.save()
            .then(() => {
                res.status(200).json({
                    status: 'success',
                    message: 'Course has been rated',
                });
            }).catch((err) => {
                res.status(400).json({
                    status: 'error',
                    message: err,
                });
            });
    }).catch((err) => {
        res.status(400).json({
            status: 'error',
            message: err,
        });
    });
};

const flagCourse = (req, res) => {
    const course = new ReportedCourses({
        courseId: req.body.courseId,
        reason: req.body.reason,
        title: req.body.title,
        reporterId: req.body.reporterId,
        reporterName: req.body.reporterName,
        reportedDate: req.body.reportedDate,
    });
    course.save().then(() => {
        res.status(200).json({
            status: 'success',
            message: 'Course has been flagged',
        });
    }).catch((err) => {
        res.status(400).json({
            status: 'error',
            message: err,
        });
    });
};

module.exports = {
    getCourses,
    getCourse,
    createCourse,
    deleteCourse,
    editCourse,
    createLesson,
    deleteLesson,
    editLesson,
    createTest,
    deleteTest,
    deleteQuestion,
    editQuestion,
    rateCourse,
    flagCourse,
};
