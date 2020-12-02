const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userModel = mongoose.model('User', Schema({
    name     : { type : String,                       required : true },
    email    : { type : String,                       required : true,               unique : true },
    phone    : { type : String,                       required : true,               unique : true },
    password : { type : String,                       required : true  },
    orders   : { type : [ String ],                   required : false }
}), 'users');

const restaurantSchema = new Schema({
    name       : { type : String,                     required : true,              unique : true },
    authKey    : { type : String,                     required : true,              unique : true },
    payments   : { type : String,                     required : false },
    items      : { type : String,                     required : false },
    categories : { type : [ String ],                 required : false },
    groups     : { type : [{
                            id    : String,
                            items : [{
                                        id : String,
                                        charged : Number
                                    }],
                            maxSelections : Number,
                            minSelections : Number
                        }],                           required : false },
    admin      : { type : mongoose.ObjectId,          required : true  },
    orders     : { type : String,                     required : false }
});

restaurantSchema.pre('validate', function () {
    const formattedName = formatRestaurantName(this.name);
    // Creating a collection of items for the shop
    mongoose.connection.createCollection('items'+formattedName)
        .then(()   => this.items = 'items'+formattedName)
        .catch(err => console.log(`Caught by .catch ${err}`));
    // Creates a collection of payments for the shop
    mongoose.connection.createCollection('payments'+formattedName)
        .then(()   => this.payments = 'payments'+formattedName)
        .catch(err => console.log(`Caught by .catch ${err}`));
    // Creates a collection of orders for the shop containing references
    mongoose.connection.createCollection('orders'+formattedName)
        .then(()   => this.payments = 'orders'+formattedName)
        .catch(err => console.log(`Caught by .catch ${err}`));
});

const groupSchema = Schema({
    id            : { type : String,        required : true },
    items         : { type : [{
                                name   : String,
                                charge : Number,
                              }],           required : true },
    maxSelections : { type : Number,        required : true },
    minSelection  : { type : Number,        required : true }
});

/*
    Adds a group to the restaurant
    theGroup : Group schema.
 */
restaurantSchema.methods.addGroup = function (theGroup) {
    if (theGroup instanceof groupSchema){

    }else {
      throw new Error("The group given doesn't use the group schema");
    }
}

const restaurantModel = mongoose.model('Restaurant', restaurantSchema, 'restaurants');

const restaurantOrderSchema = Schema({
    date : { type : {
                        date   : Object,
                        orders : [ String ]
                    },                      required : true }
});

const paymentModel = mongoose.model('Payment', Schema({
    restaurant  : { type : mongoose.ObjectId,           required : true },
    dateInit    : { type : Date,                        required : true },
    dateInitEnd : { type : Date,                        required : true },
    status      : { type : String,                      required : true },
    total       : { type : Number,                      required : true }
}));

const itemModel = mongoose.model('Item', Schema({
    name        : { type : String,                      required : true,           unique : true },
    restaurant  : { type : String,                      required : true },
    price       : { type : Number,                      required : true },
    promo       : { type : Number,                      required : true },
    quantity    : { type : Number,                      required : true },
    soldAlone   : { type : Boolean,                     required : true },
    image       : { type : {
                                data : Buffer,
                                type : String,
                            },                          required : false },
}));

const orderSchema = new Schema({
    total       : { type : Number,                      required : true },
    restaurants : { type : [{
                                restaurant : String,
                                items : [{
                                            name : String,
                                            groupSets : [{
                                                            id : String,
                                                            selected : [ String ]
                                                        }],
                                            total : Number
                                        }],
                                total : Number
                            }],                         required : true  },
    status      : { type : String,                      required : true  },
    date        : { type : Object,                      required : true,            default: new Date() },
    cancelRest  : { type : String,                      required : false },
    user        : { type : mongoose.ObjectId,           required : true  }
});

orderSchema.pre('save', function () {
    // TODO Add the reference to the restaurant and the user.
    console.log(this);
});

const orderModel = mongoose.model('Orders', orderSchema, 'orders');

exports.userModel = userModel;
exports.orderModel = orderModel;
exports.itemModel = itemModel;
exports.paymentModel = paymentModel;
exports.restaurantModel = restaurantModel;

function formatRestaurantName(name) {
    return name.trim().replace(" ","");
}