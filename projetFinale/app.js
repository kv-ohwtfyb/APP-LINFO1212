const express = require('express');
const consolidate = require('consolidate');
const app = express ();
const bodyParser = require('body-parser');
const session = require('express-session');
const {verifyPhoneNumber} = require("./private/js/customer/POST");

const {
    getHomePage,
    getOrdersPage,
    getCustomerFullOrders,
    getUserLoginPage,
    getUserSignUpPage,
    getRestaurantsPage,
    getSearchRestaurants,
    getCheckOutPage,
    getSignUpVerificationNumber,
    getSignUpGiveNumber,
    getStripe,
    getUserSignUpComplete,
    getUserRestaurantViewItemSpecification
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
    getListOfGroupNames,
    getListOfCategories,
    getOrderDetails,
} = require('./private/js/seller/GET');

const {
    postUserLoggedIn,
    postPhoneNumberCheck,
    postUserRegister,
    postOrdersOfUser,
    addItemToBasket,
    modifyAnItemOfTheBasket,
    postCheckOut,
    postCheckBeforeReOrdering

} = require('./private/js/customer/POST');

const {
    postSellerLogin,
    postCreatingRestaurant,
    postAddItem,
    postAddGroup,
    postAddCategory,
    postConfirmOrder,
    postCancelOrder
} = require('./private/js/seller/POST');

const { updateItem, updateGroup, updateCategory } = require('./private/js/seller/PUT');
const { deleteItem, deleteGroup, deleteCategory } = require('./private/js/seller/DELETE');
const { orderModel } = require('./private/js/general/schemas');
const { loginLimitter} = require('./private/js/general/functions');


app.use(bodyParser.urlencoded({ extended :true, limit: '50mb' }));
app.engine('html', consolidate.hogan);
app.set('views', 'templates');
app.use(express.static('static'));
app.use(session({
    secret: "EnCRypTIoNKeY",
    resave: false,
    saveUninitialized: true,
    cookie: {path: '/', httpOnly: true, limit: 24* 60 * 60 * 1000}
}));

const custommerloginPageLimit = loginLimitter(5,"You tried to log in many times, Please Try again in 1 hour");
const loginToRestaurantLimit = loginLimitter(3,"Is this really your restaurant? If so, Please Try again in 1 hour");

//Initiating the basket in the app session

/************ SELLER GET Request PART ************/

app.get('/group', (req, res) => {
    if (req.session.user){
        getAddOrModifyGroup(app, req, res);
    }else {
        res.render('./seller/SellerLoginPage.html',
            { loginError : "To access the item modification page you have to login as a seller."});
    }
});

app.get('/item', (req, res) => {
    if (req.session.user){
        getAddOrModifyItem(app, req, res);
    }else {
        res.render('./seller/SellerLoginPage.html',
            { loginError : "To access the item modification page you have to login as a seller."});
    }
});

app.get('/category', ((req, res) => {
    if (req.session.restaurant){
        getAddOrModifyCategory(app, req, res);
    }else {
        res.render('./seller/SellerLoginPage.html',
            { loginError : "To access the category modification page you have to login as a seller."});
    }
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
    if (req.session.restaurant){
        getOrders(app, req, res);
    }else {
        res.render('./seller/SellerLoginPage.html',
            { loggedIn : req.session.user, loginError : "To access the dashboard page you have to login as a seller."});
    }
});

app.get('/payments_list', function (req, res) {
    if (req.session.restaurant){
        getPaymentsPage(app, req ,res);
    }else {
        res.render('./seller/SellerLoginPage.html',
            { loginError : "To access the category modification page you have to login as a seller."});
    }
});

app.get('/my_store', function (req, res){
    if (req.session.restaurant){
        getTheStorePage(app, req, res);
    }else {
        res.render('./seller/SellerLoginPage.html',
        { loginError : "To access the category modification page you have to login as a seller."});
    }
});


app.get('/seller_login', (req, res) =>{
    getSellerLoginPage(app, req, res);
});

app.get('/logout', (req,res ) => {
   req.session.user = undefined;
   req.session.basket = undefined;
   req.session.restaurant = undefined;
   res.redirect('/');
});

app.get('/getFullOrders', (req, res) => {
    orderModel.findById(req.query)
        .then((result) => {
            if (result) {
                res.json({status: true, data : result});
            } else {
                res.json({status: false , data : "Sorry, Order requested doesn't exist"});
            }

        })
        .catch((error) => {
            res.json({status: false, data : error.message});
        })
})

app.get('/getOrderDetails', ((req, res) => {
    if (req.session.restaurant){
        getOrderDetails(app, req, res);
    }else {
        res.json({ status : false, msg : "Please first sign in as a seller to have access."})
    }
}))

/************ Seller POST Request PART ************/

app.post('/group', function (req, res) {
    if (req.session.restaurant){
        postAddGroup(app, req, res);
    }else{
        res.render('./seller/SellerLoginPage.html',
            { Error : "To access the group modification page you have to login as a seller."});
    }
});

app.post('/item', function(req, res){
    if (req.session.restaurant){
        postAddItem(app, req, res);
    }else{
        res.render('./seller/SellerLoginPage.html',
            { Error : "To access the item modification page you have to login as a seller."});
    }
});

app.post('/category', function (req, res){
    if (req.session.restaurant){
        postAddCategory(app, req, res);
    }else {
        res.render('./seller/SellerLoginPage.html',
            { loginError : "To access the category modification page you have to login as a seller."});
    }
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

app.post('/seller_login', loginToRestaurantLimit, function (req, res) {
    postSellerLogin(app,req, res);
});

app.post('/confirmOrder', (req, res) => {
    if (req.session.restaurant){
        postConfirmOrder(app, req,res);
    }else {
        res.json({ status : false, msg : "Please first login as a seller."});
    }
});

app.post('/cancelOrder', (req, res) => {
    if (req.session.restaurant){
        postCancelOrder(app, req,res);
    }else {
        res.json({ status : false, msg : "Please first login as a seller."});
    }
});
/************ SELLER   DELETE Request Routers *********/

app.delete('/item', function (req, res) {
    deleteItem(app, req, res);
})

app.delete('/group', ((req, res) => {
    deleteGroup(app, req, res);
}))

app.delete('/category', ((req, res) => {
    deleteCategory(app, req, res);
}))

/************ SELLER   PUT Request Routers *********/

app.put('/item', function (req, res) {
    updateItem(app, req, res);
})

app.put('/group', ((req, res) => {
    updateGroup(app, req, res);
}))

app.put('/category', ((req, res) => {
    updateCategory(app, req, res);
}))

/************ CUSTOMER GET Request PART ************/

app.get('/', function (req, res) {
    getHomePage(app, req, res);
});

app.get('/orders_page',(req,res) =>{
    if(req.session.user){
        getOrdersPage(app,req,res);
    } else {
        res.redirect('/');
    }
})

app.get('/getFullOrders', (req, res) => {
    if(req.session.user){
        getCustomerFullOrders(app, req, res);
    } else {
        res.redirect('/');
    }
})

app.get('/user_login', (req,res) => {
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
    getSearchRestaurants(app,req,res);
})
app.get('/check_out',(req,res) =>{
    if (req.session.user === undefined){
        res.render("./customer/UserLoginPage.html", {
            loginError : "To checkout you must login first."
        })
    }else if (req.session.basket === undefined){
        res.redirect('/');
    }else{
        getCheckOutPage(app,req,res);
    }
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

app.get('/getItemSpecifications', (req, res) => {
    getUserRestaurantViewItemSpecification(app, req, res)
});

/************ CUSTOMER POST Request PART ************/
app.post('/reOrderCheck', (req, res) => {
    postCheckBeforeReOrdering(app, req, res);   
})
app.post('/user_log_in', custommerloginPageLimit, (req, res) => {
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
app.post('/check_out', (req, res) => {
    postCheckOut(app, req, res);
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
app.post('/userReOrder', (req, res) => {
    console.log(req.body);
})
module.exports = app;
