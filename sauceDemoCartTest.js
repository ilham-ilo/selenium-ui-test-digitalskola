const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');

async function sauceDemoCartTest() {
    // Membuat koneksi dengan Browser Driver
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        //Buka URL di broswer
        await driver.get("https://www.saucedemo.com");

        //Masukkan username dan password
        await driver.findElement(By.id('user-name')).sendKeys('standard_user');
        await driver.findElement(By.xpath("//input[@id='password']")).sendKeys('secret_sauce');

        //Click button login
        await driver.findElement(By.xpath("//input[@id='login-button']")).click();

        //Memastikan kita di dashboard dengan mencari judul "Swag Labs"
        let titleText = await driver.findElement(By.xpath("//div[@class='app_logo']")).getText();
        assert.strictEqual(titleText.includes('Swag Labs'), true, "Title does not include text 'Swag Labs'");

        //Memastikan kita di dashboard dengan mencari button "Burger Button"
        let menuButton = await driver.findElement(By.xpath("//button[@id='react-burger-menu-btn']"));
        assert.strictEqual(await menuButton.isDisplayed(), true, "Menu button is not visible");

        //Click button Add to Cart
        await driver.findElement(By.xpath("//button[@id='add-to-cart-sauce-labs-backpack']")).click();

        //Memastikan button Add to Cart berubah jadi Remove
        let removeButton = await driver.findElement(By.xpath("//button[@id='remove-sauce-labs-backpack']"));
        assert.strictEqual(await removeButton.isDisplayed(), true, "Remove button is not visible");

        //Memastikan button Cart ada di halaman
        let cartButton = await driver.findElement(By.xpath("//div[@id='shopping_cart_container']"));
        assert.strictEqual(await cartButton.isDisplayed(), true, "Cart button is not visible");

        //Memastikan button Cart bertambah jumlahnya
        let cartBadge = await driver.findElement(By.xpath("//span[@class='shopping_cart_badge']"));
        assert.strictEqual(await cartBadge.isDisplayed(), true, "Cart badge is not visible");
        
        //Memastikan button Cart bertambah jumlahnya menjadi 1
        let badgeCount = await cartBadge.getText();
        assert.strictEqual(badgeCount, '1', "Cart badge count is not 1");

        //Click button Cart
        await driver.findElement(By.xpath("//a[.='1']")).click();

        //Memastikan item berada di dalam Cart
        let itemCart = await driver.findElement(By.xpath("//div[@class='cart_item']"));
        assert.strictEqual(await itemCart.isDisplayed(), true, "Item in cart is not visible");

    } finally {
        await driver.quit();
    }
}

sauceDemoCartTest()