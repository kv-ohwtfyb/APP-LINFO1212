const { getItemSpecFromReqBody, setVirtualImageSrc } = require("../general/functions");
const { userModel, restaurantModel } = require('./../general/schemas');

function homePage(app, req, res){
    restaurantModel.arrayOfRestaurantsForDisplay().then((array) => {
        res.render('./customer/Homepage.html', {
            restaurants : array,
            loggedIn : req.session.user || null,
            basket : req.session.basket
            }
        );
    });
}
/********* For returning a list of orders of a user *******************/

/**
 * !!!!!!!!!!!! a retravailler
 * Call a function that check all orders of a certain user.
 *
 * Then render a page with a list of orders the use has ever ordered or an empty list if the user hasn't ordered anything.
 * */
function ordersPage(app,req,res){
    /*
    const user = req.session.user;
    userModel.find({name: user.name}, function (err, doc) {
        if(err){
            res.json(err);
        } else {
            res.render('./customer/OrdersPage.html', {
                loggedIn: true,
                name: user.name,
                orders: user.orders,
                restaurants: user.orders.restaurant
            });
        }
    })
    .catch((err) => { console.log(`Caught by .catch ${err}`);});
    */

    userModel.findById(req.session.user._id).then((user) => {

        user.getArrayOfOrders().then( (array) => {
            res.render('./customer/OrdersPage.html', {
                loggedIn: user,
                orderList : array
            })
        })
    })
        .catch((err) => {
            console.log(`Caught by .catch ${err}`);
        });


}

function logInPage(app,req,res){
    res.render('./customer/UserLoginPage.html');
}
function signUp(app,req,res){
    res.render('./customer/UserSignUpCompletingPage.html');
}
function restaurantsPage(app,req,res){
    restaurantModel.findOne({ name : req.query.name }).then((rest) => {
        restaurantModel.findById(rest._id).then(async (restaurant) => {
            const restaurantObject = await restaurant.getRestaurantView();
            restaurantObject.items.price = (1 - (restaurantObject.items.promo / restaurantObject.items.price));
            console.log(restaurantObject);
            res.render('./customer/RestaurantViewPage.html', {
                restaurant : restaurantObject,
                basket : req.session.basket,
            });
        })
    })
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
