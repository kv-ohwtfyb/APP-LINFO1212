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
function phoneNumberCheck(app,req,res){
    const phone_input = req.body.phoneNumber;
    if (phone_input[0] === "0" && phone_input[1] === "4"){
        if(phone_input.length === 10){
            session.currentPhoneNumber = phone_input;
            res.render('/user_signup', session.currentPhoneNumber);
        }else {
            res.render('./customer/SignUpGiveNumberPage.html', {phoneNumberError: "Please a valide number"});
        }
    }else {
        res.render('./customer/SignUpGiveNumberPage.html', {phoneNumberError: "Please start with 04..."});
    }

}

function postMessageSignUpComplete(app, req, res){
    res.render('./customer/MessagePage.html',{"signUpComplete" : true})
}
exports.postUserLoggedIn = userLogIn;
exports.postUserLoggedIn = userLogIn;
exports.postPhoneNumberCheck = phoneNumberCheck;
exports.postMessageSignUpComplete = postMessageSignUpComplete;

