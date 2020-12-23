const Nexmo = require('nexmo');
const nexmo = new Nexmo({
    apiKey: '63e8a3ad',
    apiSecret: 'ViXopy56NGiQQ6dq',
});

function sendVerificationCode(number, callback){
    nexmo.verify.request({
        number: number,
        brand: 'GiQ',
        code_length: '4'
    }, callback);
}

function codeVerification(id, code, callback){
    nexmo.verify.check({
        request_id: id,
        code: code
    }, callback);
}

function cancelRequest(id, callback){
    nexmo.verify.control({
        request_id: id,
        cmd: 'cancel'
    }, callback);
}


function sendMessageReadySMS(phoneNumber, date){
    const from = "GiQ UCLouvain.";
    const msg = `Hello, your order for ${date} is ready. We are about to deliver it to you. Buon appetito :) In advance.\n GiQ UCLouvain.`
    nexmo.message.sendSms(from, phoneNumber, msg);
}


function cancelOrderMessage(phoneNumber, date){
    const from = "GiQ UCLouvain.";
    const msg = `Hello, Unfortunately your order for ${date} was just cancelled. We are deeply sorry.\n GiQ UCLouvain.`
    nexmo.message.sendSms(from, phoneNumber, msg);
}

exports.sendVerification = sendVerificationCode;
exports.codeVerification = codeVerification;
exports.cancelRequest = cancelRequest;
exports.confirmOrderMessage = sendMessageReadySMS;
exports.cancelOrderMessage = cancelOrderMessage;