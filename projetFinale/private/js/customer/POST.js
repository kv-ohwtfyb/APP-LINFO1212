const {userModel} = require("./../general/schemas");
const bcrypt = require('bcrypt');

function userLogIn(app, req, res){
    userLoggingCheck(req)
        .then((check) => {
            if (check.status) {
                res.redirect('/');
            } else {
                res.render('./customer/UserLoginPage.html', {loginError: check.msg});
            }
    });
}



/********* Function called by userLogIn(...) *******************/


/**
 Check if the user is in our database( with the email entered).

 if we found the email in the database.
  - we take the whole Json of the user (== parameter 'user').
  - then we check if the password entered and the password in the database match.

 if we didn't find the email or password
  - we return a message

  req.body.email = mail the user entered
  req.body.password = password the user entered
*/
async function userLoggingCheck(req){
    const toReturn = this;
    if(req.body.mail){
        await userModel.findOne({email: req.body.mail})
            .then((user) => {
                if (user) {
                    if (bcrypt.compare(req.body.password, user.password)){
                        toReturn.status = true;
                        req.session.user = user;
                    } else {
                        toReturn.msg = "Password Invalid";
                        toReturn.status = false;
                    }
                } else{
                    toReturn.msg = "E-mail Invalid";
                    toReturn.status = false;
            }
        });
    } else {
        toReturn.msg = "Complete the form, Please";
        toReturn.status = false;
    }
    return toReturn;
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
    if (req.body.phoneNumber[0] !== '0' || req.body.phoneNumber[1] !=='4'){
        res.render('./customer/SignUpGiveNumberPage.html', {phoneNumberError: "Please start with 04..."});
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
                        res.redirect('/user_signup');
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
                else {res.render('./customer/HomePage.html', {loggedIn : true , name: user.name});
                req.session.user = user;}
            });
        });
    }


}

function addItemToBasket(app, req, res){
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


exports.postUserLoggedIn = userLogIn;
exports.addItemToBasket = addItemToBasket;
exports.modifyAnItemOfTheBasket = modifyAnItemOfTheBasket;


/**
 * Checks the body of the request
 * @param body
 * @return {Promise<void>}
 */
async function checkTheInputs(body){
    if (!(body.hasOwnProperty('restaurant'))) throw Error("No restaurant key was in the request body.");
    if (!(body.hasOwnProperty('itemName'))) throw Error("No itemName key was in the request body.");
    if (!(body.hasOwnProperty('quantity'))) throw Error("No quantity key was in the request body.");
    if (body.quantity < 0) throw Error("Quantity must be greater or equal to 0");
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
            req.session.basket.totalItems = req.session.basket.totalItems - quantityDifference;
            req.session.basket.totalAmount = req.session.basket.totalAmount - (quantityDifference * item.unityPrice);
            item.quantity = parseInt(req.body.quantity);
            if (item.quantity === 0){
                restaurant.items = restaurant.items.filter( value => value.name !== item.name );
                req.session.basket.restaurants = req.session.basket.restaurants.filter(value => value.items.length > 0);
            }
            return true;
        }else {
            throw `No such item as ${req.body.itemName}`;
        }
    }else {
        throw `No restaurant as ${req.body.restaurant}`;
    }
}

function restaurantView(app,req,res){

}

exports.postUserLoggedIn = userLogIn;
exports.addItemToBasket = addItemToBasket;
exports.modifyAnItemOfTheBasket = modifyAnItemOfTheBasket;
exports.postUserLoggedIn = userLogIn;
exports.postPhoneNumberCheck = phoneNumberCheck;
exports.postUserRegister = userRegister;
exports.userLoggingCheck = userLoggingCheck;
