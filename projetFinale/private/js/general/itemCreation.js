const { itemModel } = require('./schemas');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/testingdb',
    {useNewUrlParser: true, useUnifiedTopology: true }
);

const user = new itemModel({
    name  : "Ingenzi Vany",
    email : "ingenzivany@gmail.com",
    phone : "0466432080",
});

user.save(function (err, user) {
    if (err) { console.log(`Caught by .catch ${err}`); }
    else     { console.log(`Saved ${ user.name } to the database.`);}
});