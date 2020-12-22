const fs = require('fs');
const https = require('https');
const app = require('./app');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/testingdb',
    {
        keepAlive: true,
        keepAliveInitialDelay: 300000,
        useNewUrlParser: true, 
        useUnifiedTopology: true, 
        useCreateIndex: true
        
    }, (err) => { return err}
);

mongoose.connection.on('connected', (err, res) => {
    console.log( new Date().toLocaleTimeString() + " Connected to MongoDB db <testingdb> the server is running on 27017.");
    https.createServer({
    key         : fs.readFileSync('./private/ssl/key.pem'),
    cert        : fs.readFileSync('./private/ssl/cert.pem'),
    passphrase  : 'ndakwiyamye'
    }, app).listen(8080, function () {
        console.log( new Date().toLocaleTimeString() + " Server running on port 8080.");
    });
});

mongoose.connection.on('disconnected', (err, res) => {
    console.log( new Date().toLocaleTimeString() + " Disconnected from the MongoDB Server");
});

mongoose.connection.on('error', (err) => {
    console.log( new Date().toLocaleTimeString() + ` Caught by .catch ${err}`);
});