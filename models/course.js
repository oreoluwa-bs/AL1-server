const mongoose = require('mongoose');

const { lessonSchema } = require('./lesson');
const { testSchema } = require('./test');

const courseSchema = mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    authorId: { type: String, required: true, trim: true },
    lessons: [lessonSchema],
    test: [testSchema],
});

module.exports = mongoose.model('Course', courseSchema);
