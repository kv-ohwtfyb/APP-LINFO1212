const {Builder,By,Key,Util, Capabilities} = require('selenium-webdriver');
const { beforeAll , afterAll, test, describe} = require('@jest/globals');
const app = require("./../app");
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/testingdb',
    {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
);

mongoose.connection.on('connected', (err, res) => {
    app.listen(6969);
});

require('chromedriver');

describe('Execute tests on homepage', () => {

  let driver;

  beforeAll(async () => {
    driver = new Builder().forBrowser("chrome").build();
  },10000);

   afterAll(async () => {
    await driver.quit();
  },15000);

  test('Check the homepage title', async () => {
    await driver.get("http://localhost:6969/");
    const title = await driver.getTitle();
    expect(title).toContain('Home');
  });
});