const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name     : { type : String,                       required : true },
    email    : { type : String,                       required : true,               unique : true },
    phone    : { type : String,                       required : true,               unique : true },
    password : { type : String,                       required : true  },
    orders   : { type : [ String ],                   required : false }
});

/*
    Checks if the userId is registered as the admin to at least a restaurant.
    userId (String)  : the string of the user admin.
 */
userSchema.static.isSeller = function (userId) {
    if (typeof userId !== "string") throw "The userId given is n't a string";
    restaurantModel.findOne({ admin : userId }).then((rest) => {
        return !!rest;
    });
}

/*
    Returns the restaurant where the userId is admin and the authKey is the
    correspond.
    userId (String)  : the string of the user admin.
    authKey (String) : the authentication key in the restaurant
 */

userSchema.static.getSellerRestaurant = function (userId, authKey){
    if (typeof userId  !== "string") throw  "The userId given is not a string";
    if (typeof authKey !== "string") throw "The authKey given is not a string";
    restaurantModel.findOne({ admin : userId, authKey : authKey }).then((rest) => {
        return rest;
    });
}

const userModel = mongoose.model('User', userSchema, 'users');

const groupModel = mongoose.model('Group', Schema({
    id            : { type : String,            required : true },
    items         : { type : [{
                                name   : String,
                                charge : Number,
                            }],                 required : true },
    maxSelection  : { type : Number,            required : true },
    minSelection  : { type : Number,            required : true }
}));

const itemSchema = new Schema ({
    name        : { type : String,                      required : true,           unique : true },
    restaurant  : { type : String,                      required : true },
    price       : { type : Number,                      required : true },
    promo       : { type : Number,                      required : true },
    quantity    : { type : Number,                      required : true },
    soldAlone   : { type : Boolean,                     required : true },
    image       : { type : {
            data : Buffer,
            type : String,
        },                                              required : false },
});

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
    admin      : { type : String,          required : true  },
    orders     : { type : String,                     required : false }
});

restaurantSchema.pre('validate', function () {
    if (!checkIfAdminExist(this.admin)) throw "Admin doesn't exist";
    const formattedName = formatRemoveWhiteSpaces(this.name);
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

/*
    This is a static method that adds a group to the restaurant
    theGroup : Group schema.
 */
restaurantSchema.statics.addGroup = function (theGroup) {
    if (theGroup instanceof groupModel){
        checkItemsOfGroup(this, theGroup);
        this.groups.forEach(function (group) {
            if (format(group.id).localeCompare(format(theGroup)) === 0){
                throw `The group name already exists ${theGroup.id} is similar to ${group.id}`;
            }
        });
        this.groups.push(groupSchema);
        this.groups.sort(function (a, b) { return a.id.localeCompare(b.id); });
    }else {
      throw "The group given doesn't use the group.";
    }
}

// TODO Method remove group
// TODO Method update group
// TODO Method add Item
// TODO Method update Item
// TODO Method remove Item

const restaurantModel = mongoose.model('Restaurant', restaurantSchema, 'restaurants');

const restaurantOrderSchema = new Schema({
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
    // TODO Add the reference to the restaurants orders and the users orders
    console.log(this);
});

const orderModel = mongoose.model('Orders', orderSchema, 'orders');

exports.userModel = userModel;
exports.orderModel = orderModel;
exports.itemSchema = itemSchema;
exports.paymentModel = paymentModel;
exports.restaurantModel = restaurantModel;
exports.groupModel = groupModel;

function formatRemoveWhiteSpaces(name) {
    return name.trim().replace(" ","");
}

function format(text) {
    return formatRemoveWhiteSpaces(text).toLowerCase();
}

function checkItemsOfGroup(restaurant, group){
    group.items.forEach(function (item) {
        const res = mongoose.connection.collection(restaurant.items).findOne({ name : item.name});
        if (!res){
            throw `The item ${item.name} doesn't exist in the ${restaurant.name}`;
        }
    });
}

function checkIfAdminExist(adminId) {
    userModel.findById(adminId).then((rest) => {
    return !!rest;
    });
}