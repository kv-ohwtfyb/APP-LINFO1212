const express = require('express');
const consolidate = require('consolidate');
const app = express ();
const bodyParser = require('body-parser');

const { getHomePage,
    getOrdersPage,
    getUserLoginPage,
    getUserSignUpPage,
    getRestaurantsPage,
    getSearchRestaurants,
    getCheckOutPage,
    getSignUpVerificationNumber,
    getSignUpGiveNumber,
    getstripe,
    getUserSignUpComplete} = require('./private/js/customer/GET');

const {  
    getAddOrModifyGroup,
    getAddOrModifyItem,
    getAddOrModifyMenu,
    getAfterCreateRestoMessage,
    getCreateRestaurantSpeci,
    getOrders,
    getPaymentsPage,
    getTheStorePage,
    getSellerLoginPage } = require('./private/js/Seller/GET');

app.use(bodyParser.urlencoded({ extended :true, limit: '50mb' }));

app.engine('html', consolidate.hogan);
app.set('views', 'templates');


app.get('/', function (req, res) {
    getHomePage(app, req, res);
})

/************ SELLER GET Request PART ************/ 

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

app.get('/seller_login', (req, res) =>{
    getSellerLoginPage(app, req, res);
});

/************ CUSTOMER GET Request PART ************/

app.get('/orders_page',(req,res) =>{
    getOrdersPage(app,req,res);
})
app.get('/user_login',(req,res) => {
    getUserLoginPage(app,req,res);
})
app.get('/user_signup',(req,res) =>{
    getUserSignUpPage(app,req,res);
})
app.get('/restaurants',(req,res) =>{
    getRestaurantsPage(app,req,res);
})
app.get('/search',(req,res) => {
    getSearchRestaurants(app,req,res);
})
app.get('/check_out',(req,res) =>{
    getCheckOutPage(app,req,res);
})

app.get('/sign_up_verification',(req, res) => {
    getSignUpVerificationNumber(app,req,res);
})
app.get('/sign_up_giveNumber', (req, res) => {
    getSignUpGiveNumber(app,req,res);
})
app.get('/stripe', (req, res) => {
    getstripe(app,req,res);
})
app.get('/signUp_complete', (req, res) => {
    getUserSignUpComplete(app,req,res);
})
app.post('/seller_login', (req, res) => {
    console.log(req.body);
});



app.use(bodyParser.urlencoded({ extended :true, limit: '50mb' }));
app.use(express.static('static'));

module.exports = app;