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




/* 
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
 * Verify the number then continues
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
                        res.redirect('/user_signup');
                    }
                })
        }
    }

}

exports.postUserLoggedIn = userLogIn;
exports.postPhoneNumberCheck = phoneNumberCheck;

