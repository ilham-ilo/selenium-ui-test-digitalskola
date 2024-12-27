const { By } = require('selenium-webdriver');

class CartPage{
    constructor(driver){
        this.driver = driver;
        this.item = By.xpath("//div[@class='cart_item']");
    }

    async titleIsOnCart(){
        const titleCart = await this.driver.findElement(By.xpath("//span[@class='title']"));
        return await titleCart.getText();
    }

    async itemIsOnCart(){
        const cartItems = await this.driver.findElements(this.item);
        return cartItems.length > 0;
    }
}

module.exports = CartPage;