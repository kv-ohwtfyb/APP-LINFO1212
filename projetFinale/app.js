const express = require('express');
const consolidate = require('consolidate');
const app = express ();
const bodyParser = require('body-parser');
const session = require('express-session');


const {
    getHomePage,
    getOrdersPage,
    getUserLoginPage,
    getUserSignUpPage,
    getRestaurantsPage,
    getSearchRestaurants,
    getCheckOutPage,
    getSignUpVerificationNumber,
    getSignUpGiveNumber,
    getStripe,
    getUserSignUpComplete,

} = require('./private/js/customer/GET');

const {
    getAddOrModifyGroup,
    getAddOrModifyItem,
    getAddOrModifyCategory,
    getCreateRestaurant,
    getOrders,
    getPaymentsPage,
    getTheStorePage,
    getSellerLoginPage,
    getAfterCreateRestoMessage,
    getListOfGroupNames
} = require('./private/js/seller/GET');

const {
    postUserLoggedIn,
    postPhoneNumberCheck,
    postUserRegister,
    postOrdersOfUser,
    addItemToBasket,
    modifyAnItemOfTheBasket

} = require('./private/js/customer/POST');

const {
    postSellerLogin,
    postCreatingRestaurant
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



//Initiating the basket in the app session


/************ SELLER GET Request PART ************/

app.get('/group', (req, res) => {
    getAddOrModifyGroup(app, req, res);
});

app.get('/item', (req, res) => {
    getAddOrModifyItem(app, req, res);
});

app.get('/category', ((req, res) => {
    getAddOrModifyCategory(app, req, res);
}));

app.get('/message', (req, res) => {
    getAfterCreateRestoMessage(app, req, res);
});

app.get('/creating_restaurant', function (req, res){
    if (req.session.user){
        getCreateRestaurant(app, req, res);
    }else {
        res.render("./customer/UserLoginPage.html", {
            loginError : "To create a restaurant you must first login or create an account."
        });
    }
});

app.get('/dashboard', function (req, res) {
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

app.get('/logout', (req,res ) => {
   req.session.user = null;
   res.redirect('/');
});

app.get('/getGroups', function (req, res){
    if (req.session.restaurant){
        getListOfGroupNames(app, req, res);
    }else {
        res.json({ status : false, msg :"First login as a restaurant seller."});
    }
});
/************ Seller POST Request PART ************/

app.post('/group', function (req, res) {
    console.log(req.body);
});

app.post('/item', function(req, res){
    console.log(req.body);
    res.render('./Seller/AddOrModifyItem.html');
});

app.post('/menu', function (req, res){
    console.log(req.body);
});

app.post('/creating_restaurant', function (req, res){
    if (req.session.user){
        postCreatingRestaurant(app, req, res);
    }else {
        res.render("./customer/UserLoginPage.html", {
            loginError : "To create a restaurant you must first login or create an account."
        });
    }
});

app.post('/seller_login', function (req, res) {
    postSellerLogin(app,req, res);
});

/************ SELLER   DELETE Request Routers *********/

app.delete('/item', function (req, res) {
    console.log(req.query);
    console.log(req.body);
})

/************ CUSTOMER GET Request PART ************/

app.get('/', function (req, res) {
    getHomePage(app, req, res);
});

app.get('/orders_page',(req,res) =>{
    getOrdersPage(app,req,res);
  
})

app.get('/user_login',(req,res) => {
    if (req.session.user) { res.redirect("/"); }
    else { getUserLoginPage(app, req, res); }
})

app.get('/user_signup',(req,res) =>{
    getUserSignUpPage(app,req,res);
})

app.get('/restaurant_view',(req,res) =>{
    getRestaurantsPage(app,req,res);
})

app.get('/search',(req,res) => {
    req.session.basket = {
        restaurants : [{
            restaurant : "Burger King",
            items      : [{
                            name : "Double Whooper",
                            groupSets : [],
                            unityPrice : 10,
                            quantity : 4
                            }]
                        },
                        {
            restaurant : "O'Tacos",
            items      : [{
                            name : "XL Tacos",
                            groupSets : [],
                            unityPrice : 13.5,
                            quantity : 1
                            }]
                        }
        ],
        totalItems  : 5,
        totalAmount : 40 + 13.5
    }
    getSearchRestaurants(app,req,res);
})
app.get('/check_out',(req,res) =>{
    getCheckOutPage(app,req,res);
})

app.get('/signup_verification',(req, res) => {
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
    postUserRegister(app, req, res);
})
app.post('/user_orders', (req, res) => {
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
    postPhoneNumberCheck(app, req, res);
})
app.post('/stripe', (req, res) => {
    console.log(req.body);
})
app.post('/message', (req, res) => {
    res.render('./customer/MessagePage.html')
})
app.post('/basket_add', (req, res) => {
    addItemToBasket(app,req,res);
})
app.post('/basket_modify',(req, res) =>{
    modifyAnItemOfTheBasket(app, req, res);
})
module.exports = app;
