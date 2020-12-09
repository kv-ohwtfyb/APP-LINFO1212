const { restaurantModel, groupModel  } = require('./schemas');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/testingdb',
    { useNewUrlParser: true, useUnifiedTopology: true }
);

restaurantModel.findOne({ name : "Exki" }).then((theRestaurant) => {
    restaurantModel.findById(theRestaurant._id).then((rest) => {
        rest.addGroup(new groupModel({
            id : "Cold Sandwiches",
            items : [{
                        name : "Club Viennese",
                        charge : 2.05,
                    },
                    {
                        name : "Cheese Viennese",
                        charge : 3.45,
                    }
                    ],
            maxSelection : 1,
            minSelection : 0,
            description : "This group gives the choice between two sandwiches."
        }));
    });
    restaurantModel.findById(theRestaurant._id).then((rest) => {
        console.log(rest)
    });
});
