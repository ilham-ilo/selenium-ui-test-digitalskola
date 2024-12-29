const { By } = require('selenium-webdriver');

class InputInfoPage {
    constructor(driver){
        this.driver = driver;
        this.firstNameInput = By.xpath("//input[@id='first-name']");
        this.lastNameInput = By.xpath("//input[@id='last-name']");
        this.postalInput = By.xpath("//input[@id='postal-code']");
        this.continueButton = By.xpath("//input[@id='continue']");
    }

    async titleIsOnInputInfo(){
        const title = await this.driver.findElement(By.css('.title'));
        return title.getText();
    }

    async inputInfo(firstName, lastName, postalCode){
        await this.driver.findElement(this.firstNameInput).sendKeys(firstName);
        await this.driver.findElement(this.lastNameInput).sendKeys(lastName);
        await this.driver.findElement(this.postalInput).sendKeys(postalCode);
        await this.driver.findElement(this.continueButton).click();
    }
}

module.exports = InputInfoPage;