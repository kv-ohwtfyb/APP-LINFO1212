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
 * Call a function that check all orders of a certain user.
 *
 * Then render a page with a list of orders the use has ever ordered or an empty list if the user hasn't ordered anything.
 * */
function ordersPage(app,req,res){
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
/**
 * Return full details of an order.
 * By taking the Id of an order, this function search and return full order details.
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
            res.render('./customer/RestaurantViewPage.html', {
                restaurant : restaurantObject,
                basket : req.session.basket,
                groups : restaurantObject.groups,
                loggedIn : req.session.user, 
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

function checkOut(app,req,res){
    const date = new Date();
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate()+1);
    console.log(req.session.basket);
    res.render('./customer/CheckOutPage.html', {
        basket : req.session.basket,
        dateMin : ( date.getHours() >= 12 ) ? tomorrow.toISOString().slice(0,10) : date.toISOString().slice(0,10)
    });
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
exports.getCustomerFullOrders = seeFullOrders;
exports.getUserLoginPage = logInPage;
exports.getUserSignUpPage = signUp;
exports.getRestaurantsPage = restaurantsPage;
exports.getSearchRestaurants = searchRestaurants;
exports.getCheckOutPage = checkOut;
exports.getSignUpVerificationNumber = signUpVerificationNumber;
exports.getSignUpGiveNumber = signUpGiveNumber;
exports.getStripe = stripe;
exports.getUserSignUpComplete = userSignUpComplete;
exports.getUserRestaurantViewItemSpecification = getItemSpecifications;



