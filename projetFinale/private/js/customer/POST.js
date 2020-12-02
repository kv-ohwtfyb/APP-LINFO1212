function userLogIn(app,req,res){
    $("submit").click({
        loggedIn : true
    })
}

exports.postUserLoggedIn = userLogIn;