const mongoose = require('mongoose');

const answerSchema = mongoose.Schema({
    a: { type: String },
    b: { type: String },
    c: { type: String },
    d: { type: String },
});

const testSchema = mongoose.Schema({
    question: { type: String, required: true },
    answers: [answerSchema],
    answer: { type: String, required: true },
});

const Test = mongoose.model('test', testSchema);
module.exports = {
    Test,
    testSchema,
};
