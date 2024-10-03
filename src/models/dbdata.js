const { Schema, model} = require('mongoose');

const dataToStore = new Schema({
    username: {
        type: String,
        required: true
    },
    Id: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        required: true
    },
    Type: {
        type: String,
        required: true
    },
    info: {name: {
        type: String,
    },
    desirednick: {
        type: String,
    },
    surname: {
        type: String,
    },
    grade: {
        type: String,
    },
    desirednickname: {
        type: Array,
    },
    
    unverdesiredinfo: {name: {
        type: String,
    },
    desirednick: {
        type: String,
    },
    surname: {
        type: String,
    },
    grade: {
        type: String,
    },
        
    }}
})

module.exports = model('dbdata',dataToStore);