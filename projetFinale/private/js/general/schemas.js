const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userModel = new Schema({
    email    : { type : Text,                  required : true,          unique : true },
    phone    : { type : Number,                required : true,          unique : true },
    password : { type : Text,                  required : true }
});

const restaurantsModel = new Schema({
    name       : { type : Text,                 required : true,          unique : true },
    authKey    : { type : Text,                 required : true,          unique : true },
    payments   : { type : Text,                 required : true },
    items      : { type : Text,                 required : true },
    categories : { type : JSON,                 required : true },
    groups     : { type : JSON,                 required : true },
    admin      : { type : mongoose.ObjectId,    required : true }
});

const paymentModel = new Schema({
    restaurant  : { type : mongoose.ObjectId,    required : true },
    dateInit    : { type : Date,                 required : true },
    dateInitEnd : { type : Date,                 required : true },
    status      : { type : Text,                 required : true },
    total       : { type : Number,               required : true }
});

const itemModel = new Schema({
    name        : { type : mongoose.ObjectId,       required : true },
    price       : { type : Number,                  required : true },
    promo       : { type : Number,                  required : true },
    quantity    : { type : Number,                  required : true },
    soldAlone   : { type : Boolean,                 required : true },
    image       : { type : Buffer,                  required : false },
});

const orderModel = new Schema({
    total       : { type : Number,                  required : true },
    restaurants : { type : [{
                                restaurant : Text
                            }],                     required : true },
    status      : { type : Text,                    required : true },
    date        : { type : Date,                    required : true,            default: Date.now() },
    cancelRest  : { type : mongoose.ObjectId,       required : false }
});