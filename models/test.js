const mongoose = require('mongoose');

const answerSchema = mongoose.Schema({
    a: { type: String, trim: true },
    b: { type: String, trim: true },
    c: { type: String, trim: true },
    d: { type: String, trim: true },
});

const testSchema = mongoose.Schema({
    question: { type: String, required: true, trim: true },
    answers: [answerSchema],
    answer: { type: String, required: true, trim: true },
});

const Test = mongoose.model('test', testSchema);
module.exports = {
    Test,
    testSchema,
};
