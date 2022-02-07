const sleep = require("sleep-promise");

const scraperObject = {
    url: 'https://dota.sistemasanantonio.com.ar/licitaciones/index_prove.aspx',
    async scraper(browser){
        let page = await browser.newPage();
        console.log(`Navegando a ${this.url} e iniciando sesion...`);
        // Navegar a la pagina de inicio
        await page.goto(this.url);

        const userType = '#inputEmail';
        const user = 'marianos@cromosol.com';
        const passwordType = "#inputPassword";
        const password = "compras9";

        await page.waitForSelector(userType, {visible: true, timeout: 3000 });
        await page.type(userType, user);

        await page.waitForSelector(passwordType, {visible: true, timeout: 3000 });
        await page.type(passwordType, password);
      
        await page.click('.btn');
        await page.goto('https://dota.sistemasanantonio.com.ar/licitaciones/grilla_licitaciones_prove.aspx');
        let scrapedData = [];
        await sleep(1000)
        async function scrapeCurrentPage(){
        // Obtener el link de todas las licitaciones requeridas
        await sleep(1000)
        let urls = await page.evaluate(() => {
        // Extraer los links de la data
            const elements = document.querySelectorAll('[align=center] a');
            const links = [];
            for (let element of elements) {
                links.push(element.href);
            }
            return links;
        });
        console.log(`Numero de licitaciones encontradas: ${urls.length}`)


        // Iterar a traves de cada link, abrir una nueva instancia de pagina y obtener la data relevante de cada una
        let pagePromise = (link) => new Promise(async(resolve, reject) => {
            let dataLic = {};
            let newPage = await browser.newPage();
            let Items = [];
            console.log(`Navegando a ${link} y obteniendo data...`);
            await newPage.goto(link);
            await sleep(2000)
            
            // Obtener cantidad de items en la licitacion
            let cantItem = await newPage.evaluate(() => {
            // Extraer los items de la data
                const elements = document.querySelectorAll('[value=cotizar]');
                const items = [];
                for (let element of elements) {
                    items.push(element.id);
                }
                return items;
            });

            // Obtener numero y fecha de licitacion
            dataLic['Licitacion Num'] = await newPage.$eval('#MainContent_lbl_nro_licitacion', text => text.textContent);
            dataLic['Fecha'] = await newPage.$eval('#MainContent_lbl_fec_lic', text => text.textContent);
            

            for(num in cantItem){
                await newPage.click(`#MainContent_grd_articulos_btn_cotizar_${num}`);
                await sleep(1000)
                dataLic[`Art${num}`] = await newPage.$eval('#MainContent_lbl_sin_cot_id_art', text => text.textContent);
                dataLic[`Cod${num}`] = await newPage.$eval('#MainContent_lbl_cod', text => text.textContent);
                dataLic[`Cant${num}`] = await newPage.$eval('#MainContent_lbl_sin_cot_stock', text => text.textContent);
                await newPage.click('#MainContent_ddl_sin_cot_art_id_interno');
                await sleep(1000)

                let cantOem = await newPage.evaluate(() => {
                    // Extraer las OEM de la data
                        const elements = document.querySelectorAll('#MainContent_ddl_sin_cot_art_id_interno option');
                        const oems = [];
                        for (let oem of elements) {
                            oems.push(oem.value);
                        }
                        return oems;
                    });
                
                for (oem in cantOem) {
                    dataLic[`OEM${num}.${oem}`] = cantOem[oem]
                }
                await newPage.click('.close');
            }
            resolve(dataLic);
            await sleep(1000)
            await newPage.close();
        });

        for(link in urls){
            let currentPageData = await pagePromise(urls[link]);
            scrapedData.push(currentPageData);
        }
        await page.close();
        return scrapedData;
    }
    let data = await scrapeCurrentPage();
    return data;
    }
}

module.exports = scraperObject;