const express = require('express');
const consolidate = require('consolidate');
const app = express ();
const bodyParser = require('body-parser');

const CustomerGetMethods = require('./static/js/backend/customer/GET_homePage');
const { getSellerLoginPage, getAddOrModifyGroup} = require('./static/js/backend/Seller/GET');


app.engine('html', consolidate.hogan);
app.set('views', 'templates');

app.get('/', function (req, res) {
    CustomerGetMethods.getHomePage(app, req, res);
});

app.get('/login_page', (req, res) => {
    getSellerLoginPage(app, req, res);
})

app.post('/seller_login', (req, res) => {
    
    console.log(req.body)

})
app.use(bodyParser.urlencoded({ extended :true, limit: '50mb' }));
app.use(express.static('static'));

module.exports = app;