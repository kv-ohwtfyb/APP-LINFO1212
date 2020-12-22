const {Builder,By,Key,Util, Capabilities} = require('selenium-webdriver');
const { beforeAll , afterAll, test, describe} = require('@jest/globals');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');
const { Dirent } = require('fs');
const { exception } = require('console');

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

const url = "http://localhost:1348/";

describe('Tests on homepage', () => {
    let driver;

    beforeAll(async () => {
        driver = new Builder().forBrowser("chrome").build();
    },10000);

    afterAll(async () => {
        await driver.quit();
    },15000);

    test('Check the homepage title', async () => {
        await driver.get(url);
        const title = await driver.getTitle();
        expect(title).toContain('Home');
    });

    test('Check the customer log in page', async () => {
        await driver.get(url);
        await driver.findElement(By.id("navbar_open")).click();
        await driver.findElement(By.className("login border-less bg-color-black")).click();
        await driver.findElement(By.name("mail")).sendKeys("mmihigojonathan@gmail.com");
        await driver.findElement(By.name("password")).sendKeys("jonathan");
        await driver.findElement(By.className("bg-color-black")).click();

        //expect(By.className("msg")).toContain("");
    });

});



//TODO Test for checkout
//TODO Test for log in
//TODO Test for sign up
//TODO Test for sign up with already existing phone number or email.
//TODO Test for log out after creating a user
//TODO Test for dashboard without being a seller
