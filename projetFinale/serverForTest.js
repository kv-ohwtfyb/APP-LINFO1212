const app = require('./app');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/dbforgiqtest',
    {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
);

mongoose.connection.on('connected', (err, res) => {
    console.log( new Date().toLocaleTimeString() + " Connected to MongoDB db <dbforgiqtest> the server is running on 27017.");
    app.listen(1348, function () {
        console.log( new Date().toLocaleTimeString() + " Testing server running on port 1348.");
    });
});

mongoose.connection.on('disconnected', (err, res) => {
    console.log( new Date().toLocaleTimeString() + " Disconnected from the MongoDB Server");
});

mongoose.connection.on('error', (err) => {
    console.log( new Date().toLocaleTimeString() + `Caught by .catch ${err}`);
});