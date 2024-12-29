const { Builder } = require('selenium-webdriver');
const LoginPage = require('../WebComponent/LoginPage');
const DashboardPage = require('../WebComponent/DashboardPage');
const CartPage = require('../WebComponent/CartPage');
const assert = require('assert');
const fs = require('fs');
require('dotenv').config();

const browser = process.env.BROWSER;
const baseUrl = process.env.BASE_URL;
const username = process.env.USER_NAME;
const password = process.env.PASSWORD;

const screenshotDir = './screenshots/';
if(!fs.existsSync(screenshotDir)){
    fs.mkdirSync(screenshotDir, {recursive: true});
}

describe('TestCase 3 [addtocart] #Smoke', function () {
    this.timeout(40000);
    let driver;

    switch(browser.toLowerCase()) {
    case 'firefox':
        const firefox = require('selenium-webdriver/firefox');
        options = new firefox.Options();
        options.addArguments('--headless'); 
    case 'edge':
        const edge = require('selenium-webdriver/edge');
        options = new edge.Options();
        options.addArguments('--headless');
    case 'chrome':
    default: 
        const chrome = require('selenium-webdriver/chrome');
        options = new chrome.Options();
        options.addArguments('--headless');
        break;
    }

    //run setiap mulai test, satu kali saja paling awal
    before(async function () {
        driver = await new Builder().forBrowser(browser).setFirefoxOptions(options).build();
    });

    //test suite dimulai dengan apa, setiap melakukan test
    beforeEach(async function () {
        const loginPage = new LoginPage(driver);
        await loginPage.navigate(baseUrl);
        await loginPage.login(username, password);
    });

    //assertion atau validasi
    it('Login successfully and verify dashboard', async function(){
        const dashboardPage = new DashboardPage(driver);
        const title = await dashboardPage.titleIsOnDashboard();
        assert.strictEqual(title, 'Products', 'Expected dashboard title to be Products');
    });

    it('Add to cart and successfully verify item', async function(){
        const dashboardPage = new DashboardPage(driver);
        await dashboardPage.buttonAddCartIsOnDashboard();
        await dashboardPage.buttonCartIsOnDashboard();

        const cartPage = new CartPage(driver);
        const title = await cartPage.titleIsOnCart();
        assert.strictEqual(title, 'Your Cart', 'Expected cart title to be Your Cart');
        const itemExists = await cartPage.itemIsOnCart();
        assert.strictEqual(itemExists, true, "Item was not added to the cart");
    });

    afterEach(async function () {
        const screenshot = await driver.takeScreenshot();
        const filepath = `${screenshotDir}${this.currentTest.title.replace(/\s+/g, '_')}_${Date.now()}.png`
        fs.writeFileSync(filepath, screenshot, 'base64');
    });
    
    after(async function () {
        await driver.quit();
    });
});