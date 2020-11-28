function homePage(app, req, res){
    res.render('./customer/Homepage.html');
}
function ordersPage(app,req,res){
    res.render('./customer/OrdersPage.html');
}
function logInPage(app,req,res){
    res.render('./customer/UserLoginPage.html');
}
function signUp(app,req,res){
    res.render('./customer/UserSignUpCompletingPage.html');
}
function restaurantsPage(app,req,res){
    res.render('./customer/RestaurantViewPage.html');
}
function searchRestaurants(app,req,res){
    res.render('./customer/SearchAnswerPage.html');
}
function checkOut(app,req,res){
    res.render('./customer/CheckOutPage.html');
}
function signUpVerificationNumber(app,req,res){
    res.render('./customer/SignUpVerificationNumberPage.html');
}
function signUpGiveNumber(app,req,res){
    res.render('./customer/SignUpGiveNumberPage.html');
}
function stripe(app,req,res){
    res.render('./customer/stripe.html');
}
function userSignUpComplete(app,req,res){
    res.render('./customer/UserSignUpCompletePage.html')
}
exports.getHomePage = homePage;
exports.getOrdersPage = ordersPage;
exports.getUserLoginPage = logInPage;
exports.getUserSignUpPage = signUp;
exports.getRestaurantsPage = restaurantsPage;
exports.getSearchRestaurants = searchRestaurants;
exports.getCheckOutPage = checkOut;
exports.getSignUpVerificationNumber = signUpVerificationNumber;
exports.getSignUpGiveNumber = signUpGiveNumber;
exports.getstripe = stripe;
exports.getUserSignUpComplete = userSignUpComplete;