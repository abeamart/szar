const { Schema, model} = require('mongoose');

const dataToStore = new Schema({
    Id: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    dateobj: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    messageid: {
        type: String,
        required: true
    },
    
    
})

module.exports = model('archivedb',dataToStore);