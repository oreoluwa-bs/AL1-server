const mongoose = require('mongoose');

const reportedCourseSchema = mongoose.Schema({
    courseId: { type: mongoose.SchemaTypes.ObjectId, ref: 'Course' },
    title: { type: String, required: true, trim: true },
    reason: { type: String, required: true, trim: true },
    reporterId: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
    reporterName: { type: String, required: true, trim: true },
    reportedDate: { type: Date },
});

module.exports = mongoose.model('reportedcourse', reportedCourseSchema);
