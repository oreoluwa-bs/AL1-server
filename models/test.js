const mongoose = require('mongoose');

const answerSchema = mongoose.Schema({
    value: { type: String, trim: true },
    text: { type: String, trim: true },
});

const testSchema = mongoose.Schema({
    question: { type: String, required: true, trim: true },
    answers: [answerSchema],
    answer: answerSchema,
});

const Test = mongoose.model('test', testSchema);
module.exports = {
    Test,
    testSchema,
};
