const { userModel } = require('./schemas');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

mongoose.connect('mongodb://localhost:27017/testingdb',
    { useNewUrlParser: true, useUnifiedTopology: true }
);

// Creating user

<<<<<<< HEAD

=======
>>>>>>> refs/remotes/origin/master
const user = new userModel({
    name     : "Hirwa Heri",
    email    : "mmihigojonathan@gmail.com",
    phone    : "0486244197",
    password : "heri",
    orders   :  ["12,95", "Quick", "paid", "6 Dec 2020", "", ObjectId]
});


user.save(function (err, user) {
    if (err) { console.log(`Caught by .catch ${err}`); }
    else     { console.log(`Saved ${ user.name } to the database.`);}
});

<<<<<<< HEAD
/*
=======
>>>>>>> refs/remotes/origin/master
//Finding user
userModel.findById("5fc9190e2505090504522265")
    .then((user) => {
        user.getSellerRestaurant('exki').then((res) => {
            console.log(res);
        });
});
*/
