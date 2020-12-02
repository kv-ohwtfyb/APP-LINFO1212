const { restaurantModel, groupModel  } = require('./schemas');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/testingdb',
                    { useNewUrlParser: true, useUnifiedTopology: true });

const theRestaurant = restaurantModel.findById({name : 'Quick'});

theRestaurant.addGroup(new groupModel({
    id : "Choix des boissons",
    items : [{
                name : "Fanta",
                charge : 2.05,
            }],
    maxSelection : 1,
    minSelection : 0
}));
