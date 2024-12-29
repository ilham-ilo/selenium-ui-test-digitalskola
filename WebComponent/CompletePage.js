const { By } = require('selenium-webdriver');

class CompletePage {
    constructor(driver){
        this.driver = driver;
    }

    async titleIsOnComplete(){
        const title = await this.driver.findElement(By.css('.title'));
        return title.getText();
    }

    async thankyouIsOnComplete(){
        const thankYou = await this.driver.findElement(By.css('.complete-header'));
        return thankYou.getText();
    }
}

module.exports = CompletePage;