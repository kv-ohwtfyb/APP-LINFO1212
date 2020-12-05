const { restaurantModel } = require('./../general/schemas');

function homePage(app, req, res){
    restaurantModel.arrayOfRestaurantsForDisplay().then((array) => {
        res.render('./customer/Homepage.html', {
            restaurants : array ,
            loggedIn : req.session.user || null,
            basket : req.session.basket
            }
        );
    });
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
    const searchString = req.query.search
    if (!stringContainNumbers(searchString)){
        const dbSearch = restaurantModel.find({ $text: { $search: searchString }},
                                            { score: { $meta: "textScore" }})
                                      .sort({ score: { $meta: "textScore" } });
        dbSearch.then((result) => {
            if (result){
                const formattedResults = restaurantModel.arrayOfRestaurantsForDisplay(result);
                res.render('./customer/SearchAnswerPage.html', {
                    search : req.query.search, loggedIn : req.session.user || null,
                    basket : req.session.basket, restaurants : formattedResults
                                            });
            }else{
                res.render('./customer/SearchAnswerPage.html', {
                    search : req.query.search, loggedIn : req.session.user || null,
                    basket : req.session.basket,
                });
            }
        });
    }
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
    res.render('./customer/MessagePage.html')
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
exports.getStripe = stripe;
exports.getUserSignUpComplete = userSignUpComplete;

/**
 * Tests if the given string has numbers in it.
 * @param string (String)
 * @return {boolean}
 */
function stringContainNumbers(string){
    const regex = /\d/g;
    return regex.test(string);
}