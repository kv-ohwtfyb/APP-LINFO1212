const { restaurantModel, groupModel  } = require('./schemas');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/testingdb',
    { useNewUrlParser: true, useUnifiedTopology: true }
);

restaurantModel.findOne({ name : "Exki" }).then((theRestaurant) => {
    restaurantModel.findById(theRestaurant._id).then((rest) => {
        rest.addGroup(new groupModel({
            id : "Hot drink choice",
            items : [{
                        name : "Italian coffee",
                        charge : 2.05,
                    },
                    {
                        name : "Cappuccino",
                        charge : 3.45,
                    }
                    ],
            maxSelection : 1,
            minSelection : 0,
            description : "This group gives the choice between hot drinks."
        }));
    });
    restaurantModel.findById(theRestaurant._id).then((rest) => {
        console.log(rest)
    });
});
