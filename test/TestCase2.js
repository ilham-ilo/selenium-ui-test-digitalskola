const { Builder } = require('selenium-webdriver');
const LoginPage = require('../WebComponent/LoginPage');
const assert = require('assert');
const fs = require('fs');
require('dotenv').config();

const browser = process.env.BROWSER;
const baseUrl = process.env.BASE_URL;

const screenshotDir = './screenshots/';
if(!fs.existsSync(screenshotDir)){
    fs.mkdirSync(screenshotDir, {recursive: true});
}

describe('TestCase 2 [login] #Smoke', function () {
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
        await loginPage.login('haha', 'hihi');
    });

    //assertion atau validasi
    it('Error message appears for invalid credentials', async function(){
        const loginPage = new LoginPage(driver);
        const errorMessage = await loginPage.getErrorMessage();
        assert.strictEqual(errorMessage, 'Epic sadface: Username and password do not match any user in this service', 'Expected error message does not match');
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