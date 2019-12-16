/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

const User = require('../models/user');
const Course = require('../models/course');

const signup = (req, res) => {
    bcrypt.hash(req.body.password, 10).then((hash) => {
        const user = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            role: req.body.role,
            password: hash,
        });
        user.save().then((data) => {
            res.status(200).json({
                status: 'success',
                data,
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

const login = (req, res) => {
    User.findOne({ email: req.body.email }).then((user) => {
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Incorrect email or password',
            });
        }
        bcrypt.compare(req.body.password, user.password).then((valid) => {
            if (!valid) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Incorrect email or password',
                });
            }
            const token = jwt.sign(
                { userId: user.id },
                config.decrypt_me,
                { expiresIn: '24h' },
            );
            // eslint-disable-next-line no-param-reassign
            user.password = null;
            res.status(200).json({
                status: 'success',
                userId: user.id,
                auth: user,
                token,
            });
        }).catch((err) => {
            res.status(401).json({
                status: 'success',
                message: err,
            });
        });
    }).catch((err) => {
        res.status(401).json({
            status: 'success',
            message: err,
        });
    });
};

const getUsers = (req, res) => {
    User.find().then((data) => {
        res.status(200).json({
            status: 'success',
            data,
        });
    }).catch((err) => {
        res.status(400).json({
            status: 'error',
            message: err,
        });
    });
};

const editUser = (req, res) => {
    User.findById(req.params.userId).then((result) => {
        const oldUser = result;
        if (req.body.password) {
            bcrypt.hash(req.body.password, 10).then((hash) => {
                const user = new User({
                    _id: oldUser.id,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    role: req.body.role,
                    password: hash,
                    enrolledCourses: oldUser.enrolledCourses,
                });
                User.updateOne({ _id: req.params.userId }, user).then(() => {
                    res.status(200).json({
                        status: 'success',
                        message: 'User has been updated',
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
            const user = new User({
                _id: oldUser.id,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                role: req.body.role,
                password: oldUser.password,
                enrolledCourses: oldUser.enrolledCourses,
            });
            User.updateOne({ _id: req.params.userId }, user).then(() => {
                res.status(200).json({
                    status: 'success',
                    message: 'User has been updated',
                });
            }).catch((err) => {
                res.status(400).json({
                    status: 'error',
                    message: err,
                });
            });
        }
    }).catch((err) => {
        res.status(400).json({
            status: 'error',
            message: err,
        });
    });
};

const deleteUser = (req, res) => {
    if (res.locals.userId === req.params.userId) {
        User.deleteOne({ _id: req.params.userId }).then(() => {
            res.status(200).json({
                status: 'success',
                message: 'User account has been deleted',
            });
        }).catch((err) => {
            res.status(400).json({
                status: 'error',
                message: err,
            });
        });
    } else {
        res.status(400).json({
            status: 'error',
            message: 'Only user can delete this account',
        });
    }
};


const enrollInCourse = (req, res) => {
    Course.findById(req.params.courseId).then(() => {
        User.findById(res.locals.userId).then((ress) => {
            const user = ress;
            user.enrolledCourses = [...user.enrolledCourses, {
                isCompleted: false,
                _id: req.params.courseId,
            }];
            user.save().then(() => {
                res.status(200).json({
                    status: 'success',
                    message: 'User successfully enrolled in course',
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

const completeCourse = (req, res) => {
    Course.findById(req.params.courseId).then(() => {
        User.findById(res.locals.userId).then((ress) => {
            const user = ress;
            const enrolled = user.enrolledCourses.findIndex((course) => (
                course.id === req.params.courseId
            ));
            user.enrolledCourses[enrolled] = {
                ...user.enrolledCourses[enrolled],
                isCompleted: true,
            };
            user.save().then(() => {
                res.status(200).json({
                    status: 'success',
                    message: 'User successfully enrolled in course',
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

module.exports = {
    signup,
    login,
    getUsers,
    deleteUser,
    editUser,
    enrollInCourse,
    completeCourse,
};
