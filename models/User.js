const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    department: {
        type: String,
        required: true
    },
    leaveBalance: {
        type: Number,
        default: 12
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;