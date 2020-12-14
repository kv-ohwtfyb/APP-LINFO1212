const { orderModel, userModel } = require('./schemas');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/testingdb',
    {useNewUrlParser: true, useUnifiedTopology: true }
);

const rest = new orderModel({

});

rest.save(function (err, product) {
    if (err) { console.log(`Caught by .catch ${err}`); }
    else { console.log(`Saved ${ product.name } to the database.`);}
});