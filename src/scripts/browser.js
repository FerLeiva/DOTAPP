const puppeteer = require('puppeteer');

async function startBrowser(){
    let browser;
    try {
        console.log("Abriendo el navegador...");
        browser = await puppeteer.launch({
            'ignoreHTTPSErrors': true,
            headless: false,
            args: [
                '--disable-setuid-sandbox',
                '--no-sandbox',
         ]
      
        });
    } catch (err) {
        console.log("No se pudo crear una instancia de navegador => : ", err);
    }
    return browser;
}

module.exports = {
    startBrowser
};