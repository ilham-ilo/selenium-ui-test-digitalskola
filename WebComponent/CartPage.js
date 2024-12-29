const { By } = require('selenium-webdriver');

class CartPage{
    constructor(driver){
        this.driver = driver;
        this.item = By.xpath("//div[@class='cart_item']");
        this.checkoutButton = By.xpath("//button[@id='checkout']");
    }

    async titleIsOnCart(){
        const titleCart = await this.driver.findElement(By.xpath("//span[@class='title']"));
        return await titleCart.getText();
    }

    async itemIsOnCart(){
        const cartItems = await this.driver.findElements(this.item);
        return cartItems.length > 0;
    }

    async clickCheckoutOnCart(){
        await this.driver.findElement(this.checkoutButton).click();
    }
}

module.exports = CartPage;