const pageScraper = require('../scripts/pageScraper.js');
const fs = require('fs');
const xlsx = require('xlsx');
const sleep = require("sleep-promise");

async function scrapeAll(browserInstance){
    let browser;
    try{
        browser = await browserInstance;
        let scrapedData = await pageScraper.scraper(browser);
        const fecha = new Date();
        const hoy = fecha.getDate();
        const mesActual = fecha.getMonth() + 1; 
        const añoActual = fecha.getFullYear();
        const fechaDeHoy = `${hoy}-${mesActual}-${añoActual}`
        fs.writeFile(`./dataJSON/${fechaDeHoy}.json`, JSON.stringify(scrapedData), 'utf8', function(err) {
            if(err) {
                return console.log(err);
            }
        });

        await sleep(2000)
        
        const json = await require(`../../../../dataJSON/${fechaDeHoy}.json`);
        const wb = await xlsx.utils.book_new ();
        const ws = await xlsx.utils.json_to_sheet (json);
            xlsx.utils.book_append_sheet(wb, ws, 'Datos');
            'xlsx/result.xlsx'
            xlsx.writeFile (wb, `Licitaciones/${fechaDeHoy}.xlsx`);
            alert(`La data se procesó con éxito, buscarla en la carpeta 'Licitaciones' como '${fechaDeHoy}.xlsx'`);
              }
        catch(err){
            console.log("No se pudo resolver la instancia del navegador => ", err);
            alert(`No se pudo resolver la instancia del navegador => ${err}`, err);
    
        }
}

module.exports = (browserInstance) => scrapeAll(browserInstance);