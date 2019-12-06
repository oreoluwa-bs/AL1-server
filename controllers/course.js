const jwt = require('jsonwebtoken');
const config = require('../config');

const Course = require('../models/course');
const { Lesson } = require('../models/lesson');
const { Test } = require('../models/test');

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

const createCourse = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const course = new Course({
        title: req.body.title,
        description: req.body.description,
        authorId: jwt.verify(token, config.decrypt_me).userId,
        ratings: [0],
    });

    course.save()
        .then(() => {
            res.status(201).json({
                status: 'success',
                message: 'Course Created',
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
    const course = new Course({
        _id: req.params.courseId,
        title: req.body.title,
        description: req.body.description,
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
};

const deleteCourse = (req, res) => {
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
};

const createLesson = (req, res) => {
    const lesson = new Lesson({
        videoURL: req.body.url,
        textContent: req.body.textContent,
        references: {
            reference: req.body.reference,
            referenceLink: req.body.link,
        },
    });
    Course.findById(req.params.courseId)
        .then((result) => {
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
};

const deleteLesson = (req, res) => {
    Course.findById(req.params.courseId)
        .then((result) => {
            // eslint-disable-next-line no-param-reassign
            result.lessons = result.lessons.filter((lesson) => {
                const id = lesson.id.toString();
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
    Course.findById(req.params.courseId).then((result) => {
        const oldLesson = result.lessons.find((lesson) => {
            const id = lesson.id.toString();
            return id === req.params.lessonId;
        });
        const newLesson = new Lesson({
            _id: oldLesson.id,
            videoURL: req.body.url,
            textContent: req.body.textContent,
            references: {
                _id: oldLesson.references.id,
                reference: req.body.reference,
                referenceLink: req.body.link,
            },
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
};

const createTest = (req, res) => {
    const question = new Test({
        question: req.body.question,
        answer: req.body.answer,
        answers: {
            a: req.body.a,
            b: req.body.b,
            c: req.body.c,
            d: req.body.d,
        },
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
            answers: {
                _id: oldQuestion.answers.id,
                a: req.body.a,
                b: req.body.b,
                c: req.body.c,
                d: req.body.d,
            },
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


module.exports = {
    getCourses,
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
};
