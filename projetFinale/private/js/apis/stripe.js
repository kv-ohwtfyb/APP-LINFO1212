const phone = require('./phoneAPI');

// phone.sendVerification('32466432080', (err, result) => {
//     console.log(result);
// })

// phone.codeVerification('32fdca72e7fa452fbd1a90da7fa25880', '3131', (err, result) => {
//     console.log(result);
// });

// phone.cancelRequest('32fdca72e7fa452fbd1a90da7fa25880', (err, result) => {
//     console.log(result);
// })

phone.confirmOrderMessage('32466432080', 'oio');
// phone.cancelOrderMessage('32466432080', 'oio');
