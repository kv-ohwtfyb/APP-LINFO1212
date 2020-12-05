const {userModel} = require("./../general/schemas");

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
    await userModel.findOne({email: req.body.mail})
        .then((user) => {
            if (user) {
                if (user.password === req.body.password) {
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
    return toReturn;
}
function phoneNumberCheck(app,req,res) {
    const phone_input = req.body.phoneNumber;
    if (phone_input[0] === "0" && phone_input[1] === "4") {
        if (phone_input.length === 10) {
            session.currentPhoneNumber = phone_input;
            res.render('/user_signup', session.currentPhoneNumber);
        } else {
            res.render('./customer/SignUpGiveNumberPage.html', {phoneNumberError: "Please a valide number"});
        }
    } else {
        res.render('./customer/SignUpGiveNumberPage.html', {phoneNumberError: "Please start with 04..."});
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
exports.addItemToBasket = addItemToBasket
exports.modifyAnItemOfTheBasket = modifyAnItemOfTheBasket

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
