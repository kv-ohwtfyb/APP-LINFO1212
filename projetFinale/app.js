const express = require('express');
const consolidate = require('consolidate');
const app = express ();
const bodyParser = require('body-parser');

app.engine('html', consolidate.hogan);
app.set('views', 'templates');

app.get('/', function (req, res) {
    res.render('./customer/homepage.html');
})

app.use(bodyParser.urlencoded({ extended :true, limit: '50mb' }));
app.use(express.static('static'));

module.exports = app;