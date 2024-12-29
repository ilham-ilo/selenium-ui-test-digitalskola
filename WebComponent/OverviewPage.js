const { By } = require('selenium-webdriver');

class OverviewPage {
    constructor(driver){
        this.driver = driver;
        this.item = By.xpath("//div[@class='cart_item']");
        this.finishButton = By.xpath("//button[@id='finish']");
    }

    async titleIsOnOverview(){
        const title = await this.driver.findElement(By.css('.title'));
        return title.getText();
    }

    async itemIsOnOverview(){
        const itemOverview = await this.driver.findElements(this.item);
        return itemOverview.length > 0;
    }

    async paymentInfoIsOnOverview(){
        const paymentInfo = await this.driver.findElement(By.xpath("//div[.='SauceCard #31337']"));
        return paymentInfo.getText();
    }

    async priceTotalIsOnOverview(){
        const priceTotal = await this.driver.findElement(By.xpath("//div[@class='summary_total_label']"));
        return priceTotal.getText();
    }
    
    async clickFinishOnOverview(){
        const buttonFinish = await this.driver.findElement(this.finishButton);
        await buttonFinish.click();
    }
}

module.exports = OverviewPage;