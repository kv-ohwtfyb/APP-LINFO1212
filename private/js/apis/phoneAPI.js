const Nexmo = require('nexmo');

const nexmo = new Nexmo({
    apiKey: '63e8a3ad',
    apiSecret: 'ViXopy56NGiQQ6dq',
});

/**
 * Sends a message to the phone number indicating that the order on that date has been confirmed.
 * @param {String} phoneNumber  the phone number likely that starts with 324
 * @param {IsoDateString} date  : a date.
 */
function sendMessageReadySMS(phoneNumber, date){
    const from = "GiQ UCLouvain.";
    const msg = `Hello, your order for ${date} is ready. We are about to deliver it to you. Buon appetito :) In advance.\n GiQ UCLouvain.`
    nexmo.message.sendSms(from, phoneNumber, msg);
}

/**
 * Sends a message to the phone number indicating that the order on that date has been cancelled.
 * @param {String} phoneNumber The phone number likely that starts with 324
 * @param {IsoDateString} date  : a date.
 */
function cancelOrderMessage(phoneNumber, date){
    const from = "GiQ UCLouvain.";
    const msg = `Hello, Unfortunately your order for ${date} was just cancelled. We are deeply sorry.\n GiQ UCLouvain.`
    nexmo.message.sendSms(from, phoneNumber, msg);
}

exports.confirmOrderMessage = sendMessageReadySMS;
exports.cancelOrderMessage = cancelOrderMessage;