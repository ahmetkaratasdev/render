const express = require("express");
const app = express();
const {scrapeLogic} = require("./scrapeLogic");

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
    res.send("Render Puppeteer server is up and running");
})

app.get("/scrape", (req, res) => {
    scrapeLogic(res);
})

app.listen(4000, () => {
    console.log(`Listening on port ${PORT}`);
})