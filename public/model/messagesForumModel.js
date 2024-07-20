var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const regSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    msg: {
        type: String,
        required: true
    }
});


//module.exports = mongoose.model('Messages', regSchema);

module.exports = regSchema;