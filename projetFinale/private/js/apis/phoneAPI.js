const Nexmo = require('nexmo');

const nexmo = new Nexmo({
  apiKey: '63e8a3ad',
  apiSecret: 'ViXopy56NGiQQ6dq',
});

function sendVerification(number) {
  nexmo.verify.request({
    number: number,
    brand: 'GiQ',
    code_length: '4'
  }, (err, result) => {
    console.log(err ? err : result);
    return err ? err : result;

  });
}
exports.sendVerification = sendVerification;