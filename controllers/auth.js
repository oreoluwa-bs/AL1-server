/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

const User = require('../models/user');

const signup = (req, res) => {
    bcrypt.hash(req.body.password, 10).then((hash) => {
        const user = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
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
            res.status(200).json({
                status: 'success',
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

module.exports = {
    signup,
    login,
    getUsers,
};
