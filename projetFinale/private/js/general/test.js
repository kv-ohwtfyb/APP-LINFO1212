const { restaurantModel } = require('./schemas');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/testingdb',
    {useNewUrlParser: true, useUnifiedTopology: true });

const rest = new restaurantModel({
    name    : 'Test2 King',
    authKey : 'Test2 King',
    admin   : "5fbd32d6274d303e60868dd0"
});

rest.save(function (err, product) {
    if (err) { console.log(`Caught by .catch ${err}`); }
    else { console.log(`Saved ${ product.name } to the database.`);}
    console.log("Saved");
});