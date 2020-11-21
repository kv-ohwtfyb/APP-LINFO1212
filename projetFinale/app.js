const express = require('express');
const consolidate = require('consolidate');
const app = express ();
const bodyParser = require('body-parser');
const CustomerGetMethods = require('./static/js/backend/customer/GET_homePage');

app.engine('html', consolidate.hogan);
app.set('views', 'templates');

app.get('/', function (req, res) {
    CustomerGetMethods.getHomePage(app, req, res);
})

app.use(bodyParser.urlencoded({ extended :true, limit: '50mb' }));
app.use(express.static('static'));

module.exports = app;