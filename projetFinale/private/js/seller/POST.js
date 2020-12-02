const {userModel, restaurantModel} = require('./../general/schemas');

function sellerLogin(app, req, res){
    if (req.session.user) {
        res.redirect('/');
    } else {
        logginCheck(req)
            .then((check) => {
                if (check.status) {
                    res.redirect('/');
                } else {
                    res.render('./Seller/SellerLoginPage.html', {loginError: check.msg})
                }
            })
    }
};


function logginCheck(req){
    const toReturn = this;
    await userModel.find({email:req.body.mail})
        .then((user) => {
            if (user) {
                if (user.password === req.body.password) {
                    await userIsSeller(user,req)
                        .then((result) => {
                            if(result){
                                this.status = result;
                            } else {
                                this.msg = "Access Denied";
                                this.status = result;
                            }
                        });
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

function userIsSeller(person, req) {

    await restaurantModel.findOne({admin : person._id})
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