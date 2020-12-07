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



exports.getAddOrModifyGroup = addOrModifyGroup;

exports.getAddOrModifyItem = addOrModifyItem;

exports.getAddOrModifyCategory = addOrModifyMenu;

exports.getAfterCreateRestoMessage = createRestoFinishedMessage;

exports.getCreateRestaurant = createResto;

exports.getOrders = listOfOrders;

exports.getPaymentsPage = paymentsList;

exports.getTheStorePage = sellerStore;

exports.getSellerLoginPage = loggingIn;