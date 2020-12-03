const {userModel, restaurantModel} = require('./../general/schemas');

function sellerLogin(app, req, res){

    sellerLogInCheck(req)
        .then((check) => {
            // Check contains the status of the process, and the msg in case of the a problem
            if (check.status) {
                res.redirect('/');
            } else {
                res.render('./Seller/SellerLoginPage.html', {loginError: check.msg})
            }
    });
};

exports.postSellerlogin = sellerLogin;














/**
 * check if what the user enterred is valid or not
 * @param req => email, password and the authentification key enterred. 
 */

async function sellerLogInCheck(req){
    const toReturn = this;
    await userModel.findOne({email:req.body.mail})
        .then((user) => {
            if (user) { //If the e-mail is valid
                if (user.password === req.body.password) { // If the password is valid
                    console.log(user.isSeller())
                    if (user.isSeller()) {
                        
                        this.status = true;                        
                    } else {
                        this.msg = "Your account is not Admin to any restaurant.";
                        this.status = false;
                    }
                } else if(req.body.password === ""){
                    this.msg = "Please enter a password";
                    this.status = false;

                } else {
                    this.msg = "Password Invalid";
                    this.status = false;
                }
                
            } else {
                this.msg = "E-mail Invalid. \n Pay attention to capital letters at the begin of your e-mail.";
                this.status = false;
            }
        })
        .catch((err) => {
            this.msg = err;
            this.status = false;
        });
    return toReturn;
}

/**
 * Check if the user is admin of any restaurant
 * then check the aunthentification key
 * @param  person => the user's JSON doc.
 * @param  req => help us to get the authKey enterred
 */

function userIsSeller(person, req) {

    
}