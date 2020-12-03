const Vonage = require('@vonage/server-sdk');
const vonage = new Vonage({
    apiKey:'a3692c76',
    apiSecret:'g9RXK0g39XfgIqVo'
}, {
    debug: true
});

const Nexmo = require('@vonage/server-sdk');
const nexmo = new Nexmo({
    apiKey:'a3692c76',
    apiSecret:'g9RXK0g39XfgIqVo'
}, {
    debug: true
});

function userLogIn(app,req,res){
    $("submit").click({
        loggedIn : true
    })
}

function phoneNumberVerification(app, req, res){
    nexmo.verify.request({
        number : req.body.phoneNumber,
        brand : 'GIQ'
    }, (err, result) => {
        if (err){
            console.error(err);
        }else {
            verifyRequestId = result.request_id;
            console.log('request_id', verifyRequestId);
            res.render('./customer/SignUpVerificationNumberPage.html');
        }

    });

}

function codeCheck(app, req, res) {
    nexmo.verify.check({
        request_id: verifyRequestId,
        code: req.body.codeNumber
    }, (err, result) => {
        if (err){
            console.error(err);
        }else {
            console.log(result);
            res.render('./customer/MessagePage.html');
        }
    })
}

exports.postUserLoggedIn = userLogIn;
exports.postPhoneNumberVerification = phoneNumberVerification;
exports.postcodeCheck = codeCheck;