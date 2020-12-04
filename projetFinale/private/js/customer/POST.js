
const Vonage = require('@vonage/server-sdk');
const vonage = new Vonage({
    apiKey:'a3692c76',
    apiSecret:'g9RXK0g39XfgIqVo'
}, {
    debug: true
});

const Nexmo = require('@vonage/server-sdk');
const nexmo = new Nexmo({
    apiKey:'a3692c76',
    apiSecret:'g9RXK0g39XfgIqVo'
}, {
    debug: true
});
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
exports.postUserLoggedIn = userLogIn;



/**
 Check if the user is in our database( with the email entered).

 if we found the email in the database.
  - we take the whole Json of the user (== parameter 'user').
  - then we check if the password entered and the password in the database match.

 if we didn't find the email or password
  - we return a message

  req.body.email = mail the user enterred
  req.body.password = password the user enterred


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

function phoneNumberVerification(app, req, res){
    nexmo.verify.request({
        number : req.body.phoneNumber,
        brand : 'GIQ'
    }, (err, result) => {
        if (err){
            console.error(err);
        }else {
            const verifyRequestId = result.request_id;
            console.log('request_id', verifyRequestId);
            res.render('./customer/SignUpVerificationNumberPage.html');
        }

    });

}

function codeCheck(app, req, res) {
    nexmo.verify.check({
        request_id: this.request_id,
        code: req.body.codeNumber
    }, (err, result) => {
        if (err){
            console.error(err);
        }else {
            console.log(result);
            res.render('./customer/MessagePage.html');
        }
    })
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
            res.json({ status : modifyItem(req) });
        })
        .catch(err =>{
            res.json({ status : false, msg : err.message});
        })
}



exports.postUserLoggedIn = userLogIn;
exports.postPhoneNumberVerification = phoneNumberVerification;
exports.postcodeCheck = codeCheck;
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
        const item = restaurant.items.find(item => item.name === req.body.itemName);
        if (item){
            item.quantity = req.body.quantity;
            return true;
        }else {
            throw `No such item as ${req.body.itemName}`;
        }
    }else {
        throw `No restaurant as ${req.body.restaurant}`;
    }
}