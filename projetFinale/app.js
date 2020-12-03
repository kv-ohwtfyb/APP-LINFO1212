const express = require('express');
const consolidate = require('consolidate');
const app = express ();
const bodyParser = require('body-parser');
const session = require('express-session');

const { getHomePage,
    getOrdersPage,
    getUserLoginPage,
    getUserSignUpPage,
    getRestaurantsPage,
    getSearchRestaurants,
    getCheckOutPage,
    getSignUpVerificationNumber,
    getSignUpGiveNumber,
    getStripe,
    getUserSignUpComplete
} = require('./private/js/customer/GET');

const {
    getAddOrModifyGroup,
    getAddOrModifyItem,
    getAddOrModifyCategory,
    getCreateRestaurantSpeci,
    getOrders,
    getPaymentsPage,
    getTheStorePage,
    getSellerLoginPage
} = require('./private/js/seller/GET');

const {
    postUserLoggedIn
} = require('./private/js/customer/POST');

const {
    postSellerlogin
} = require('./private/js/seller/POST');


app.use(bodyParser.urlencoded({ extended :true, limit: '50mb' }));
app.engine('html', consolidate.hogan);
app.set('views', 'templates');
app.use(express.static('static'));
app.use(session({
    secret: "EnCRypTIoNKeY",
    resave: false,
    saveUninitialized: true,
    cookie: {path: '/', httpOnly: true, limit: 30 * 60 * 1000}
}));

/************ SELLER GET Request PART ************/ 

app.get('/add_group', (req, res) => {
    getAddOrModifyGroup(app, req, res);
});

app.get('/add_item', (req, res) => {
    getAddOrModifyItem(app, req, res);
});

app.get('/add_category', ((req, res) => {
    getAddOrModifyCategory(app, req, res);
}));

// "/menu" A CHANGER
app.get('/menu', (req, res) => {
    getAddOrModifyCategory(app, req, res);
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

/************ Seller POST Request PART ************/

app.post('/add-group', function (req, res) {
    console.log(req.body);
});

app.post('/add-item', function(req, res){
    console.log(req.body);
});

app.post('/menu', function (req, res){
    console.log(req.body);
});

app.post('/creating_restaurant', function (req, res){
    console.log(req.body);
});

app.post('/seller_login_submitted', function (req, res) {
    //TODO check if already logged In
    //if so, just ask the authKey only
    //else ask the whole page
    postSellerlogin(app,req, res);
});

/************ CUSTOMER GET Request PART ************/

app.get('/', function (req, res) {
    getHomePage(app, req, res);
});

app.get('/orders_page',(req,res) =>{
    getOrdersPage(app,req,res);
})
app.get('/user_login',(req,res) => {
    if (req.session.user) { req.redirect("/"); }
    else { getUserLoginPage(app, req, res); }  
})
app.get('/user_signup',(req,res) =>{
    getUserSignUpPage(app,req,res);
})
app.get('/restaurant_view',(req,res) =>{
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

/************ CUSTOMER POST Request PART ************/

app.post('/user_log_in',(req, res) => {
    postUserLoggedIn(app,req, res);
})
app.post('/user_sign_up',(req, res, next) => {
    console.log(req.body);
})
app.post('/orders', (req, res) => {
    console.log(req.body);
})
app.post('/restaurant', (req, res) => {
    console.log(req.body);
})
app.post('/search_response', (req, res) => {
    console.log(req.body);
})
app.post('/checkout', (req, res) => {
    console.log(req.body);
})
app.post('/signup_verification',(req, res) => {
    console.log(req.body);
})
app.post('/signup_giveNumber', (req, res) => {
    console.log(req.body);
})
app.post('/stripe', (req, res) => {
    console.log(req.body);
})
app.post('/signUpComplete', (req, res) => {
    console.log(req.body);
})

module.exports = app;