const { userModel, orderModel } = require("./../general/schemas");
const bcrypt = require('bcrypt');
const {addItemToBasketBodyParser} = require("../general/functions");
const {findWithPromise} = require("../general/functions");
const {sendVerification} = require("../apis/phoneAPI");

function userLogIn(app, req, res){
    userLoggingCheck(req)
        .then(() => { res.redirect('/'); })
        .catch((err) => { res.render('./customer/UserLoginPage.html', {loginError: err.message}) });
}

/********* Function called by userLogIn(...) *******************/


/**
 * Check if the user is in our database( with the email entered).

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
 * @param phoneNumberString
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
 * Verify the number then goes to the sign up completing Page if the number is in a correct form
 * @param app
 * @param req
 * @param res
 */

function phoneNumberCheck (app, req, res){
    if (req.body.phoneNumber[0] !== '3' || req.body.phoneNumber[1] !=='2'){
        res.render('./customer/SignUpGiveNumberPage.html', {phoneNumberError: "Please start with 32..."});
    }else{
        if (req.body.phoneNumber.length !== 10){
            res.render('./customer/SignUpGiveNumberPage.html', {phoneNumberError: "Please a valid number"});
        }else{
            phoneNumberAlreadyUsed(req.body.phoneNumber)
                .then((check) => {
                    if (check.status){
                        res.render('./customer/SignUpGiveNumberPage.html', {phoneNumberError: check.msg})
                    }else{
                        req.session.phoneNumber = req.body.phoneNumber;
                        const message = sendVerification(req.body.phoneNumber);
                        //TODO

                    }
                })
        }
    }
}

/**
 * Checks if the number is already used in the db
 * @param emailString
 * @returns {Promise|PromiseLike<emailAlreadyUsed>|Promise<emailAlreadyUsed>}
 */

function emailAlreadyUsed(emailString){
    return userModel.findOne({ email : emailString })
        .then((user) => {
            if (user) {
                this.msg = emailString + " is already used";
                this.status = true;
            }else{
                this.status = false;
            }
            return this;
        });
}

/**
 * Check the email and return false if the email is not used
 * @param app
 * @param req
 * @param res
 * @return false or render the page with an error
 */
function emailCheck(app,req,res){
    emailAlreadyUsed(req.body.email)
        .then((check) => {
            if(check.status){
                res.render('./customer/UserSignUpCompletingPage.html', {userRegisterError: check.msg});
            }else{
                return false;
            }
        })
        .catch(err => {
            console.log(err);
        })
}

/**
 * Checks if the confirm password is the same as the inital one
 * @param app
 * @param req
 * @param res
 * @return {boolean}
 */
function confirmPasswordCheck(app,req,res){
    if (req.body.confirmPassword !== req.body.password){
        res.render('./customer/UserSignUpCompletingPage.html', {userRegisterError: "Your passwords don't match"});
    }else {
        return true;
    }
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
    if(!emailCheck(app,req,res)) {
        userEmail = req.body.email;
    }
    const userPassword = req.body.password;
    const saltRounds = 10;
    //hashed password + adding the user in the db
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
                else {res.render('./customer/Homepage.html', {loggedIn : true , name: user.name});
                req.session.user = user;}
            });
        });
    }


}

function addItemToBasket(app, req, res){
    console.log(req.body);
    console.log("--------------------------------");
    addItemToBasketBodyParser(req.body)
        .then((itemObject) => {
            console.log(itemObject);
            if (req.session.basket){
                let restaurant = req.session.basket.restaurants.find( restaurant => restaurant.restaurant === req.body.restaurantName );
                if (restaurant){
                    let item = restaurant.items.find(item => item.name === req.body.itemName);
                    if (item) return res.json(`The item ${item.name} already exist in your basket. Please if you want to modify it then remove the one existing already.`)
                    restaurant.items.push(itemObject);
                    restaurant.total += parseFloat(req.body.total);
                } else{
                    req.session.basket.restaurants.push({
                                                            restaurant : req.body.restaurantName,
                                                            items : [ itemObject ],
                                                            total : parseFloat(req.body.total)
                                                        });
                }
                console.log(req.body);
                req.session.basket.totalAmount += parseFloat(req.body.total);
                req.session.basket.totalItems += parseInt(req.body.quantity);
            } else {
                req.session.basket =
                    {
                        totalAmount : parseFloat(req.body.total),
                        totalItems : itemObject.quantity,
                        restaurants :   [
                                            {
                                                restaurant : req.body.restaurantName,
                                                items : [ itemObject ],
                                                total : parseFloat(req.body.total)
                                            }
                                        ]
                    }
            }
            return res.json({ status : true });
        })
        .catch((err) => {
                const errorMessage = (err instanceof Object) ? err.message : err;
                res.json({ status : false, msg : errorMessage});
            })
}


/**
 * Modifies the current basket in the session. Responds to the request with an object
 * containing an instance status (boolean) and (msg).
 * @param app : express app.
 * @param req : request.
 * @param res : response.
 */
function modifyAnItemOfTheBasket(app, req, res){
    checkTheInputs(req.body)
        .then(() =>{
            res.json({ status : modifyItem(req),
                        totalAmount : req.session.basket.totalAmount,
                        totalItems : req.session.basket.totalItems,
            });
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
            restaurant.total = roundTo2Decimals(restaurant.total - ( quantityDifference * item.unityPrice));
            req.session.basket.totalItems -= quantityDifference;
            req.session.basket.totalAmount = roundTo2Decimals(req.session.basket.totalAmount - (quantityDifference * item.unityPrice));
            item.quantity = parseInt(req.body.quantity);
            if (item.quantity === 0){
                restaurant.items = restaurant.items.filter( value => value.name !== item.name );
                req.session.basket.restaurants = req.session.basket.restaurants.filter(value => value.items.length > 0);
                if (req.session.restaurants.length === 0) req.session.restaurants = undefined;
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
                    .catch(() => { res.json({ status : false, msg : "Sorry an error occurred we are going to fix it retry later."})})
            }).catch((err) => {
                const errorMessage = (err instanceof Object) ? err.message : err;
                res.json({ status : false, msg : errorMessage });
            })
    }else {
        res.json({  status : false ,
                    msg : `The building you selected ${req.body.building} isn't valid. 
                           Please select between the suggested building. `});
    }
}
/**
 * This function check if what the user wants to reorder still in our database. Most importantly,if they exist.
 *  
 * @param {Object} req : Full order details 
 * @param {JSON file} res: containing status and (or ) error message.  {status: true/False, msg: error} 
 * 
 * If everything is okay, add the order to the basket and return status.
 * 
 * If not, return status (false) and the error occured.
 * 
 */
function checkBeforeReordering(app, req, res) {
    
    const data = JSON.parse(req.body.order);
    const order =  new orderModel(data);

    order.check()
        .then(() => {
            req.session.basket = data;
            res.json({status: true});
        })
        .catch((error) => {

            const errorMessage = (error instanceof Object) ? error.message : error;
            res.json({status: false, msg : errorMessage});
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

function roundTo2Decimals(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100
}
