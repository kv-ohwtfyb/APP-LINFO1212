const {userModel} = require('./../general/schemas');

/* 
    CE CODE NE MARCHE PAS ENCORE. IL Y A ENCORE UN BUG DANS ==>  function sellerLogInCheck()
*/

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
 * @param req : email, password and the authentification key enterred. 
 * @var user: Containing the seller's JSON doc
 * @constant toReturn : object of the function. containing { msg, status}
 * @returns toReturn, containing msg and status(either true or false)
 
*/

async function sellerLogInCheck(req){
    const toReturn = this;
    let user;

    await userModel.findOne({email:req.body.mail})

        .then((res1) => {
            if(res1){
                return res1;
            }else{
                this.msg = 'E-mail Invalid. \n Pay attention to capital letters at the begin of your e-mail.';
                this.status = false;
            }

        })
        .then((res2) => {
            if(res2.password === req.body.password){
                user = res2;
                console.log(user);
                return res2.isSeller();
            }else{
                this.msg = "Password Invalid";
                this.status = false;
            }
        })
        .then((res3) => {
            if(res3){
                console.log(res3);
                return user.getSellerRestaurant(req.body.authKey);
            } else {
                this.msg = "Your account is not Admin to any restaurant.";
                this.status = false;
            }
        })
        .then((res4) => {
            if(res4){
                this.status = true;
            } else {
                this.msg = "Invalid Authentification Key";
                this.status = false;
            }

            return this; 
        })
        
        .catch((err) => {
            this.msg = err;
            this.status = false;
        });

    return toReturn;
}
