const mongoose = require('mongoose');


const referenceSchema = mongoose.Schema({
    reference: { type: String, trim: true },
    link: { type: String, trim: true },
});

const lessonSchema = mongoose.Schema({
    title: { type: String, trim: true, required: true },
    videoURL: { type: String, trim: true },
    textContent: { type: String },
    references: [referenceSchema],
});

const Lesson = mongoose.model('lesson', lessonSchema);
module.exports = {
    Lesson,
    lessonSchema,
};
