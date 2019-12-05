const mongoose = require('mongoose');


const referenceSchema = mongoose.Schema({
    reference: { type: String },
    referenceLink: { type: String },
});

const lessonSchema = mongoose.Schema({
    videoURL: { type: String },
    textContent: { type: String },
    references: [referenceSchema],
});

const Lesson = mongoose.model('lesson', lessonSchema);
module.exports = {
    Lesson,
    lessonSchema,
};
