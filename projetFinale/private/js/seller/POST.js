const { userModel, restaurantModel } = require('./../general/schemas');
const { savingImageToModel } = require('./../general/functions');
const { userLoggingCheck } = require('./../customer/POST');
const bcrypt = require('bcrypt');


function sellerLogin(app, req, res){
    if (!(req.session.user)){ //If not logged in
        userLoggingCheck(req)
            .then((result) =>{
                if (result.status){
                    sellerLogInCheck(req.session.user, req)
                        .then((check) => {
                            res.redirect('/dashboard');
                        })
                        .catch((error) => {
                            res.render('./seller/SellerLoginPage.html',
                                { loginError: error.message, loggedIn : req.session.user });
                        });
                }else {
                    res.render('./seller/SellerLoginPage.html',
                        { loginError: result.msg, loggedIn : req.session.user });
                }
        });
    }else{
        sellerLogInCheck(req.session.user, req)
            .then((check) => {
                res.redirect('/dashboard');
            })
            .catch((error) => {
                console.log(error);
                res.render('./seller/SellerLoginPage.html',
                    { loginError: error.message, loggedIn : req.session.user });
            });
    }
}

function creatingRestaurant(app, req, res){
    bcrypt.hash(req.body.authKey, 10, (err, hash) =>{
        const restaurant = new restaurantModel({
            name     : req.body.restoName,
            authKey  : hash,
            admin    : req.session.user._id,
            items    : "items"+ formatRemoveWhiteSpaces(req.body.restoName),
            orders   : "orders"+ formatRemoveWhiteSpaces(req.body.restoName),
            payments : "payments"+ formatRemoveWhiteSpaces(req.body.restoName),
        });
        if (req.body.frontImage){
            savingImageToModel(restaurant, req.body.frontImage)
        }
        restaurant.save()
            .then((restaurant) =>{
                console.log("Created the restaurant " + restaurant.name);
                req.session.restaurant = restaurant;
                res.redirect('/dashboard');
            });
    })
}


exports.postSellerLogin = sellerLogin;
exports.postCreatingRestaurant = creatingRestaurant;


async function sellerLogInCheck(user, req){
    let User = await userModel.findById(req.session.user._id).exec();
    return User.getSellerRestaurant(req.body.authKey)
        .then((restaurant) => {
            if (restaurant) req.session.restaurant = restaurant;
        })
        .catch((error) => {throw error;});
}

function formatRemoveWhiteSpaces(name) {
    return name.trim().replace(" ","");
}