const puppeteer = require("puppeteer");
require("dotenv").config();

const scrapeLogic = async (res) => {

    const browser = await puppeteer.launch({
        args: [
            "--disable-setuid-sandbox",
            "--no-sandbox",
            "--single-process",
            "--no-zygote"
        ],
        // If we are in production, then set puppeteer path in environment variables. Otherwise, use default executable path. 
        executablePath: process.env.NODE_ENV === 'production' ? process.env.PUPPETEER_EXECUTABLE_PATH : puppeteer.executablePath(),
    });
    try {   
        const page = await browser.newPage();

        await page.goto('https://developers.google.com/web/');

        // Type into search box.
        await page.type('.devsite-search-field', 'Headless Chrome');

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
        res.send("Working all fine");
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