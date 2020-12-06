const { userModel, restaurantModel } = require('./../general/schemas');
const { savingImageToModel } = require('./../general/functions');
const bcrypt = require('bcrypt');
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
}

function creatingRestaurant(app, req, res){
    bcrypt.hash(req.body.authKey, 10, (err, hash) =>{
        const restaurant = new restaurantModel({
            name     : req.body.restoName,
            authKey  : hash,
            admin    : req.session.user._id || "db272328de72dh23d7d2",
            items    : "items"+ formatRemoveWhiteSpaces(req.body.restoName),
            orders   : "orders"+ formatRemoveWhiteSpaces(req.body.restoName),
            payments : "payments"+ formatRemoveWhiteSpaces(req.body.restoName),
        });
        if (req.body.frontImage){
            savingImageToModel(restaurant, req.body.frontImage)
        }
        console.log(restaurant);
        restaurant.save()
            .then((restaurant) =>{
                console.log("Created the restaurant " + restaurant.name);
                res.redirect('/orders');
            })
            .catch((err) => {
                res.render("./seller/CreateRestaurantSpeci.html", {
                    Error : err.message
                });
            })
    })
}

exports.postSellerlogin = sellerLogin;
exports.postCreatingRestaurant = creatingRestaurant;





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

function formatRemoveWhiteSpaces(name) {
    return name.trim().replace(" ","");
}