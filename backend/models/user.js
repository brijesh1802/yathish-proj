const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    categories: [{
        name: {
            type: String,
            required: true,
        },
        items: [{
            type: String,
        }],
    }],
});

module.exports = mongoose.model('User', userSchema);
