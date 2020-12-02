const { restaurantModel } = require('./schemas');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/testingdb',
    { useNewUrlParser: true, useUnifiedTopology: true }
);

const user = new restaurantModel({
    name     : "Quick",
    authKey  : "test",
    admin    : "5fc7658c693b30207c1f614a"
});

user.save(function (err, user) {
    if (err) { console.log(`Caught by .catch ${err}`);               }
    else     { console.log(`Saved ${ user.name } to the database.`); }
});