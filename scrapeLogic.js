const puppeteer = require("puppeteer");

const scrapeLogic = async (res) => {

    const browser = await puppeteer.launch();
    try {   
        const page = await browser.newPage();

        await page.goto('https://developers.google.com/web/');

        // Type into search box.
        await page.locator('.devsite-search-field').fill('Headless Chrome');
        //   await page.type('.devsite-search-field', 'Headless Chrome');

        // Wait for suggest overlay to appear and click "show all results".
        const allResultsSelector = '.devsite-suggest-all-results';
        await page.waitForSelector(allResultsSelector);
        await page.click(allResultsSelector);

        // Wait for the results page to load and display the results.
        const resultsSelector = '.gsc-table-result a.gs-title[href]';
        await page.waitForSelector(resultsSelector);


        // Extract the results from the page.
        const links = await page.evaluate(resultsSelector => {
            const anchors = Array.from(document.querySelectorAll(resultsSelector));
            return anchors.map(anchor => {
            const title = anchor.textContent.split('|')[0].trim();
            return `${title} - ${anchor.href}`;
            });
        }, resultsSelector);
        console.log(links.join('\n'));
    } catch (e) {
        console.error(e);
        res.send(`Something went wrong while running puppeteer ${e}`);
    } finally {   
        await browser.close();
    }
}

    const delay = async (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    };

module.exports = {scrapeLogic};