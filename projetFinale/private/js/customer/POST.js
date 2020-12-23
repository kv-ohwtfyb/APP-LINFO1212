const { userModel, orderModel } = require("./../general/schemas");
const bcrypt = require('bcrypt');
const { addItemToBasketBodyParser } = require("../general/functions");

/**
 * Redirects to the homepage if the data in the req.body match a user in teh database.
 * Else renders the login page with the error that
 * @param app
 * @param req
 * @param res
 */
function userLogIn(app, req, res){
    userLoggingCheck(req)
        .then(() => { res.redirect('/'); })
        .catch((err) => { res.render('./customer/UserLoginPage.html', {loginError: err.message}) });
}

/**
 * Check if the user is in our database( with the email entered ).

 if we found the email in the database.
  - we take the whole Json of the user (== parameter 'user').
  - then we check if the password entered and the password in the database match.

 if we didn't find the email or password
  - we return a message

  req.body.email = mail the user entered
  req.body.password = password the user entered
 * @param req
 * @return {Promise|PromiseLike<void>|Promise<Object>}
 * @throws Errors if the email is not registered, or the passwords don't match.
 */
function userLoggingCheck(req){
    return userModel.findOne({ email: req.body.mail })
        .then((user) => {
            if (user) {
                 return bcrypt.compare(req.body.password, user.password)
                     .then((result) => {
                        if(result){
                            req.session.user = user;
                        } else {
                            throw Error("Password Invalid");
                        }
                    })
                    .catch((err) => { throw err });
            } else {
                throw Error("E-mail Invalid");
            }
        })
        .catch((err) => { throw err ;});
}


/**
 * Check if the phone Number is already used
 * @param {String} phoneNumberString
 * @returns {Promise|PromiseLike<phoneNumberAlreadyUsed>|Promise<phoneNumberAlreadyUsed>}
 */
function phoneNumberAlreadyUsed(phoneNumberString) {
    return userModel.findOne({ phone : phoneNumberString })
        .then((user) => {
            if (user) {
                this.msg = phoneNumberString + " number is already used";
                this.status = true;
            }else{
                this.status = false;
            }
            return this;
        });
}

/**
 * Verify the number then goes to the sign up completing Page if the number is in a correct form.
 * If the phone number is correct then its added in the session for further use.
 * @param app
 * @param req
 * @param res
 */
function phoneNumberCheck (app, req, res){
    if (req.body.phoneNumber[0] !== '3' || req.body.phoneNumber[1] !=='2' || isNaN(req.body.phoneNumber) || req.body.phoneNumber.length < 11){
        res.render('./customer/SignUpGiveNumberPage.html', {phoneNumberError: "Please enter a valid phone number that starts with start with 32..."});
    }else{
        phoneNumberAlreadyUsed(req.body.phoneNumber)
            .then((check) => {
                if (check.status){
                    res.render('./customer/SignUpGiveNumberPage.html', { phoneNumberError: check.msg })
                }else{
                    req.session.phoneNumber = req.body.phoneNumber;
                    res.render('./customer/UserSignUpCompletingPage.html');
                }
            })
    }
}


/**
 * Checks if the email is already used in the db.
 * @param {String} emailString
 * @returns {Promise|PromiseLike<emailAlreadyUsed>|Promise<emailAlreadyUsed>}
 */
function emailAlreadyUsed(emailString){
    return userModel.findOne({ email : emailString })
        .then((user) => {
            if (user) {
                this.status = true;
            }else{
                this.status = false;
            }
            return this;
        });
}

/**
 * Check the email and return false if the email is not used.
 * @param app
 * @param req
 * @param res
 * @return false if the email is not used in the database or render the page with an error.
 */
function emailCheck(app, req, res){
    emailAlreadyUsed(req.body.email)
        .then((check) => {
            return check.status;
        })
        .catch(err => {
            return false;
        })
}

/**
 * Checks if the confirm password and the password are the same.
 * @param app
 * @param req
 * @param res
 * @return {boolean}
 */
function confirmPasswordCheck(app, req, res){
    return req.body.confirmPassword === req.body.password;
}

/**
 * Register the user if everything is ok!
 * @param app
 * @param req
 * @param res
 */
function userRegister(app,req,res){
    const userName = req.body.name;
    //Checking if the email is already used
    let userEmail;
    if(!emailCheck(app, req, res)) {
        userEmail = req.body.email;
    }else{
        res.render('./customer/UserSignUpCompletingPage.html', {userRegisterError: req.session.email + " already used."});
    }
    const userPassword = req.body.password;
    const saltRounds = 10;

    if (confirmPasswordCheck(app,req,res)){
        bcrypt.hash(userPassword, saltRounds, (err, hash) => {
            //add the user in the database
            const user = userModel({
                name : userName,
                email : req.body.email,
                phone : req.session.phoneNumber,
                password : hash
            });
            user.save(function (err,user){
                if(err){res.render('./customer/UserSignUpCompletingPage.html', {userRegisterError: err});}
                else {
                    req.session.user = user;
                    res.redirect('/');
                }
            });
        });
    }else {
        res.render('./customer/UserSignUpCompletingPage.html', {userRegisterError: "Your passwords don't match"});
    }
}

/**
 * Executes the functions necessarily for adding item in the basket.
 * @param app
 * @param req
 * @param res
 */
function addItemToBasket(app, req, res){
    addItemToBasketBodyParser(req.body)
        .then((itemObject) => {
            if (req.session.basket){
                let restaurant = req.session.basket.restaurants.find( restaurant => restaurant.restaurant === req.body.restaurantName );
                if (restaurant){
                    let item = restaurant.items.find(item => item.name === req.body.name);
                    if (item) return res.json({status : false, msg :`The item ${item.name} already exist in your basket. Please if you want to modify it then remove the one existing already.`});
                    restaurant.items.push(itemObject);
                    restaurant.total += itemObject.total;
                } else{
                    req.session.basket.restaurants.push({
                                                            restaurant : req.body.restaurantName,
                                                            items : [ itemObject ],
                                                            total : itemObject.total
                                                        });
                }
                req.session.basket.totalAmount += itemObject.total;
                req.session.basket.totalItems += itemObject.quantity;
            } else {
                req.session.basket =
                    {
                        totalAmount : itemObject.total,
                        totalItems : itemObject.quantity,
                        restaurants :   [
                                            {
                                                restaurant : req.body.restaurantName,
                                                items : [ itemObject ],
                                                total : itemObject.total
                                            }
                                        ]
                    }
            }
            return res.json({ status : true });
        })
        .catch((err) => {
                const errorMessage = (err instanceof Object) ? err.message : err;
                return res.json({ status : false, msg : errorMessage});
            })
}


/**
 * Modifies the current basket in the session. Responds to the request with an object
 * containing an instance status (boolean) and (msg).
 * @param app : app.
 * @param req : request.
 * @param res : response.
 */
function modifyAnItemOfTheBasket(app, req, res){
    checkTheInputs(req.body)
        .then(() =>{
            let options = { status : modifyItem(req), }
            options.totalAmount = (req.session.basket) ? req.session.basket.totalAmount : 0;
            options.totalItems = (req.session.basket) ? req.session.basket.totalItems : 0;
            res.json(options);
        })
        .catch(err =>{
            res.json({ status : false, msg : err.message});
        })
}



/**
 * Checks the body of the request
 * @param body
 * @return {Promise<void>}
 */
async function checkTheInputs(body){
    if (!(body.hasOwnProperty('restaurant'))) throw new Error("No restaurant key was in the request body.");
    if (!(body.hasOwnProperty('itemName'))) throw new Error("No itemName key was in the request body.");
    if (!(body.hasOwnProperty('quantity'))) throw new Error("No quantity key was in the request body.");
    if (body.quantity < 0) throw new Error("Quantity must be greater or equal to 0");
}

/**
 * Modifies the current session basket.
 * @param req : request.
 * @return {boolean} true if the chang has been made.
 * @throws Error if there's a problem when updating
 */
function modifyItem(req){
    const restaurant = req.session.basket.restaurants.find( restaurant => restaurant.restaurant === req.body.restaurant );
    if(restaurant){
        let item = restaurant.items.find(item => item.name === req.body.itemName);
        if (item){
            const quantityDifference = (item.quantity - parseInt(req.body.quantity));
            restaurant.total -= roundTo2Decimals( quantityDifference * item.unityPrice);
            restaurant.total = roundTo2Decimals(restaurant.total);
            req.session.basket.totalAmount -= roundTo2Decimals(quantityDifference * item.unityPrice);
            req.session.basket.totalAmount = roundTo2Decimals(req.session.basket.totalAmount);
            req.session.basket.totalItems -= quantityDifference;
            item.quantity = parseInt(req.body.quantity);
            item.total = roundTo2Decimals(quantityDifference * item.unityPrice);
            item.total = roundTo2Decimals(item.total);
            if (item.quantity === 0){
                restaurant.items = restaurant.items.filter( value => value.name !== item.name );
                req.session.basket.restaurants = req.session.basket.restaurants.filter(value => value.items.length > 0);
                if (req.session.basket.restaurants.length === 0) req.session.basket = undefined;
            }
            return true;
        }else {
            throw new Error(`No such item as ${req.body.itemName} in the basket`);
        }
    }else {
        throw new Error(`No restaurant as ${req.body.restaurant} in the basket`);
    }
}


function orderConfirm(app, req, res){
    const dateValidation = checkDate(req.body.date);
    const buildings  = [ "Montesquieu", "Agora" ,"Studio" ,"Sainte-Barbe", "Cyclotron",
                        "Leclercq", "Doyen", "Lavoisier", "Croix-du-sud", "ILV", "Mercator"];

    if (req.session.basket.restaurants.length === 0) {
        return res.json({ status: false, msg :"Make sure there's something in your basket" });
    }

    if (!dateValidation[0]){
        return res.json({ status: false, msg :"The date you entered is invalid." });
    }

    if (buildings.includes(req.body.building)){
        const orderObj = Object.assign(
                                { building : req.body.building,
                                         user : req.session.user._id.toString(),
                                         status : "Ongoing",
                                         date : dateValidation[1]
                                        }, req.session.basket);
        orderObj.total  = orderObj.totalAmount;
        delete orderObj.totalAmount; delete orderObj.totalItems;
        const order = new orderModel(orderObj);
        order.check()
            .then(() => {
                order.save()
                    .then(() => { res.json({ status : true }); })
                    .catch((err) => {

                        res.json({ status : false, msg : err.message });
                    })
            }).catch((err) => {
                const errorMessage = (err instanceof Object) ? err.message : err;
                res.json({ status : false, msg : errorMessage });
            });
        
        delete req.session.basket;
     }else {
        res.json({  status : false ,
                    msg : `The building you selected ${req.body.building} isn't valid. 
                           Please select between the suggested building. `});
    }
}
/**
 * This function check if what the user wants to reorder is still in our database.
 * Most importantly, if they have the same prices and groups.
 *
 * If everything is correct it it sends a JSON file with status on true,
 * else status false therefore the file contains a msg key that hold the message.
 *
 * @param app
 * @param {Object} req : Full order details
 * @param {Object} res: containing status and (or ) error message.  {status: true/False, msg: error}
 *
 * If everything is okay, add the order to the basket and return status.
 *
 * If not,
 *
 */
function checkBeforeReordering(app, req, res) {

    orderModel.findOne( { _id : req.body.orderId } ).then((obj) => {
        if (!obj.toObject()) return res.json( { status: false, msg : "There's no order under the given id."} );
        const order = new orderModel(obj);
        order.check()
            .then(() => {
                const basket = Object.assign({}, obj.toObject());
                delete basket.building; delete basket._id; delete basket.user; delete basket.date;
                basket.totalAmount = obj.total;
                delete basket.total; delete basket.__v; delete basket.doneRestaurants; delete basket.cancelRestaurants;
                req.session.basket = basket;
                res.json({status: true});
            })
            .catch((error) => {
                const errorMessage = (error instanceof Object) ? error.message : error;
                res.json({status: false, msg : errorMessage});
            })
    })
}

exports.postUserLoggedIn = userLogIn;
exports.addItemToBasket = addItemToBasket;
exports.postPhoneNumberCheck = phoneNumberCheck;
exports.postUserRegister = userRegister;
exports.userLoggingCheck = userLoggingCheck;
exports.modifyAnItemOfTheBasket = modifyAnItemOfTheBasket;
exports.postCheckOut = orderConfirm;
exports.postCheckBeforeReOrdering = checkBeforeReordering;

/**
 * Checks if the date given respects the date constraints explained in the report.
 * @param {string} givenDateString
 * @returns {(boolean|Date)[]|boolean[]}
 */
function checkDate(givenDateString){
    const arrayDate = givenDateString.split("-");
    const givenDate = new Date( parseInt(arrayDate[0]),
                                parseInt(arrayDate[1])-1,
                                parseInt(arrayDate[2]));
    const today = new Date();
    if (givenDate.getFullYear() >= today.getFullYear()){
        if (givenDate.getMonth() >= today.getMonth()){
            if (today.getHours > 12){
                if (givenDate.getDate() > today.getDate()){
                    return [true, givenDate]
                }
            }else {
                if (givenDate.getDate() >= today.getDate()){
                    return [true, givenDate]
                }
            }
        }
    }
    return [false, null];
}

/**
 * Rounds the num in the to 2 digits after the decimals.
 * @param {number} num
 * @returns {number}
 */
function roundTo2Decimals(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100
}