const {userModel} = require("./schemas");

function userLogIn(app, body, req,res){
    const email = body.mail;
    const pswd  = body.password;
    const user  = userModel.find({email: email});
    if (user === {}) {
        
}



exports.postUserLoggedIn = userLogIn;