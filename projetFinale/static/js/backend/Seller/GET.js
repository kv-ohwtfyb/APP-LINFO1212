function addOrModifyGroup(app, req, res){
    res.render('././templates/Seller/AddOrModifyGroup.html');
}

function loggingIn(app, req, res){
    res.render('./Seller/SellerLoginPage.html')
}

exports.getSellerLoginPage = loggingIn;
exports.getAddOrModifyGroup = addOrModifyGroup;