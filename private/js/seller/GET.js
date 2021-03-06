const {setVirtualImageSrc} = require("../general/functions");
const { restaurantModel } = require('./../general/schemas');
const { formatText } = require('./../general/functions')

/**
 * This function adds or modifies a group in a given restaurant
 * @param app
 * @param req
 * @param res
 */
function addOrModifyGroup(app, req, res){
    restaurantModel.findById(req.session.restaurant._id)
        .then(async (restaurant) => {
            const listOfItems = await restaurant.getArrayOfItemsName();
            if (req.query.group){
                const group = await restaurant.findGroup(req.query.group);
                const options = await Object.assign(
                    {
                                listOfItems : listOfItems,
                                groupExist : group,
                            }, group);
                res.render('./seller/AddOrModifyGroup.html', options);
            }else{
               res.render('./seller/AddOrModifyGroup.html',
                    {
                        listOfItems : listOfItems
                    }
                );
            }
        })
    }

/**
 * This function adds or modifies an item in a given restaurant
  * @param app
 * @param req
 * @param res
 */

function addOrModifyItem(app, req, res){
    restaurantModel.findById(req.session.restaurant._id).then(async (restaurant) => {
        const listOfGroups = await restaurant.listOfGroupNames();
        const listOfCategories = await restaurant.listOfCategoriesNames();
        if (req.query.name){
            const item = await restaurant.getItem(req.query.name);
            if (item){
                if (item.image) await setVirtualImageSrc(item);
            }
            const options = await Object.assign(
                    {
                                listOfCategories : listOfCategories,
                                listOfGroups : listOfGroups,
                                itemExist : item !== null,
                            }, item);
            res.render('./seller/AddOrModifyItem.html', options);
        }else{
            res.render('./seller/AddOrModifyItem.html', {
                                listOfCategories : listOfCategories,
                                listOfGroups : listOfGroups
                            });
        }

    })
}

/**
 * This function adds or modifies a category in a given restaurant
 * @param app
 * @param req
 * @param res
 */
function addOrModifyCategory(app, req, res){
    restaurantModel.findById(req.session.restaurant._id).then(async (restaurant) => {
        if (req.query.category){
            const category = await restaurant.findCategory(req.query.category);
            console.log(category);
            const options = await Object.assign({ Exist : category }, category);
            res.render('./seller/AddOrModifyCategory.html', options);
        }else {
            res.render('./seller/AddOrModifyCategory.html');
        }
    })
}

/**
 * This function renders the Final Message when a restaurant is created
 * @param app
 * @param req
 * @param res
 */
function createRestoFinishedMessage(app, req, res){
    res.render('./seller/CreateRestaurantFinished.html')
}

/**
 * This function renders the page to create a restaurant
 * @param app
 * @param req
 * @param res
 */
function createResto(app,req, res){
    res.render('./seller/CreateRestaurantSpeci.html');
}

/**
 * This function renders the restaurant's dashboard with all the orders(if it exists)
 * @param app
 * @param req
 * @param res
 */
function dashboard(app, req, res){
    restaurantModel.findById(req.session.restaurant._id).then(async (restaurant) => {
        const date = (req.query.date != null) ? new Date(req.query.date) : new Date();
        const listOfOrders = await restaurant.arrayOfOrdersOnADay(date.toISOString());
        if (listOfOrders){
            const todayElement = await restaurant.getObjectOfOrdersOnADay(date.toISOString());
            restaurant.salesToday = todayElement.totalAmount;
            restaurant.numberOfOrdersToday = listOfOrders.length;
        }
        res.render('./seller/DashboardPage.html',
            {
                loggedIn: req.session.user,
                restaurant: restaurant,
                listOfOrders: listOfOrders,
            }
                );
    })
}

/**
 * This function returns the details about an order in a restaurant
 * @param app
 * @param req
 * @param res
 */

function orderDetailsForRestaurant(app, req, res) {
    restaurantModel.findById(req.session.restaurant._id).then( (restaurant) => {
        restaurant.getOrdersItemsForRestaurant(req.query.orderId)
            .then((object) => {
                if (object)  res.json({ status : true, data : object });
                else res.json({ status : false, msg : "An order with the given id doesn't exist."})

            })
    })
}

/**
 * This function renders the list of payment of the restaurant
 * @param app
 * @param req
 * @param res
 */
function paymentsList(app, req, res){
    const restaurant = req.session.restaurant;
    res.render('./seller/PaymentsPage.html',{loggedIn : true, name : restaurant.name });
}

/**
 * This function renders the seller log in page
 * @param app
 * @param req
 * @param res
 */
function loggingIn(app, req, res){
    res.render('./seller/SellerLoginPage.html',
        { loggedIn : req.session.user });
}

/**
 * Thsi function renders the restaurant's store with the list of items, groups and catégories
 * @param app
 * @param req
 * @param res
 */

function sellerStore(app,req, res){
    restaurantModel.findById(req.session.restaurant._id).then(async (restaurant) => {
        let options = { name : restaurant.name };
        options.listOfItems = await restaurant.getArrayOfItemsDisplayForStore();
        options.listOfGroups = await restaurant.groups;
        options.loggedIn = true;
        options.user = req.session.user;
        options.listOfCategories = await restaurant.categories;
        res.render('./seller/StorePage.html', options);
    });
}



exports.getAddOrModifyGroup = addOrModifyGroup;
exports.getAddOrModifyItem = addOrModifyItem;
exports.getAddOrModifyCategory = addOrModifyCategory;
exports.getAfterCreateRestoMessage = createRestoFinishedMessage;
exports.getCreateRestaurant = createResto;
exports.getOrders = dashboard;
exports.getPaymentsPage = paymentsList;
exports.getTheStorePage = sellerStore;
exports.getSellerLoginPage = loggingIn;
exports.getOrderDetails = orderDetailsForRestaurant;