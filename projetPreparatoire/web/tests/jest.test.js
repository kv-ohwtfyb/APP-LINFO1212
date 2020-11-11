const {Builder,By,Key,Util, Capabilities} = require('selenium-webdriver');
const { beforeAll , afterAll, test, describe} = require('@jest/globals');
require('chromedriver');

describe('Execute tests on homepage', () => {

  let driver;

  beforeAll(async () => {
    const chromeCapabilities = await Capabilities.chrome();
    await chromeCapabilities.set("acceptInsecureCerts", true);
    driver = await Builder().withCapabilities(chromeCapabilities).build();
  },1000);

   afterAll(async () => {
    await driver.quit();
  },15000);

  test('Check the homepage title', async () => {
    await driver.get("https://localhost:8080/");
    const title = await driver.getTitle();
    expect(title).toContain('Home');
  });
});

// describe('Execute tests for the report page', () => {
//   let driver;
//
//   beforeAll(async () => {
//     driver = new Builder().forBrowser("chrome").build();
//   },10000);
//
//   afterAll(async () => {
//     await driver.quit();
//   },15000);
//
//   test('Check we get acces to report page without logging in', async () => {
//     await driver.get("http://localhost:8080/report");
//     const title = await driver.getTitle()
//     expect(title).toContain('Authentication');
//   });
// });
//
// describe('Execute tests when logging in', () => {
//   let driver;
//
//   beforeAll(async () => {
//     driver = new Builder().forBrowser("chrome").build();
//   },10000);
//
//   afterAll(async () => {
//     await driver.quit();
//   },15000);
//
//   test('Check if after login he redirects to the homepage',  async () => {
//     const username = 'vany';
//     const password = 'vany';
//     await driver.get("http://localhost:8080/login");
//     const usernameInput = await driver.findElement(By.name('username'));
//     await usernameInput.sendKeys(username);
//     const passwordInput = await driver.findElement(By.name('password'));
//     await passwordInput.sendKeys(password);
//     const submit = await driver.findElement(By.id('loginButton'));
//     await submit.click();
//     const url = await driver.getCurrentUrl();
//     await expect(url).toBe('http://localhost:8080/');
//   });
//
//   test('Check if we acces the report page after logging', async ()=>{
//     await driver.get("http://localhost:8080/report");
//     const title = await driver.getTitle();
//     expect(title).toContain('Report');
//   });
// });