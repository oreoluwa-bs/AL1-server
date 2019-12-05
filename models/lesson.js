const mongoose = require('mongoose');


const referenceSchema = mongoose.Schema({
    reference: { type: String, trim: true },
    referenceLink: { type: String, trim: true },
});

const lessonSchema = mongoose.Schema({
    videoURL: { type: String, trim: true },
    textContent: { type: String },
    references: [referenceSchema],
});

const Lesson = mongoose.model('lesson', lessonSchema);
module.exports = {
    Lesson,
    lessonSchema,
};
