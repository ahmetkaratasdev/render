const puppeteer = require("puppeteer");
require("dotenv").config();

const scrapeLogic = async (res) => {
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
  retries = 0
  while (retries < 2) {
    try {
      const page = await browser.newPage();

      // Navigate to the page
      await page.goto('https://developer.chrome.com/', { waitUntil: 'networkidle0' });

      // Set screen size
      await page.setViewport({width: 1080, height: 1024});

      // Type into search box
      console.log("Typing into search box");
      await page.evaluate(() => {
        console.log("Typing into search box");
      });

      await page.type('.devsite-search-field', 'automate beyond recorder');

      // Wait and click on first result
      console.log("waiting for and clicking first result");
      await page.evaluate(() => {
        console.log("waiting for and clicking first result");
      });

      const searchResultSelector = '.devsite-result-item-link';
      await page.waitForSelector(searchResultSelector);
      await page.click(searchResultSelector);
      delay(500);

      // Wait and click on first result
      console.log("Looking for link with text");
      await page.evaluate(() => {
        console.log("Looking for link with text");
      });

      // Locate the full title with a unique string
      const textSelector = await page.waitForSelector(
      'text/Customize and automate'
      );
      const fullTitle = await textSelector.evaluate(el => el.textContent);


      // Print the full title
      console.log('The title of this blog post is "%s".', fullTitle);
      res.status(200).send(`The title of this blog post is ${fullTitle}`);
      break;
    } catch (e) {
      console.error(e);
      console.log(`Something went wrong while running Puppeteer: ${e}. Retrying`);
      if (retries === 1) {
        res.send(`Something went wrong while running Puppeteer: ${e}. Retrying`);
      }
    } 
    retries++;
  }

  await browser.close();
};

const delay = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = { scrapeLogic };