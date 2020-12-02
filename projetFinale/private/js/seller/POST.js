const {userModel, restaurantModel} = require('./../general/schemas');

function sellerLogin(app, req, res){

    sellerLogginCheck(req)
        .then((check) => {
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

async function sellerLogginCheck(req){
    const toReturn = this;
    await userModel.findOne({email:req.body.mail})
        .then((user) => {
            
            if (user) {
                
                if (user.password === req.body.password) {
                    if(!req.body.authKey){ 
                        this.msg = "There is no authentification key";
                        this.status = false;
                    } else {
                        const isSeller = userIsSeller(user,req);
                        if(isSeller){
                            this.status = true;
                        } else {
                            this.msg = "Access Denied";
                            this.status = false;
                        }

                    }
                    
                    /*
                        .then((result) => {
                            if(result){
                                this.status = result;
                            } else {
                                this.msg = "Access Denied";
                                this.status = result;
                            }
                        });
                    */
                } else {
                    this.msg = "Password Invalid";
                    this.status = false;
                }
                
            } else {
                this.msg = "E-mail Invalid";
                this.status = false;
            }
        });
    return toReturn;
};

/**
 * Check if the user is admin of any restaurant
 * then check the aunthentification key
 * @param  person => the user JSON doc.
 * @param  req => help us to get the authKey enterred
 */

function userIsSeller(person, req) {

    restaurantModel.findOne({admin : person._id})
        .then((user) => {
            if(user){
                if (user.authKey === req.authKey) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        });
    
}