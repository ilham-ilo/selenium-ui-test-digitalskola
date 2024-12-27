const { By } = require('selenium-webdriver');

class DashboardPage{
    constructor(driver){
        this.driver = driver;
        this.addToCartButton = By.xpath("//button[@id='add-to-cart-sauce-labs-backpack']");
        this.cartButton = By.css('.shopping_cart_link');
    }

    async titleIsOnDashboard(){
        const title = await this.driver.findElement(By.css('.title'));
        return title.getText();
    }

    async buttonAddCartIsOnDashboard(){
        const buttonAdd = await this.driver.findElement(this.addToCartButton);
        await buttonAdd.click();
    }
    
    async buttonCartIsOnDashboard(){
        const buttonCart = await this.driver.findElement(this.cartButton);
        await buttonCart.click();
    }
}

module.exports = DashboardPage;