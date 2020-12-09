const { restaurantModel } = require('./schemas');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/testingdb',
    { useNewUrlParser: true, useUnifiedTopology: true }
);

const rest = new restaurantModel({
    name     : "Exki",
    authKey  : "exki",
    admin    : "5fcd7bfc4cc4ec1b3c97575b",
    items    : "items"+ formatRemoveWhiteSpaces("Exki"),
    orders   : "orders"+ formatRemoveWhiteSpaces("Exki"),
    payments : "payments"+ formatRemoveWhiteSpaces("Exki"),
    avgPrice : 10
});

rest.save(function (err, res) {
    if (err) { console.log(`Caught by .catch ${err}`);               }
    else     { console.log(`Saved ${ res.name } to the database.`); }
});

function formatRemoveWhiteSpaces(name) {
    return name.trim().replace(" ","");
}