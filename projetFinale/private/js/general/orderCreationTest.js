const { orderModel, userModel, restaurantModel } = require('./schemas');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/testingdb',
    {useNewUrlParser: true, useUnifiedTopology: true }
);

// const order = new orderModel({
//     total : 20,
//     restaurants : [
//                     {
//                         restaurant : "Exki",
//                         items : [
//                                     {
//                                         name : "Orange Juice",
//                                         quantity : 7,
//                                         unityPrice : 4,
//                                     }
//                                 ],
//                         total : 20
//                     }
//                 ],
//     date : new Date(2020,11,28, 5, 0),
//     status : "Ongoing",
//     user   : "5fce68f454efac2da091f7cb",
//     building : "More"
// });


// order.check().then(() => {
//     order.save(function (err, product) {
//         if (err) { console.log(`Caught by .catch ${err}`); }
//         else { console.log(`Saved order to the database.`);}
//     });
// }).catch((err) => {
//     const errorMessage = (err instanceof Object) ? err.message : err;
//     console.log(errorMessage);
// })


restaurantModel.findById("5fd2a594fc655f2c0c1ebad3").then((restaurant)=>{
    const date = new Date(2020,11,20);
    restaurant.arrayOfOrdersOnADay(date.toISOString()).then(object =>{
        console.log(object);
    });
})