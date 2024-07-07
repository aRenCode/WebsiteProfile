var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const regSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }

});
module.exports = mongoose.model('Threads', regSchema);