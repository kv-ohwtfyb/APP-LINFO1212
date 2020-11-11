const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const connection = mongoose.createConnection('mongodb://localhost:27017/projectdb', {useUnifiedTopology: true} );
const incidentSchema = new Schema({
    image: {
        type: Buffer,
        required: false
    },
    description: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    imageType : {
        type: String,
        required: true,
    }
});

module.exports = connection.model('incidents', incidentSchema);