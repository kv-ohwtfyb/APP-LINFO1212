const { orderModel, userModel, restaurantModel } = require('./schemas');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/testingdb',
    {useNewUrlParser: true, useUnifiedTopology: true }
);

const order = new orderModel({
    total : 16,
    restaurants : [
                    {
                        restaurant : "Exki",
                        items : [
                                    {
                                        name : "Orange Juice",
                                        quantity : 4,
                                        unityPrice : 5,
                                    }
                                ],
                        total : 20
                    }
                ],
    status : "Ongoing",
    user   : "5fce68f454efac2da091f7cb",
});

order.save(function (err, product) {
    if (err) { console.log(`Caught by .catch ${err}`); }
    else { console.log(`Saved order to the database.`);}
});

// restaurantModel.findById("5fd2a594fc655f2c0c1ebad3").then((restaurant)=>{
//     restaurant.getArrayOfOrders().then((array) => {
//         console.log(array);
//     })
// })