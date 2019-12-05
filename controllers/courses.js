const jwt = require('jsonwebtoken');
const config = require('../config');

const Course = require('../models/course');
const { Lesson } = require('../models/lesson');
const { Test } = require('../models/test');

const createCourse = (req, res) => {
    const course = new Course({
        title: req.body.title,
        description: req.body.description,
        authorId: req.body.authorId,
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

const createLesson = (req, res) => {
    const lesson = new Lesson({
        videoURL: req.body.lll,
        textContent: req.body.textContent,
        references: {
            reference: req.body.reference,
            referenceLink: req.body.link,
        },
    });
    Course.findOne({ _id: '5de67105019fe44e6c76e183' })
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
    Course.findOne({ _id: '5de67105019fe44e6c76e183' })
        .then((result) => {
            // eslint-disable-next-line no-param-reassign
            result.lessons = result.lessons.filter((lesson) => {
                // eslint-disable-next-line no-underscore-dangle
                const id = lesson._id.toString();
                return id !== req.query.id;
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
    Course.findOne({ _id: '5de67105019fe44e6c76e183' })
        .then((result) => {
            result.test.push(question);
            result.save()
                .then(() => {
                    res.status(200).json({
                        status: 'success',
                        message: 'Tesr created',
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

module.exports = {
    createCourse,
    createLesson,
    deleteLesson,
    createTest,
    getCourses,
};
