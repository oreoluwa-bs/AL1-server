const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const adminUserSchema = mongoose.Schema({
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    email: {
        type: String, required: true, unique: true, trim: true,
    },
    password: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
});

adminUserSchema.plugin(uniqueValidator);

module.exports = mongoose.model('adminUser', adminUserSchema);
