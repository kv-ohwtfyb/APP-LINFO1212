const { restaurantModel } = require('./../general/schemas');
const { setVirtualImageSrc } = require('./../general/functions');

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
/********* For returning a list of orders of a user *******************/

/**
 * Call a function that check all orders of a certain user.
 *
 * Then render a page with a list of orders the use has ever ordered or an empty list if the user hasn't ordered anything.
 * */
function ordersPage(app,req,res){
    const user = req.session.user;
    if(user){
        res.render('./customer/OrdersPage.html', {
            loggedIn: true,
            name: user.name,
            orderId : '#hfj12f5f1f145',
            date : "Dec 08 2020",
            batiment: "Batiment Mihigo",
            status: "delivered",
            total: "2.80 €",
            msg: "This is where message of refuse will go",
            restaurants: [{
                restaurant : 'Quick',
                items: [{
                    name: "Durum",
                    unityPrice : 2.30,
                    quantity : 2
                }]
            }, 
            {
                restaurant : 'Mihigo',
                items: [{
                    name: "Chicken Wings",
                    unityPrice : 0.50,
                    quantity : 3
                }]
            }],
            });
    } else {
        res.redirect('/');
    }
    
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
    const searchString = req.query.search || req.query.regime; //Checks if there's some text to search
    let dbSearch;
    if (searchString){ // If there's the text then
        dbSearch = restaurantModel.find({ $text: { $search: searchString }},
                                            { score: { $meta: "textScore" }})
                                      .sort({ score: { $meta: "textScore" }});
    }else{ //Else that means the user triggered the website with a budget
        dbSearch = restaurantModel.find();
    }
    dbSearch.then((result) => {
        if (req.query.budget){// There's a budget constraint then we sort the result according to the constraint
            const budget = parseFloat(req.query.budget);
            if (parseFloat(req.query.budget) > 0 ){
                result.sort((a, b) => Math.abs(a.avgPrice - budget) -  Math.abs(b.avgPrice - budget));
            }
        }
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
