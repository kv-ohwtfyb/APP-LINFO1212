const { userModel } = require('./schemas');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/testingdb',
    {useNewUrlParser: true, useUnifiedTopology: true }
);

// Creating user
/*
const user = new userModel({
    name  : "Ingenzi Vany",
    email : "ingenzivany@gmail.com",
    phone : "0466432080",
    password : "vany"
});


user.save(function (err, user) {
    if (err) { console.log(`Caught by .catch ${err}`); }
    else     { console.log(`Saved ${ user.name } to the database.`);}
});

 */

//Finding user

console.log(checkIfAdminExist("5fc9190e2505090504522265"));

function checkIfAdminExist(adminId) {
    userModel.findById(adminId).then((rest) => {
        if (rest) { return true;  }
        else      { return false; }
    });
}