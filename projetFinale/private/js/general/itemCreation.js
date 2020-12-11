const { restaurantModel  } = require('./schemas');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/testingdb',
    { useNewUrlParser: true, useUnifiedTopology: true }
);

/*
restaurantModel.findOne({ name : "Exki" }).then((theRestaurant) => {
    restaurantModel.findById(theRestaurant._id)
        .then((restaurant) => {
            restaurant.deleteItem({
                name : "Coca-cola",
                price : 1.0,
                promo : 0,
                quantity : 1,
                soldAlone : true,
                description : "This is a coca-cola can of 330ml."
            })
    })
    .catch((err) => console.log(err.message));
});

 */

restaurantModel.findOne({ name : "Exki" }).then((theRestaurant) => {
    restaurantModel.findById(theRestaurant._id).then(async (rest) => {
        const item = await rest.deleteItem({ name : "" });
        console.log(item);
    });
});
