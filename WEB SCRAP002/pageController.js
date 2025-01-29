const pageScraper = require('./pageScraper')

async function scrapeAll(browserInstance) {
  let browser
  try {
    browser = await browserInstance
    let scrapedData = await pageScraper.scraper(browser)
    await browser.close()

    return scrapedData
  } catch (err) {
    console.error('cannot resolve instance on browser', err)
  }
}

module.exports = (browserInstance) => scrapeAll(browserInstance)
