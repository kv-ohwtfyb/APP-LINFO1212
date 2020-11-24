const fs = require('fs');
const https = require('https');
const app = require('./app');

https.createServer({
    key         : fs.readFileSync('./private/ssl/key.pem'),
    cert        : fs.readFileSync('./private/ssl/cert.pem'),
    passphrase  : 'ndakwiyamye'
}, app).listen(8080, function () {
    console.log( new Date().toLocaleTimeString() + " Server running on port 8080.");
});
