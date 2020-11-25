const express = require('express');
const consolidate = require('consolidate');
const app = express ();
const bodyParser = require('body-parser');
const theMainPage = require('./private/js/customer/GET_homePage');
const {  
    getAddOrModifyGroup,
    getAddOrModifyItem,
    getAddOrModifyMenu,
    getAfterCreateRestoMessage,
    getCreateRestaurantSpeci,
    getOrders,
    getPaymentsPage,
    getTheStorePage,
    getSellerLoginPage, } = require('./private/js/Seller/GET');

app.use(bodyParser.urlencoded({ extended :true, limit: '50mb' }));

app.engine('html', consolidate.hogan);
app.set('views', 'templates');

/************ SELLER GET Request PART ************/ 

app.get('/', (req, res) => {
    res.send(theMainPage.getHomePage);
})

app.get('/add_group', (req, res) => {
    getAddOrModifyGroup(app, req, res);
});

app.get('/add_item', (req, res) => {
    getAddOrModifyItem(app, req, res);
});

app.get('/menu', (req, res) => {
    getAddOrModifyMenu(app, req, res);
});

app.get('/message', (req, res) => {
    getAfterCreateRestoMessage(app, req, res);
});

app.get('/restaurant_speci', function (req, res){
    getCreateRestaurantSpeci(app, req, res);
});

app.get('/orders', function (req, res) {
    getOrders(app, req, res);
});

app.get('/payments_list', function (req, res) {
    getPaymentsPage(app, req ,res);
});

app.get('/my_store', function (req, res){
    getTheStorePage(app, req, res);
});

app.get('/login_page', (req, res) => {
    getSellerLoginPage(app, req, res);
});

/************ SELLER POST Request PART ************/ 

app.post('/seller_login', function (req, res) {
    console.log(req.body)

})

app.use(express.static('static'));

module.exports = app;