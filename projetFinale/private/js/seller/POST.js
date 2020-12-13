const { userModel, restaurantModel, groupModel, categoryModel } = require('./../general/schemas');
const { savingImageToModel, getItemSpecFromReqBody, getGroupSpecFromReqBody } = require('./../general/functions');
const { userLoggingCheck } = require('./../customer/POST');
const bcrypt = require('bcrypt');

function sellerLogin(app, req, res){
    if (!(req.session.user)){ //If not logged in
        userLoggingCheck(req)
            .then(() => {
                    sellerLogInCheck(req.session.user, req)
                        .then(() => { res.redirect('/dashboard'); })
                        .catch((error) => {
                            res.render('./seller/SellerLoginPage.html',
                                { loginError: error.message, loggedIn : req.session.user });
                        });
                })
            .catch((error) =>{
                    res.render('./seller/SellerLoginPage.html',
                        { loginError: error.msg, loggedIn : req.session.user });
                });
    }else{
        sellerLogInCheck(req.session.user, req)
            .then(() => { res.redirect('/dashboard'); })
            .catch((error) => {
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
            })
            .catch((err) => {
                res.render('./Seller/CreateRestaurantSpeci.html',
                    { Error : err.message });
            });
    })
}


function addItem(app, req, res){
    restaurantModel.findById(req.session.restaurant._id).then((restaurant) => {
        if (restaurant){
            const itemSpec = getItemSpecFromReqBody(req.body);
            restaurant.addItem(itemSpec)
                .then(() => {
                    if (req.body.categories.length > 0 ) {
                        const categories = req.body.categories.split("|").slice(0,-1);
                        if (categories){
                            categories.forEach((name) =>{
                                restaurant.addItemToCategory(name, itemSpec.name);
                            })
                        }
                    }
                    res.redirect('/dashboard');
                })
                .catch(async (error) => {
                    const listOfGroups = await restaurant.listOfGroupNames();
                    const listOfCategories = await restaurant.listOfCategoriesNames();
                    const options = await Object.assign({
                            Error : error.message,
                            listOfCategories : listOfCategories,
                            listOfGroups : listOfGroups,
                            categories : req.body.categories.split("|").slice(0,-1)
                            },itemSpec);
                    res.render('./seller/AddOrModifyItem.html', options);
                });
        }else{
            res.render('./seller/SellerLoginPage.html',
                { Error : "Your restaurant seems to no longer exist in pur database. Contact us"});
        }
    })
}

function addGroup(app, req, res){
    restaurantModel.findById(req.session.restaurant._id).then((restaurant) => {
        const group = getGroupSpecFromReqBody(req.body);
        restaurant.addGroup(new groupModel(group))
            .then(() => {
                res.redirect('/my_store');
            })
            .catch(async (err) => {
                const errorMessage = (err instanceof Object) ? err.message : err;
                const listOfItems = await restaurant.getArrayOfItemsName();
                const options = await Object.assign(
                    {
                                Error : errorMessage,
                                listOfItems : listOfItems,
                            },group)
                res.render('./seller/AddOrModifyGroup.html', options);
        });
    })
}

function addCategory(app, req, res){
    restaurantModel.findById(req.session.restaurant._id)
        .then((restaurant) => {
        restaurant.addCategory(new categoryModel(req.body))
            .then(() => {
                res.redirect('/my_store');
            })
            .catch((err) =>{
                const errorMessage = (err instanceof Object) ? err.message : err;
                const options  = Object.assign({Error : errorMessage}, req.body);
                res.render('./seller/AddOrModifyGroup.html', options);
        })
    })
}

exports.postSellerLogin = sellerLogin;
exports.postCreatingRestaurant = creatingRestaurant;
exports.postAddItem = addItem;
exports.postAddGroup = addGroup;
exports.postAddCategory = addCategory;

async function sellerLogInCheck(user, req){
    let User = await userModel.findById(req.session.user._id).exec();
    return User.getSellerRestaurant(req.body.authKey)
        .then((restaurant) => {
            if (restaurant) req.session.restaurant = restaurant;
        })
        .catch((error) => {throw error;});
}

function formatRemoveWhiteSpaces(name) {
    return name.trim().replace(/\s/g, "");
}
