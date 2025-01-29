const browserObject = require('./browser')
const scrapeController = require('./pageController')
const fs = require('fs')
const connectDB = require('./db')
require('dotenv')

connectDB()

let browserInstance = browserObject.startBrowser()

browserInstance.then(async (browser) => {
  let scrapedData = await scrapeController(browser)
  await browser.close()

  fs.writeFile('products.json', JSON.stringify(scrapedData, null, 2), (err) => {
    if (err) {
      console.log('error guardando json', err)
    } else {
      console.log('ok datos en json')
    }
  })
})
