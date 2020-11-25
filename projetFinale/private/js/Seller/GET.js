function addOrModifyGroup(app, req, res){
    res.render('./Seller/AddOrModifyGroup.html');
}

function addOrModifyItem(app, req, res){
    res.render('./Seller/AddOrModifyItem.html');
}

function addOrModifyMenu(app, req, res){
    res.render('./Seller/AddOrModifyMenu.html')
}

function createRestoFinishedMessage(app, req, res){
    res.render('./Seller/CreateRestaurantFinished.html')
}

function createRestoSpeci(app,req, res){
    res.render('./Seller/CreateRestaurantSpeci.html');
}

function listOfOrders(app, req, res){
    res.render('./Seller/DashboardPage.html');
}

function paymentsList(app, req, res){
    res.render('./Seller/PaymentsPage.html');
}

function loggingIn(app, req, res){
    res.render('./Seller/SellerLoginPage.html')
}

function sellerStore(app,req, res){
    res.render('./Seller/StorePage.html')
}

function userLoggingIn(app, req, res){
    res.render('./Seller/UserLoginPage.html')
}


exports.getAddOrModifyGroup = addOrModifyGroup;

exports.getAddOrModifyItem = addOrModifyItem;

exports.getAddOrModifyMenu = addOrModifyMenu;

exports.getAfterCreateRestoMessage = createRestoFinishedMessage;

exports.getCreateRestaurantSpeci = createRestoSpeci;

exports.getOrders = listOfOrders;

exports.getPaymentsPage = paymentsList;

exports.getTheStorePage = sellerStore;

exports.getUserLoginPage = userLoggingIn;

exports.getSellerLoginPage = loggingIn;