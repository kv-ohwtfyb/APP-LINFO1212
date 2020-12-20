const {Builder,By,Key,Util, Capabilities} = require('selenium-webdriver');
const { beforeAll , afterAll, test, describe} = require('@jest/globals');
require('chromedriver');

describe('Tests on homepage', () => {
    let driver;

    beforeAll(async () => {
        driver = new Builder().forBrowser("chrome").build();
    },10000);

    afterAll(async () => {
        await driver.quit();
    },15000);

    test('Check the homepage title', async () => {
        await driver.get("http://localhost:1348/");
        const title = await driver.getTitle();
        await expect(title).toContain('Home');
    });
});

//TODO Test for checkout
//TODO Test for log in
//TODO Test for sign up
//TODO Test for sign up with already existing phone number or email.
//TODO Test for log out after creating a user
//TODO Test for dashboard without being a seller
