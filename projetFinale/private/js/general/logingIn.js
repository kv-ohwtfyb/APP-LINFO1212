const {userModel} = require("./schemas");

function logging(app, session, req, res){
    const username = req.body.mail.value;
    
    if (Number.isInteger(username)) {
        const user = userModel.find({phone: username});
        console.log(user);
    }  
}

