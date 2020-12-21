const {setVirtualImageSrc} = require("../general/functions");
const { restaurantModel } = require('./../general/schemas');
const { formatText } = require('./../general/functions')

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

function createRestoFinishedMessage(app, req, res){
    res.render('./seller/CreateRestaurantFinished.html')
}

function createResto(app,req, res){
    res.render('./seller/CreateRestaurantSpeci.html');
}

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

function orderDetailsForRestaurant(app, req, res) {
    restaurantModel.findById(req.session.restaurant._id).then( (restaurant) => {
        restaurant.getOrdersItemsForRestaurant(req.query.orderId)
            .then((object) => {
                if (object)  res.json({ status : true, data : object });
                else res.json({ status : false, msg : "An order with the given id doesn't exist."})

            })
    })
}

function paymentsList(app, req, res){
    const restaurant = req.session.restaurant;
    res.render('./seller/PaymentsPage.html',{loggedIn : true, name : restaurant.name });
}

function loggingIn(app, req, res){
    res.render('./seller/SellerLoginPage.html',
        { loggedIn : req.session.user });
}

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