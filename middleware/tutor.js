const User = require('../models/user');

module.exports = (req, res, next) => {
    User.findById(res.locals.userId).then((data) => {
        if (data && data.role.toLowerCase() !== 'tutor') {
            res.json({
                status: 'error',
                message: 'Only Tutors can perform this action',
            });
        } else {
            next();
        }
    }).catch((err) => {
        res.status(400).json({
            status: 'error',
            message: err,
        });
    });
};
