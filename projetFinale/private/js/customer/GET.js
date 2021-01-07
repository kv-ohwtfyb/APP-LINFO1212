const { userModel, restaurantModel } = require('./../general/schemas');

/**
 * Renders the login page
 * @param app
 * @param {Object} req
 * @param res
 */
function homePage(app, req, res){
    restaurantModel.arrayOfRestaurantsForDisplay().then((array) => {
        res.render('./customer/Homepage.html', {
            restaurants : array,
            loggedIn : req.session.user || null,
            basket : req.session.basket,
            loggedInAsASeller :  req.session.restaurant
            }
        );
    });
}

/**
 * Renders the user's orders history page.
 * @param app
 * @param {Object} req
 * @param res
 */
function ordersPage(app,req,res){
    userModel.findById(req.session.user._id)
        .then((user) => {
            user.getArrayOfOrders()
                .then( (array) => {
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

/**
 * Sends a JSON file to the request containing all the infos
 * about the order that matches the keys req.query body.
 * @param {expressApp}app
 * @param {Object}req
 * @param res
 */
function seeFullOrders(app, req, res) {
    orderModel.findById(req.query)
        .then((result) => {
            if (result) {
                res.json({status: true, data : result});
            } else {
                res.json({status: false , data : "Sorry, Order requested might not exist"});
            }
        })
        .catch((error) => {
            res.json({status: false, data : error.message});
        })
}

/**
 * Renders the login form page.
 * @param app
 * @param req
 * @param res
 */
function logInPage(app,req,res){
    res.render('./customer/UserLoginPage.html');
}

/**
 * Renders the sign up form that contains a form that takes in the name, email and password.
 * @param app
 * @param req
 * @param res
 */
function signUp(app, req, res){
    res.render('./customer/UserSignUpCompletingPage.html');
}

/**
 * Renders the restaurant view page that contains all the categories and items of a shop. the name of the shop should be
 * in the req.query Object
 * @param app
 * @param {Object} req : Object { ... name : <restaurantName> }
 * @param res
 */
function aRestaurantViewPage(app, req, res){
    restaurantModel.findOne({ name : req.query.name }).then((rest) => {
        restaurantModel.findById(rest._id).then(async (restaurant) => {
            const restaurantObject = await restaurant.getRestaurantView();
            res.render('./customer/RestaurantViewPage.html', {
                restaurant : restaurantObject,
                basket : req.session.basket,
                groups : restaurantObject.groups,
                loggedIn : req.session.user, 
            });
        })
    })
}

/**
 * Renders the page that contains the restaurants that matches the search/filter/budget.
 * These restaurants can be sorted according to the metadata xor to the budget if the budget is the req.query Object
 * @param app
 * @param {Object} req Object { ... search : <The string in the search bar>, regime : <Selected regime in the filter>,  }
 * @param res
 */
function searchRestaurants(app,req,res){
    const searchString = req.query.search || req.query.regime; //Checks if there's some text to search
    let dbSearch;
    if (searchString){ // If there's the text then
        dbSearch = restaurantModel.find({ $text: { $search: searchString }},
                                            { score: { $meta: "textScore" }})
                                      .sort({ score: { $meta: "textScore" }});
    }else{ //Else that means the user triggered the search with a budget
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

/**
 * Sends an API response object , which is the document of the item in the database.
 * @param app
 * @param {Object} req { ... restaurantName : <the_restaurant_where_the_item_is_registered>, itemName : <the_name_of_the_restaurant> }
 * @param res
 */
function getItemSpecifications(app, req, res){
    restaurantModel.findOne({ name : req.query.restaurantName})
        .then((restaurant) => {
            restaurant.getItem(req.query.itemName, true)
                .then((item) => {
                    if (item) res.json({ status : true, data : item});
                    else res.json({ status : false, msg : `There's no item called ${req.query.itemName} in ${req.query.restaurantName} store.` });
                })
        }).catch((err) => {
            const errorMessage = (err instanceof Object) ? err.message : err;
            res.json({ status : false, msg : errorMessage });
    })
}

/**
 * Sends the checkout page, which has a form that takes in the building in which the order should be sent
 * and the date on which the client can order.
 * @param app
 * @param req
 * @param res
 */
function checkOut(app,req,res){
    const date = new Date();
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate()+1);
    console.log(req.session.basket);
    res.render('./customer/CheckOutPage.html', {
        basket : req.session.basket,
        dateMin : ( date.getHours() >= 12 ) ? tomorrow.toISOString().slice(0,10) : date.toISOString().slice(0,10)
    });
}

/**
 *
 * @param app
 * @param req
 * @param res
 */
function signUpVerificationNumber(app,req,res){
    res.render('./customer/SignUpVerificationNumberPage.html');
}

/**
 * Renders the page on which the user enters his phone number.
 * @param app
 * @param req
 * @param res
 */
function signUpGiveNumber(app,req,res){
    res.render('./customer/SignUpGiveNumberPage.html');
}

/**
 * Renders the page that welcomes you to a page that congrats you for signing up.
 * @param app
 * @param req
 * @param res
 */
function userSignUpComplete(app,req,res){
    res.render('./customer/MessagePage.html')
}

exports.getHomePage = homePage;
exports.getOrdersPage = ordersPage;
exports.getCustomerFullOrders = seeFullOrders;
exports.getUserLoginPage = logInPage;
exports.getUserSignUpPage = signUp;
exports.getRestaurantsPage = aRestaurantViewPage;
exports.getSearchRestaurants = searchRestaurants;
exports.getCheckOutPage = checkOut;
exports.getSignUpVerificationNumber = signUpVerificationNumber;
exports.getSignUpGiveNumber = signUpGiveNumber;
exports.getUserSignUpComplete = userSignUpComplete;
exports.getUserRestaurantViewItemSpecification = getItemSpecifications;