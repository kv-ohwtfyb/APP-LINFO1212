const { restaurantModel, categoryModel  } = require('./schemas');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/testingdb',
    { useNewUrlParser: true, useUnifiedTopology: true }
);


restaurantModel.findOne({ name : "Exki" }).then((restaurant) => {
    restaurant.getArrayOfItemsDisplayForStore()
        .then((array) => {
            console.log(array);
        })
});
