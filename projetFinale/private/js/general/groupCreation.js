const { restaurantModel, groupModel  } = require('./schemas');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/testingdb',
    { useNewUrlParser: true, useUnifiedTopology: true }
);

restaurantModel.findOne({ name : "Exki" }).then((theRestaurant) => {
    restaurantModel.findById(theRestaurant._id).then((rest) => {
        rest.addGroup(new groupModel({
            name : "Cold Sandwiches",
            items : [{
                        name : "Club Viennese",
                        charge : 2.05,
                    },
                    {
                        name : "Cheese",
                        charge : 3.45,
                    },
                    {
                        name : "Meatballs",
                        charge : 5.45,
                    }
                    ],
            maxSelection : 1,
            minSelection : 0,
            description : "This group gives the choice contains sandwiches."
        }));
    });
});
