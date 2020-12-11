const {setVirtualImageSrc} = require("../general/functions");
const { restaurantModel } = require('./../general/schemas');
const { formatText } = require('./../general/functions')

function addOrModifyGroup(app, req, res){
    res.render('./seller/AddOrModifyGroup.html');
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

function addOrModifyMenu(app, req, res){
    res.render('./seller/AddOrModifyCategory.html')
}

function createRestoFinishedMessage(app, req, res){
    res.render('./seller/CreateRestaurantFinished.html')
}

function createResto(app,req, res){
    res.render('./seller/CreateRestaurantSpeci.html');
}

function listOfOrders(app, req, res){
    res.render('./seller/DashboardPage.html');
}

function paymentsList(app, req, res){
    res.render('./seller/PaymentsPage.html');
}

function loggingIn(app, req, res){
    res.render('./seller/SellerLoginPage.html',
        { loggedIn : req.session.user });
}

function sellerStore(app,req, res){
    res.render('./Seller/StorePage.html')
}



exports.getAddOrModifyGroup = addOrModifyGroup;
exports.getAddOrModifyItem = addOrModifyItem;
exports.getAddOrModifyCategory = addOrModifyMenu;
exports.getAfterCreateRestoMessage = createRestoFinishedMessage;
exports.getCreateRestaurant = createResto;
exports.getOrders = listOfOrders;
exports.getPaymentsPage = paymentsList;
exports.getTheStorePage = sellerStore;
exports.getSellerLoginPage = loggingIn;


function elementsNameArrayMapToMatchString(array, text) {
    return array.filter((name) => {
        if (text.length > name.length ){
            return false
        }else{
            return formatText(name.substring(0, text.length)).localeCompare(formatText(text), 'fr', { sensitivity: 'base' }) === 0;
        }
    })
}