const puppeteer = require('puppeteer')

async function startBrowser() {
  let browser
  try {
    console.log('browser start')
    browser = await puppeteer.launch({
      headless: true, // true para no ver los pasos
      args: [
        '--disable-setuid-sandbox',
        '--no-sandbox',
        '--disable-dev-shm-usage'
      ],
      ignoreHTTPSErrors: true
    })
  } catch (error) {
    console.log('cnnot inicialize browser', error)
  }
  return browser
}

module.exports = { startBrowser }
