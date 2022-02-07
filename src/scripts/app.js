const browserObject = require('../scripts/browser');
const scrapedController = require('../scripts/pageController');

//Iniciar el navegador y crear una instancia una instancia de navegacion
async function start () {
    alert(`Usted está por obtener data del sitio https://dota.sistemasanantonio.com.ar, haga click en aceptar para proceder, de lo contrario cierre la aplicación`);
    let browserInstance = browserObject.startBrowser();

    await scrapedController(browserInstance)
}

//Pasar la instancia de navegacion al controlador de scrapping