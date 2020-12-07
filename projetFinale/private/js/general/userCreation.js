const { userModel } = require('./schemas');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/testingdb',
    { useNewUrlParser: true, useUnifiedTopology: true }
);

// Creating user

const user = new userModel({
    name  : "Ingenzi Vany",
    email : "Ingenzivany@gmail.com",
    phone : "0466432080",
    password : "vany"
});


user.save(function (err, user) {
    if (err) { console.log(`Caught by .catch ${err}`); }
    else     { console.log(`Saved ${ user.name } to the database.`);}
});

//Finding user
userModel.findById("5fc9190e2505090504522265")
    .then((user) => {
        user.getSellerRestaurant('exki').then((res) => {
            console.log(res);
        });
});
