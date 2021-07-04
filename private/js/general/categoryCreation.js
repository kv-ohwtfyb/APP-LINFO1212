const { restaurantModel, categoryModel  } = require('./schemas');
const mongoose = require('mongoose');
const {  findWithPromise } = require('./functions')

mongoose.connect('mongodb://localhost:27017/testingdb',
    { useNewUrlParser: true, useUnifiedTopology: true }
);


restaurantModel.findById("5fd64aa54299841868f65bc1").then((restaurant) => {
    console.log(restaurant.getRestaurantView().then((tr) => {
        console.log(tr.categories[0]);
    }));
});