const { restaurantModel, categoryModel  } = require('./schemas');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/testingdb',
    { useNewUrlParser: true, useUnifiedTopology: true }
);

/*
restaurantModel.findOne({ name : "Exki" }).then((theRestaurant) => {
    restaurantModel.findById(theRestaurant._id).then((rest) => {
        rest.addCategory(new categoryModel({
            name : "Drinks",
            items : [ ],
            description : "This category contains all the drinks that we sell."
        }));
    });
});

 */


