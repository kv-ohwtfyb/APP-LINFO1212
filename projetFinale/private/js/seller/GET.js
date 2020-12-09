const { restaurantModel } = require('./../general/schemas')

function addOrModifyGroup(app, req, res){
    res.render('./Seller/AddOrModifyGroup.html');
}

function addOrModifyItem(app, req, res){
    res.render('./Seller/AddOrModifyItem.html');
}

function addOrModifyMenu(app, req, res){
    res.render('./Seller/AddOrModifyCategory.html')
}

function createRestoFinishedMessage(app, req, res){
    res.render('./Seller/CreateRestaurantFinished.html')
}

function createResto(app,req, res){
    res.render('./Seller/CreateRestaurantSpeci.html');
}

function listOfOrders(app, req, res){
    res.render('./Seller/DashboardPage.html');
}

function paymentsList(app, req, res){
    res.render('./Seller/PaymentsPage.html');
}

function loggingIn(app, req, res){
    res.render('./Seller/SellerLoginPage.html',
        { loggedIn : req.session.user });
}

function sellerStore(app,req, res){
    res.render('./Seller/StorePage.html')
}

function sendListOfGroups(app, req, res){
    console.log(req.session.restaurant);
    restaurantModel.findById(req.session.restaurant._id).then((restaurant) => {
        if (restaurant){
            res.json({ status : true,
                       result : groupNameArrayMapToMatchString(restaurant.listOfGroupNames(), req.query.search)
                    })
        }else{
            res.json({ status : false, msg :"First login as a restaurant seller."});
        }
    })
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

exports.getListOfGroupNames = sendListOfGroups;


function groupNameArrayMapToMatchString(array, text) {
    return array.filter((name) => {
        if (text.length > name.length ){
            return false
        }else{
            return formatText(name.substring(0, text.length)).localeCompare(formatText(text), 'fr', { sensitivity: 'base' }) === 0;
        }
    })
}