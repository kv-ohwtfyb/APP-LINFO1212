const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { setVirtualImageSrc } = require('./functions');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    name     : { type : String,                       required : true },
    email    : { type : String,                       required : true,               unique : true },
    phone    : { type : String,                       required : true,               unique : true },
    password : { type : String,                       required : true  },
    orders   : { type : [ String ],                   required : false }
}, { autoIndex: false });


/**
 * Checks if the userId is registered as the admin to at least one restaurant.
 * @return {Promise|PromiseLike<T>|Promise<T>}
 */
userSchema.methods.isSeller = function () {
    return restaurantModel.findOne({ admin : this._id }).then((rest) => {
        return !!rest;
    });
}

/**
 *  Returns the restaurant where this._id is admin and the authKey is the
 *  correspond. If there's not then it returns throws an error.
 *  @param authKey (String) : the authentication key in the restaurant
 *  @return restaurant (restaurantModel) : the restaurant.
 *  @return {Promise|PromiseLike<T>|Promise<T>}
 *  @throws Error.
 */
userSchema.methods.getSellerRestaurant = function (authKey){
    if (authKey instanceof String) throw Error("The authKey given is not a string");
    return restaurantModel.findOne({ admin : this._id }).then((rest) => {
        if (!(rest)){ throw Error("No restaurant found under your email. You should try create a restaurant first."); }
        if (bcrypt.compare(authKey, rest.authKey)){
            return rest;
        }else {
            throw Error("The authentication key didn't match the authentication key on " + rest.name + ".");
        }
    });
}

const userModel = mongoose.model('User', userSchema, 'users');

const groupSchema = new Schema({
    name          : { type : String,               required : true },
    items         : { type : [{
                                name   : String,
                                charge : Number,
                            }],                   required : true },
    maxSelection  : { type : Number,              required : true },
    minSelection  : { type : Number,              required : true },
    description   : { type : String,              required : false }
}, { _id : false, autoIndex: false });

const groupModel = new mongoose.model('Group', groupSchema);

const categorySchema = new Schema({
    name          : { type : String,            required : true },
    items         : { type : [{
                                name : String,
                             }],                required : true },
    description   : { type : String,              required : false }
});

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
    description : { type : String,                      required : false }
});

const restaurantSchema = new Schema({
    name        : { type : String,                      required : true,              unique : true },
    authKey     : { type : String,                      required : true,              unique : true },
    payments    : { type : String,                      required : true },
    items       : { type : String,                      required : true },
    categories  : { type : [ categorySchema ],          required : false },
    groups      : { type : [ groupSchema ],             required : false },
    admin       : { type : String,                      required : true  },
    orders      : { type : String,                      required : true  },
    image       : { type : Buffer,                      required : false },
    imageType   : { type : String,                      required : false },
    avgPrice    : { type : Number,                      required : false,               default : 0}
}, { autoIndex: false });

//TODO try to create a group and see the behaviour

restaurantSchema.pre('save',async function (next) {
    await checkIfAdminExist(this.admin).then((bool) => {
        if (!bool) throw "Admin doesn't exist";
    });
    await checkForSimilarName(this.name)
        .then(() =>{})
        .catch((err) => {if (err) throw Error(err.message); })
    await Promise.all([
        mongoose.connection.createCollection(this.items)
        .then(()   => {console.log(this.items + " collection created.");})
        .catch(err => {console.log(`When creating items collection ${err}`);}),
        mongoose.connection.createCollection(this.payments)
        .then(()   => {console.log(this.payments + " collection created.");})
        .catch(err => console.log(`When creating payments collection ${err}`)),
        mongoose.connection.createCollection(this.orders)
        .then(()   => {console.log("orders"+ this.orders + " collection created.");})
        .catch(err => console.log(`When creating orders collection ${err}`)),

    ]).then(() => {
       next();
    });
});

/**
    Returns the groupModel that matches the name.
    @param name (String) : the name of the group.
    @return group (groupModel) : the group.
 */
restaurantSchema.methods.findGroup = function(name){
    this.groups.forEach(function (group) {
        if (formatRemoveWhiteSpaces(group.name).localeCompare(formatRemoveWhiteSpaces(name), 'fr', { sensitivity: 'base' }) === 0){
            return group;
        }
    });
}

/**
    Returns the Index of the groupModel that matches the name.
    @param name (String) : the name of the group.
    @return index (int) : the index of the group in the.
    @return null : if the group is n't present.
 */
restaurantSchema.methods.findGroupIndex = function(name){
    this.groups.forEach(function (group, index) {
        if (formatRemoveWhiteSpaces(group.name).localeCompare(formatRemoveWhiteSpaces(name), 'fr', { sensitivity: 'base' }) === 0){
            return index;
        }
    });
    return null;
}

/**
 * Returns an array of the names of all the groups.
 * @return {[ String ]}
 */
restaurantSchema.methods.listOfGroupNames = function (){
    const toReturn = [];
    this.groups.forEach(function (group) {
        toReturn.push(group.name);
    });
    return toReturn;
}

/**
    This is a static method that adds a group to the restaurant.
    Throws a TypeError if a group with the name already exist, if the argument is n't group model instance,
    and if one of the elements doesn't exist.
    @param theGroup (groupModel) : Group Model.
    @throws TypeError : if the group doesn't exist.
 */
restaurantSchema.methods.addGroup = function (theGroup) {
    if (theGroup instanceof groupModel){
        checkItemsOfGroup(this, theGroup.items);
        checkIfGroupWithNameExist(this, theGroup.name);
        this.groups.push(theGroup);
        this.groups.sort(function (a, b) { return format(a.name).localeCompare(format(b.name), 'fr', { sensitivity: 'base' }); });
        restaurantModel.update({ _id : this._id}, { groups : this.groups }).then((res)=>{
            if (res.nModified >=1 ){
                console.log("Added the group")
            }
        });
    }else {
      throw TypeError("The group given doesn't use the group Model.");
    }
}

/**
 * Removes the group from the restaurant list of groups.
 * @param name (String) : the name of the group to delete.
 */
restaurantSchema.methods.removeGroup = function (name) {
    this.groups = this.groups.filter((group) =>{
        return format(group.name) !== format(name);
    });
}

/**
 * @param name (String) : name of the group to update.
 * @param spec (JSON Object) : the elements to change and their values. Ex :
    { "name" : "Boisons Froide" }.
 * @throws TypeError if the group doesn't exist.
 */
restaurantSchema.methods.updateGroup = function (name, spec) {
    const index = this.findGroupIndex(name);
    if (index) {
        if (spec.hasOwnProperty("name"))  { checkIfGroupWithNameExist(this, spec.name); }
        if (spec.hasOwnProperty("items")) { checkItemsOfGroup(this, spec.items); }
        for (let specKey in spec) {
            this.groups[index].specKey = spec.specKey;
        }
    } else {
        throw TypeError(`A group with such ${name} doesn't exist, in ${this.name} groups. `);
    }
}

/**
 *  Returns an array of the restaurant identities used for the homepage. Can take an array
 *  and format it to look like the expected array.
 *  ex :
 *    {
 *       name : ...,
 *       avgPrice : ...,
 *       imgSrc : ...,
 *       imgType : ...
 *    }
 * @param array : Array of restaurants
 * @return {{avgPrice: *, name: *, imgSrc }[]}
 */
restaurantSchema.statics.arrayOfRestaurantsForDisplay = function ( array = null){
    if (array){
        return array.map((item) =>{
                const object = {
                    name : item.name,
                    avgPrice : item.avgPrice,
                };
                if (item.image){
                    object.image = item.image;
                    object.imageType = item.imageType;
                    setVirtualImageSrc(object);
                }
                return object;
            });
    }else{
        return restaurantModel.find().then((result) => {
            return result.map((item) =>{
                const object = {
                    name : item.name,
                    avgPrice : item.avgPrice,
                };
                if (item.image){
                    object.image = item.image;
                    object.imageType = item.imageType;
                    setVirtualImageSrc(object);
                }
                return object;
            })
        });
    }
}

// TODO Method add Item
// TODO Method update Item
// TODO Method remove Item

// TODO Method add Category
// TODO Method update Category
// TODO Method remove Category

restaurantSchema.index({'groups.description' : 'text',
                        'groups.items.name' : 'text',
                        'categories.description' : 'text',
                        'categories.items.name' : 'text',
                        'name' : 'text'
                        });

const restaurantModel = mongoose.model('Restaurant', restaurantSchema, 'restaurants');

restaurantModel.createIndexes(function (err) {
    if (err) console.log(`Error ensuring indexes.`);
});

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
                                            unityPrice : Number,
                                            quantity : Number,
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

/*
    Return the text without blank spaces.
    text (String ) : the text to format.
 */
function formatRemoveWhiteSpaces(name) {
    return name.trim().replace(" ","");
}

/*
    Return a the text in lowerCase and remove all the blank spaces.
    text (String ) : the text to format.
 */
function format(text) {
    return formatRemoveWhiteSpaces(text).toLowerCase();
}

/*
    Throws an typeError if an item with the given name of the group is not available in the restaurant items collection.
    restaurant (restaurantModel) : The model to which we using.
    items (Array of items) : An array with items that have a name key on which we checking on. Ex
    [{ name : "Fanta", ... }, { name : "Coca"} ].
 */
function checkItemsOfGroup(restaurant, items){
    items.forEach(function (item) {
        const res = mongoose.connection.collection(restaurant.items.toString()).findOne({ name : item.name});
        if (!res){
            throw TypeError(`The item ${item.name} doesn't exist in the ${restaurant.name} restaurant.`);
        }
    });
}

/*
    Return true if the adminId exists in the users collection, False else.
    adminId (string) : the admin _id string.

 */
function checkIfAdminExist(adminId) {
    return userModel.findById(adminId).then((rest) => {
        if (rest) { return true; }
        else      { return false; }
    });
}

/**
 *  Throws an typeError if an a group with the given group name of the group is not available in the restaurant items collection.
 *  @param restaurant (restaurantModel) : The model to which we using.
 *  @param name (String) : The group on which we checking on.
 */
function checkIfGroupWithNameExist(restaurant, name) {
    restaurant.groups.forEach(function (group){
        if (formatRemoveWhiteSpaces(group.name).localeCompare(formatRemoveWhiteSpaces(name), 'fr', { sensitivity: 'base' }) === 0){
            throw `The group name already exists ${group.name} which is similar to ${name}. Try with different name`;
        }
    })
}

/**
 * Checks if there's not a restaurant with a similar name.
 * @param name (String).
 * @return {Promise|PromiseLike<void>|Promise<void>}
 * @throws Error if there's a restaurant with a similar name.
 */
function checkForSimilarName(name){
    return restaurantModel.find().then((restaurants) => {
        restaurants.forEach(function (restaurant){
            if (formatRemoveWhiteSpaces(restaurant.name).localeCompare(formatRemoveWhiteSpaces(name), 'fr', { sensitivity: 'base' }) === 0){
                throw Error(`A restaurant named ${restaurant.name}, which is similar to ${name}. Please try with different name`);
            }
        });
    })
}