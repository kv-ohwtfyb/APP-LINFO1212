const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const functions = require('./functions');
const {setVirtualImageSrc} = require("./functions");
const {formatText} = require("./functions");
const {formatRemoveWhiteSpaces} = require("./functions");


const userSchema = new Schema({
    name     : { type : String,                       required : true },
    email    : { type : String,                       required : true,               unique : true },
    phone    : { type : String,                       required : true,               unique : true },
    password : { type : String,                       required : true  },
    orders   : { type : [ String ],        required : false }
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
 *  Returns the restaurant where this._id is admin and the inputAuthKey is the
 *  correspond. If there's not then it returns throws an error.
 *  @param inputAuthKey (String) : the authentication key in the restaurant
 *  @return restaurant (restaurantModel) : the restaurant.
 *  @return {Promise|PromiseLike<T>|Promise<T>}
 *  @throws Errors.
 */
userSchema.methods.getSellerRestaurant = function (inputAuthKey){
    if (inputAuthKey instanceof String) throw Error("The inputAuthKey given is not a string");
    return restaurantModel.find({ admin : this._id }).then(async (results) => {
        if (!(results)) throw Error("No restaurant found under your email. You should try create a restaurant first.");
        const restaurant = await functions.findWithPromise(results,  ({authKey}) => { return functions.hashComparing(inputAuthKey, authKey); });
        if (restaurant) return restaurant;
        throw Error(`The authentication key didn't match any of your ${results.length} restaurants.`);
    });
}

/**
 * Returns an array of order documents for this user.
 * @returns Promise<{*[]}>
 */
userSchema.methods.getArrayOfOrders = async function () {
    this.orders.forEach(async (refId, idx, array) => {
        array[idx] = await orderModel.findById(refId);
    });
    return this.orders;
}

userSchema.methods.addOrder = function (refId) {
    if (!(typeof refId === "string")) throw Error("The ref Id has to be a string");
    this.orders.push(refId);
    userModel.updateOne({ _id : this._id }, { orders : this.orders } )
        .then((stat) => {
            if (stat.nModified >=1 ){
                console.log(`Added the order in ${this.name} orders.`)
            }
        } );
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
    items         : { type : [ String ],        required : false,                  default : [] },
    description   : { type : String,            required : false }
}, { _id : false, autoIndex: false });

const categoryModel = new mongoose.model('Category', categorySchema);

const itemSchema = new Schema ({
    name        : { type : String,                      required : true,           unique : true },
    price       : { type : Number,                      required : true },
    promo       : { type : Number,                      required : false,           default : 0 },
    quantity    : { type : Number,                      required : true },
    soldAlone   : { type : Boolean,                     required : true },
    image       : { type : Buffer,                      required : false },
    imageType   : { type : String,                      required : false },
    description : { type : String,                      required : false }
}, { autoIndex : false });

itemSchema.plugin(uniqueValidator);

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

restaurantSchema.plugin(uniqueValidator);

/**
 * Ensures the restaurant has their items, orders, payments respectively collections.
 */
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
    for (let i = 0; i < this.groups.length; i++) {
        const group = this.groups[i];
        if (functions.formatRemoveWhiteSpaces(group.name).localeCompare(functions.formatRemoveWhiteSpaces(name), 'fr', { sensitivity: 'base' }) === 0){
            return group.toObject();
        }
    }
}

/**
    Returns the category object that matches the name.
    @param name (String) : the name of the group.
    @return group (Object) : the category.
 */
restaurantSchema.methods.findCategory = function(name){
    for (let i = 0; i < this.categories.length; i++) {
        const category = this.categories[i];
        if (functions.formatRemoveWhiteSpaces(category.name).localeCompare(functions.formatRemoveWhiteSpaces(name), 'fr', { sensitivity: 'base' }) === 0){
            return category.toObject();
        }
    }
}


/**
    Returns the Index of the groupModel that matches the name.
    @param name (String) : the name of the group.
    @return index (int) : the index of the group in the.
    @return null : if the group is n't present.
 */
restaurantSchema.methods.findGroupIndex = function(name){
    for (let i = 0; i < this.groups.length; i++) {
        if (functions.formatRemoveWhiteSpaces(this.groups[i].name).localeCompare(functions.formatRemoveWhiteSpaces(name), 'fr', { sensitivity: 'base' }) === 0) {
            return i
        }
    }
    return -1;
}


/**
    Returns the Index of the category object that matches the name.
    @param name (String) : the name of the group.
    @return index (int) : the index of the group in the.
    @return null : if the group is n't present.
 */
restaurantSchema.methods.findCategoryIndex = function(name){
    for (let i = 0; i < this.categories.length; i++) {
        if (functions.formatRemoveWhiteSpaces(this.categories[i].name).localeCompare(functions.formatRemoveWhiteSpaces(name), 'fr', { sensitivity: 'base' }) === 0) {
            return i
        }
    }
    return -1;
}

/**
 * Returns an array of the names of all the groups.
 * @return {[ String ]}
 */
restaurantSchema.methods.listOfGroupNames = function (){
    return this.groups.map(function (group) {
        return group.name;
    });
}

/**
 * Returns an array of the names of all the categories.
 * @return {[ String ]}
 */
restaurantSchema.methods.listOfCategoriesNames = function (){
    return this.categories.map(function (category) {
        return category.name;
    })
}

/**
    This is a static method that adds a group to the restaurant.
    Throws a TypeError if a group with the name already exist, if the argument is n't group model instance,
    and if one of the elements doesn't exist.
    @param theGroup (groupModel) : Group Model.
    @throws Error if there's a problem.
 */
restaurantSchema.methods.addGroup = function (theGroup) {
    if (theGroup instanceof groupModel) {
        return theGroup.validate().then(() => {
            return checkIfItemsExists(this, theGroup.items).then(() => {
                return checkIfGroupOrCategoryWithNameExist('groups', this, theGroup.name)
                    .then(() => {
                        this.groups.push(theGroup);
                        this.groups.sort(function (a, b) {
                            return functions.formatText(a.name).localeCompare(functions.formatText(b.name), 'fr', {sensitivity: 'base'});
                        });
                        return restaurantModel.updateOne({_id: this._id}, {groups: this.groups})
                            .then((res) => {
                                if (res.nModified >= 1) {
                                    console.log("Added the group");
                                }
                            });
                    })
                })
            })
    }else {
        throw Error("The group given doesn't use the group Model.");
    }
}

/**
    This is a static method that adds a group to the restaurant.
    Throws a TypeError if a group with the name already exist, if the argument is n't group model instance,
    and if one of the elements doesn't exist.
    @param theCategory (groupModel) : Group Model.
    @throws TypeError : if the group doesn't exist.
 */
restaurantSchema.methods.addCategory = function (theCategory) {
    if (theCategory instanceof categoryModel) {
        return theCategory.validate().then(() => {
            return checkIfItemsExistsForGroup(this, theCategory.items).then(() => {
                return checkIfGroupOrCategoryWithNameExist('groups', this, theCategory.name)
                    .then(() => {
                        this.categories.push(theCategory);
                        this.categories.sort(function (a, b) {
                            return functions.formatText(a.name).localeCompare(functions.formatText(b.name), 'fr', {sensitivity: 'base'});
                        });
                        return restaurantModel.updateOne({_id: this._id}, {categories: this.categories})
                            .then((res) => {
                                if (res.nModified >= 1) {
                                    console.log("Added the category");
                                }
                            });
                    })
                })
            })
    }else {
        throw Error("The category given doesn't use the category Model.");
    }
}

/**
 * Removes the group from the restaurant list of groups.
 * @param name (String) : the name of the group to delete.
 */
restaurantSchema.methods.removeGroup = function (name) {
    this.groups = this.groups.filter((group) =>{
        return formatText(group.name) !== formatText(name);
    });
    return restaurantModel.updateOne({ _id : this._id}, { groups : this.groups })
        .then((res)=>{
                if (res.nModified >=1 ){
                    console.log("Removed the group")
                }
        });
}

/**
 * Removes the category from the restaurant list of categories.
 * @param name (String) : the name of the category to delete.
 * @returns Promise.
 */
restaurantSchema.methods.removeCategory = function (name) {
    this.categories = this.categories.filter((category) =>{
        return formatText(category.name) !== formatText(name);
    });
    return restaurantModel.updateOne({_id: this._id}, {categories: this.categories})
        .then((res) => {
            if (res.nModified >= 1) {
                console.log("Removed the category");
            }
        });
}

/**
 * @param name (String) : name of the group to update.
 * @param spec (JSON Object) : the elements to change and their values. Ex :
    { "name" : "Boisons Froide" }.
 * @throws TypeError if the group doesn't exist. and other erros if the items don't exist.
 * @returns Promise<>
 */
restaurantSchema.methods.updateGroup = function (name, spec) {
    return new Promise(((resolve, reject) => {
        const index = this.findGroupIndex(name);
        if (index >= 0 ) {
            return checkIfItemsExists(this, spec.items).then(() => {
                for (let specKey in spec) {
                    this.groups[index][specKey] = spec[specKey];
                }
                return restaurantModel.updateOne({ _id : this._id}, { groups : this.groups })
                    .then((res)=>{
                            if (res.nModified >=1 ){
                                console.log("Modified the group")
                            }
                            return resolve();
                });
            }).catch((err) => { reject(err); })
        } else {
            throw Error(`A group with such ${name} doesn't exist, in ${this.name} groups.`);
        }
    }))
}

/**
 * @param name (String) : name of the category to update.
 * @param spec (JSON Object) : the elements to change and their values. Ex :
    { "name" : "Boissons Froide" }.
 * @throws TypeError if the group doesn't exist.
 * @returns Promise
 */
restaurantSchema.methods.updateCategory = function (name, spec) {
    return new Promise(((resolve, reject) => {
        const index = this.findCategoryIndex(name);
        if (index >= 0 ) {
            return checkIfItemsExistsForGroup(this, spec.items).then(() => {
                for (let specKey in spec) {
                    this.categories[index][specKey] = spec[specKey];
                }
                return restaurantModel.updateOne({ _id : this._id}, { categories : this.categories })
                    .then((res)=>{
                        if (res.nModified >=1 ){
                            console.log("Modified the category");
                        }
                        return resolve();
                });
            }).catch((err) => { reject(err); })
        } else {
            throw Error(`A category with such ${name} doesn't exist, in ${this.name} categories.`);
        }
    }))
}

/**
 * Adds the itemName in teh category's items (Array of Item's in that category).
 * If the category don't exist it does none.
 * @param categoryName
 * @param itemName
 * @throws MongoError.
 */
restaurantSchema.methods.addItemToCategory = function (categoryName, itemName) {
    const index = this.findCategoryIndex(categoryName);
    if (index >= 0) {
        if (!(this.categories[index].items.includes(itemName))){
            this.categories[index].items.push(itemName);
            this.categories.sort(sorter);
            restaurantModel.updateOne({ _id : this._id}, { categories : this.categories }).then((res)=>{
                if (res.nModified >=1 ){
                    console.log("Added the item to category")
                }
            });
        }
    }
}

restaurantSchema.methods.getRestaurantView = async function(){
    const thisRestaurantItemModel = mongoose.model('Item', itemSchema, this.items.toString());
    const allItems = await thisRestaurantItemModel.find();
    for (const category of this.categories) {
        for (let i = 0; i < category.items.length; i++) {
            category.items[i] = await functions.findWithPromise(allItems, ({name}) => { return category.items[i]===name; });
            functions.setVirtualImageSrc(category.items[i]);
        }
    }
    return this;
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
                    functions.setVirtualImageSrc(object);
                }
                return object;
            })
        });
    }
}
/**
 * Adds an Item from the restaurant's items collection
 * @param itemSpec (Object) : contain all the infos for the item.
 * @Returns Promise<Null>
 * @Throws Errors when they occur.
 */
restaurantSchema.methods.addItem = function (itemSpec){
    const thisRestaurantItemModel = mongoose.model('Item', itemSchema, this.items.toString());
    const Item = new thisRestaurantItemModel(itemSpec);
    return Item.save()
        .then((item) =>{
            console.log(`Added ${item.name} to ${this.name} restaurants`)
        })
        .catch((error) => {throw Error(error.message); })
}
/**
 * Update an Item from the restaurant's items collection
 * @param selectorSpec (Object) : contains infos used to select item we want to update
 * @param updateSpec (Object) : contains all the infos to update.
 * @Returns Promise<Null>
 * @Throws Errors when they occur.
 */
restaurantSchema.methods.updateItem = function (selectorSpec, updateSpec){
    const thisRestaurantItemModel = mongoose.model('Item', itemSchema, this.items.toString());
    return thisRestaurantItemModel.updateOne(selectorSpec, updateSpec)
        .then((res) =>{
            if(res.n === 0){
                throw Error("No item matching the given name.");
            }
        })
        .catch((error) => {throw Error(error.message); })
}

/**
 * Removes an Item from the restaurant's items collection
 * @param selectorSpec (Object) : contains infos used to select item we want to remove.
 * @Returns Promise<Null>
 * @Throws Errors when they occur.
 */
restaurantSchema.methods.deleteItem = function (selectorSpec){
    const thisRestaurantItemModel = mongoose.model('Item', itemSchema, this.items.toString());
    return thisRestaurantItemModel.deleteOne(selectorSpec)
        .then((stat) => {
            if (stat.n >= 1){
                this.categories.forEach((category) =>{
                    if (category.items.includes(selectorSpec.name)){
                        category.items = category.items.filter((it) => it !== selectorSpec.name );
                    }
                })
                this.groups.forEach((group) => {
                    if (group.items.map((it) => it.name).includes(selectorSpec.name)){
                        group.items = group.items.filter((it) => it.name !== selectorSpec.name );
                    }
                })
                restaurantModel.updateOne({ _id : this._id}, { categories : this.categories, groups : this.groups }).then((res)=>{
                    if (res.nModified >=1 ){
                        console.log("Removed the item from all categories and groups");
                    }
                });
            }else{
                throw Error("No item matching the given name.");
            }
        })
        .catch((error) => {throw Error(error.message); })
}

/**
 * Returns the Item object (document) with the categories in which the item is added in.
 * @param name
 * @return {Promise|PromiseLike<*>|Promise<*>}
 */
restaurantSchema.methods.getItem = function (name){
    const thisRestaurantItemModel = mongoose.model('Item', itemSchema, this.items.toString());
    return thisRestaurantItemModel.findOne({ name : name })
        .then((item) =>{
            if (item){
                let toReturn = Object.assign({}, item.toObject());
                toReturn.categories = this.categories.filter((category) => category.items.includes(name))
                                                        .map((category) => category.name);
                return toReturn;
            }
            return item;
        });
}

/**
 * Returns an array.
 * @returns {Promise|PromiseLike<any>|Promise<any>}
 */
restaurantSchema.methods.getArrayOfItemsName = function(){
    const thisRestaurantItemModel = mongoose.model('Item', itemSchema, this.items.toString());
    return thisRestaurantItemModel.find().then((response) =>{
        return response.map((item) => item.name);
    })
}

/**
 * Returns the list of items to display on the store items.
 * @returns {Promise|PromiseLike<any>|Promise<any>}
 */
restaurantSchema.methods.getArrayOfItemsDisplayForStore = function(){
    const thisRestaurantItemModel = mongoose.model('Item', itemSchema, this.items.toString());
    return thisRestaurantItemModel.find().then((response) =>{
        return response.map((item) => {
            const obj = Object.assign({}, item.toObject());
            functions.setVirtualImageSrc(obj);
            if (obj.quantity === 0 ) obj.soldOut = true;
            return obj
        });
    })
}

restaurantSchema.methods.getArrayOfOrders = async function(){
    const thisRestaurantOrderModel = await mongoose.model('Restaurant Order', restaurantOrderSchema, this.orders.toString());
    const dates = await thisRestaurantOrderModel.find();
    // await dates.forEach((date, idx, array) => {
    //     array[idx].orders = array[idx].orders.map((orderId) => orderModel.find({ _id : orderId }));
    // });
    return dates
}
/**
 * Adds the reference Id into the restaurant orders collection.
 * @param refId (String) : the id to the parent order
 * @param givenDate (Date) : A Date object on when the order is placed.
 * @param orderItems
 * @returns {Promise<void>}
 */
restaurantSchema.methods.addOrder = async function(refId){
    if (!( typeof refId === "string")) throw new Error("The refId has to be a string");
    const thisRestaurantOrdersModel = await mongoose.model("Orders", restaurantOrderSchema, this.orders.toString())
    const todayOrderDocument = await thisRestaurantOrdersModel.findOne({
        $where : function (){
            const dateToCompare = new Date(this.date);
            const today = new Date();
            return dateToCompare.getDate() === today.getDate() && dateToCompare.getMonth() === today.getMonth() && dateToCompare.getFullYear() === today.getFullYear();
        }
    });
    if (todayOrderDocument){
        todayOrderDocument.orders.push(refId);
        thisRestaurantOrdersModel.updateOne({ _id : todayOrderDocument._id }, { orders : todayOrderDocument.orders })
            .then((stats) => {
                if (stats.nModified >=1 ){
                    console.log(`Added the order in ${this.name} orders.`)
                }
            });
    }else{
        const createTodayDocument = new thisRestaurantOrdersModel(
                {
                    date : new Date(),
                    orders : [ refId ]
                }
            );
        createTodayDocument.save().then(() => {
            console.log(`Inserted Today in ${this.name} orders.`);
        });
    }

}

/**
 * Creates the text indexes which will be used for customer search.
 */
restaurantSchema.index({'groups.description' : 'text',
                        'groups.items.name' : 'text',
                        'categories.description' : 'text',
                        'categories.items' : 'text',
                        'name' : 'text'
                        });

const restaurantModel = mongoose.model('Restaurant', restaurantSchema, 'restaurants');

restaurantModel.createIndexes(function (err) {
    if (err) console.log(`Error ensuring indexes.`);
});

const restaurantOrderSchema = new Schema({
    date   : { type : Date,             default : new Date() },
    orders : { type : [ String ],       required : false     },
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
                                                            name : String,
                                                            selected : [ String ]
                                                        }],
                                            unityPrice : Number,
                                            quantity : Number,
                                        }],
                                total : Number
                            }],                         required : true  },
    status      : { type : String,                      required : true  },
    building    : { type : String,                      required : true  },
    date        : { type : Object,                      required : true,            default: new Date() },
    cancelRest  : { type : String,                      required : false },
    user        : { type : String,                      required : true  }
});

orderSchema.post('save', async function (order) {
    await userModel.findById(order.user).then((user) => {user.addOrder(order._id.toString())});
    await order.restaurants.forEach((object) => {
        restaurantModel.findOne( { name : object.restaurant } ).then((rest) => {
            restaurantModel.findById(rest._id).then((restaurant) =>{
                restaurant.addOrder(order._id.toString());
            })
        })
    })
});

const orderModel = mongoose.model('Order', orderSchema, 'orders');

exports.userModel = userModel;
exports.orderModel = orderModel;
exports.itemSchema = itemSchema;
exports.paymentModel = paymentModel;
exports.restaurantModel = restaurantModel;
exports.groupModel = groupModel;
exports.categoryModel = categoryModel;

/**
 * Throws an typeError if an item with the given name of the group is not available in the restaurant items collection.
 * restaurant (restaurantModel) : The model to which we using.
 * items (Array of items) : An array with items that have a name key on which we checking on. Ex
 * [{ name : "Fanta", ... }, { name : "Coca"} ].
 * @param restaurant
 * @param items
 * @returns Promise<Function>
 * @throws Error if the item don't exist.
 */
function checkIfItemsExists(restaurant, items){
    const thisRestaurantItemModel = mongoose.model('Item', itemSchema, restaurant.items.toString());
    return new Promise((async (resolve, reject) => {
        for (let i = 0; i < items.length; i++) {
            if (!(await thisRestaurantItemModel.exists({ name : items[i].name}))){
                return reject(`The item ${items[i].name} doesn't exist in the ${restaurant.name} restaurant.`);
            }
        }
        return resolve();
    }))
}

function checkIfItemsExistsForGroup(restaurant, items){
    return new Promise((async (resolve, reject) => {
        if (items === undefined ) return resolve();
        const thisRestaurantItemModel = await mongoose.model('Item', itemSchema, restaurant.items.toString());
        for (let i = 0; i < items.length; i++) {
            if (!(await thisRestaurantItemModel.exists({ name : items[i]}))){
                return reject(`The item ${items[i]} doesn't exist in the ${restaurant.name} restaurant.`);
            }
        }
        return resolve();
    }))
}

/**
 * Checks if an admin with the given name exists
 * @param adminId
 * @return Promise<Boolean>
 */
function checkIfAdminExist(adminId) {
    return userModel.exists({ _id : adminId })
}

/**
 *  Throws an typeError if an a group with the given group name of the group is not available in the restaurant items collection.
 *  @param key (String) : 'groups' or 'categories'.
 *  @param restaurant (restaurantModel) : The model to which we using.
 *  @param name (String) : The group on which we checking on.
 */
function checkIfGroupOrCategoryWithNameExist(key, restaurant, name) {
    return new Promise(async (resolve, reject) => {
        for (let i = 0; i < restaurant[key].length; i++) {
            let object = restaurant[key][i];
            if (functions.formatRemoveWhiteSpaces(object.name).localeCompare(functions.formatRemoveWhiteSpaces(name), 'fr', { sensitivity: 'base' }) === 0){
                reject(`A ${key} with a similar name already exists: '${object.name}' which is similar to the given name '${name}'. Try with different name`);
            }
        }
        return resolve();
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
            if (functions.formatRemoveWhiteSpaces(restaurant.name).localeCompare(functions.formatRemoveWhiteSpaces(name), 'fr', { sensitivity: 'base' }) === 0){
                throw Error(`A restaurant named ${restaurant.name}, which is similar to ${name}. Please try with different name`);
            }
        });
    })
}

/**
 * This the sorter method we use to sort groups and categories
 * @param a
 * @param b
 * @return {number}
 */
function sorter(a, b) {
    return functions.formatText(a.name).localeCompare(functions.formatText(b.name), 'fr', { sensitivity: 'base' });
}
