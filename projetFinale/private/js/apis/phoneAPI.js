const Nexmo = require('nexmo');

const nexmo = new Nexmo({
  apiKey: '63e8a3ad',
  apiSecret: 'ViXopy56NGiQQ6dq',
});

nexmo.verify.request({
  number: '32466432080',
  brand: 'GiQ',
  code_length: '4'
}, (err, result) => {
  console.log(err ? err : result)
});