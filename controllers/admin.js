/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

const User = require('../models/user');
const AdminUser = require('../models/adminuser');
const ReportedCourse = require('../models/reportedCourses');

const signup = (req, res) => {
    bcrypt.hash(req.body.password, 10).then((hash) => {
        const user = new AdminUser({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            role: req.body.role,
            password: hash,
        });
        user.save().then(() => {
            res.status(200).json({
                status: 'success',
                // data,
                message: 'Account created',
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
    AdminUser.findOne({ email: req.body.email }).then((user) => {
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

const getReportedCourses = (req, res) => {
    ReportedCourse.find().then((data) => {
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

const deleteReportedCourse = (req, res) => {
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

module.exports = {
    signup,
    login,
    getReportedCourses,
    deleteReportedCourse,
};
