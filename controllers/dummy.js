/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const config = require('../config');

const dummyStudent = require('../dummydata/MOCK_DATA_STUDENT.json');
const dummyTutor = require('../dummydata/MOCK_DATA_TUTOR.json');

const User = require('../models/user');
// const Course = require('../models/course');s

// const createDummies = (req, res) => {
// bcrypt.hash(req.body.password, 10).then((hash) => {
//     const user = new User({
//         firstname: req.body.firstname,
//         lastname: req.body.lastname,
//         email: req.body.email,
//         role: req.body.role,
//         password: hash,
//     });
//     user.save().then(() => {
//         res.status(200).json({
//             status: 'success',
//             message: 'Account created',
//             // data,
//         });
//     }).catch((err) => {
//         res.status(400).json({
//             status: 'error',
//             message: err,
//         });
//     });
// }).catch((err) => {
//     res.status(400).json({
//         status: 'error',
//         message: err,
//     });
// });
// };

const createDummies = (req, res) => {
    const dummies = [...dummyStudent, ...dummyTutor];

    dummies.forEach((dummy) => {
        bcrypt.hash(dummy.password, 10).then((hash) => {
            const user = new User({
                firstname: dummy.first_name,
                lastname: dummy.last_name,
                email: dummy.email,
                role: dummy.role,
                password: hash,
            });
            user.save().then(() => {
                res.status(200).json({
                    status: 'success',
                    message: 'Dummy accounts created',
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
    });
};


const deleteDummies = (req, res) => {
    const dummies = [...dummyStudent, ...dummyTutor];

    dummies.forEach((dummy) => {
        User.deleteOne({ email: dummy.email }).then(() => {
            res.status(200).json({
                status: 'success',
                message: 'Dummy accounts have been deleted',
            });
        }).catch((err) => {
            res.status(400).json({
                status: 'error',
                message: err,
            });
        });
    });
};


module.exports = {
    createDummies,
    deleteDummies,
};
