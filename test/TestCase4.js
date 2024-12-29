const { Builder } = require('selenium-webdriver');
const LoginPage = require('../WebComponent/LoginPage');
const DashboardPage = require('../WebComponent/DashboardPage');
const CartPage = require('../WebComponent/CartPage');
const InputInfoPage = require('../WebComponent/InputInfoPage');
const OverviewPage = require('../WebComponent/OverviewPage');
const CompletePage = require('../WebComponent/CompletePage');
const assert = require('assert');
const fs = require('fs');
require('dotenv').config();

const browser = process.env.BROWSER;
const baseUrl = process.env.BASE_URL;
const username = process.env.USER_NAME;
const password = process.env.PASSWORD;

const firstName = process.env.FIRST_NAME
const lastName = process.env.LAST_NAME
const postalCode = process.env.POSTAL_CODE

const screenshotDir = './screenshots/';
if(!fs.existsSync(screenshotDir)){
    fs.mkdirSync(screenshotDir, {recursive: true});
}

describe('TestCase 4 [checkout] #Regression', function () {
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

    it('Checkout successfully and verify order', async function(){
        //Add item to cart
        const dashboardPage = new DashboardPage(driver);
        await dashboardPage.buttonAddCartIsOnDashboard();
        await dashboardPage.buttonCartIsOnDashboard();

        //Verify on "cart page" and item in cart
        const cartPage = new CartPage(driver);
        const title = await cartPage.titleIsOnCart();
        assert.strictEqual(title, 'Your Cart', 'Expected cart title to be Your Cart');
        const itemExists = await cartPage.itemIsOnCart();
        assert.strictEqual(itemExists, true, "Item was not added to the cart");

        //Click checkout
        await cartPage.clickCheckoutOnCart();

        //Verify on "input info page" and input user info
        const infoPage = new InputInfoPage(driver);
        const titleInfo = await infoPage.titleIsOnInputInfo();
        assert.strictEqual(titleInfo, 'Checkout: Your Information', 'Expected input info title to be Checkout: Your Information');
        await infoPage.inputInfo(firstName, lastName, postalCode);

        //Verify on "overview page" and overview item
        const overviewPage = new OverviewPage(driver);
        const titleOverview = await overviewPage.titleIsOnOverview();
        assert.strictEqual(titleOverview, 'Checkout: Overview', 'Expected Overview title to be Checkout: Overview');
        const itemOverviewExists = await overviewPage.itemIsOnOverview();
        assert.strictEqual(itemOverviewExists, true, "Item was not in overview");
        const infoPayment = await overviewPage.paymentInfoIsOnOverview();
        assert.strictEqual(infoPayment, 'SauceCard #31337', 'Expected info payment to be SauceCard #31337');
        const totalPrice = await overviewPage.priceTotalIsOnOverview();
        assert.strictEqual(totalPrice, 'Total: $32.39', 'Expected price total $32.39');

        //Click finish
        await overviewPage.clickFinishOnOverview();

        //Verify on complete page
        const completePage = new CompletePage(driver);
        const titleComplete = await completePage.titleIsOnComplete();
        assert.strictEqual(titleComplete, 'Checkout: Complete!', 'Expected title to be Checkout: Complete!');
        const thankyouText = await completePage.thankyouIsOnComplete();
        assert.strictEqual(thankyouText, 'Thank you for your order!', 'Expected text to be Thank you for your order!');

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