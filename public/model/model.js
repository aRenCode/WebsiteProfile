var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const regSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    pass: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model('users', regSchema);   