const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userModel = mongoose.model('User', Schema({
    name     : { type : String,                     required : true },
    email    : { type : String,                  required : true,          unique : true },
    phone    : { type : Number,                  required : true,          unique : true },
    password : { type : String,                     required : true }
}), 'users');

const restaurantSchema = new Schema({
    name       : { type : String,                     required : true,          unique : true },
    authKey    : { type : String,                     required : true,          unique : true },
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
                        }],                         required : false },
    admin      : { type : mongoose.ObjectId,        required : true }
});

restaurantSchema.pre('validate', function () {
    // Creating a collection of items for the shop
    mongoose.connection.createCollection('items'+this.name)
        .then(() => this.items = 'items'+this.name)
        .catch(err => console.log(`Caught by .catch ${err}`));
    mongoose.connection.createCollection('payments'+this.name)
        .then(() => this.payments = 'payments'+this.name)
        .catch(err => console.log(`Caught by .catch ${err}`));
});

const restaurantModel = mongoose.model('Restaurant', restaurantSchema, 'restaurants');

const paymentModel = mongoose.model('Payment', Schema({
    restaurant  : { type : mongoose.ObjectId,    required : true },
    dateInit    : { type : Date,                 required : true },
    dateInitEnd : { type : Date,                 required : true },
    status      : { type : String,               required : true },
    total       : { type : Number,               required : true }
}));

const itemModel = mongoose.model('Item', Schema({
    name        : { type : String,                  required : true,           unique : true },
    restaurant  : { type : String,                  required : true },
    price       : { type : Number,                  required : true },
    promo       : { type : Number,                  required : true },
    quantity    : { type : Number,                  required : true },
    soldAlone   : { type : Boolean,                 required : true },
    image       : { type : {
                                data : Buffer,
                                type : String,
                            },                  required : false },
}));

const orderModel = mongoose.model('Order', Schema({
    total       : { type : Number,                  required : true },
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
                            }],                     required : true },
    status      : { type : String,                  required : true },
    date        : { type : Date,                    required : true,            default: Date.now() },
    cancelRest  : { type : String,       required : false },
    user        : { type : mongoose.ObjectId,       required : true }
}), 'orders');

exports.userModel = userModel;
exports.orderModel = orderModel;
exports.itemModel = itemModel;
exports.paymentModel = paymentModel;
exports.restaurantModel = restaurantModel;