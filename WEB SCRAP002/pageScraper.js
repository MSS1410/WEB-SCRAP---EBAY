const Product = require('./modelo/products')

//VERSION PARA TODAS LAS PAGINAS

const scraperObject = {
  url: 'https://www.ebay.com/',
  async scraper(browser) {
    let page = await browser.newPage()
    console.log('to https://www.ebay.com/ ')

    // Antibot
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36'
    )

    try {
      await page.goto(this.url, { waitUntil: 'domcontentloaded' })

      // Step 1 - Buscar Fernando Alonso
      // barra buscadora
      await page.waitForSelector("input[aria-label='Search for anything']")
      await page.type(
        "input[aria-label='Search for anything']",
        'Fernando Alonso'
      )

      //boton busqueda
      await page.waitForSelector('#gh-search-btn')
      await page.click('#gh-search-btn')

      await page.waitForNavigation({ waitUntil: 'domcontentloaded' })

      console.log('Search done, start scrap')

      let scrapedData = []

      async function scrapeAllPages() {
        console.log('Scraping on this page')
        // espero resultados
        await page.waitForSelector('#srp-river-main .srp-results', {
          timeout: 10000
        })
        // selecciono por li y extraigo datos que me interesen
        let products = await page.$$eval(
          '#srp-river-main .srp-results li.s-item',
          (items) => {
            return items.map((item) => {
              const nameProduct = item.querySelector('.s-item__title')
              const priceProduct = item.querySelector('.s-item__price')
              const imgProduct = item.querySelector(
                '.s-item__image-wrapper img'
              )
              // retorno si existe nameproduct el texto y trimeo para espacios, sino 'no found'
              return {
                name: nameProduct ? nameProduct.innerText.trim() : 'No found',
                price: priceProduct
                  ? priceProduct.innerText.trim()
                  : 'No found',
                img: imgProduct ? imgProduct.src : 'No found'
              }
            })
          }
        )

        scrapedData.push(...products)

        console.log(`Extracted ${scrapedData.length} products.`)

        // Guardar en MongoDB
        console.log('Saving to MongoDB...')
        await Product.insertMany(scrapedData)
        console.log('OK TO Mongo')

        // buscamos siguiente pagina
        let nextButton = await page.$('a.pagination__next')
        if (nextButton) {
          console.log('Step to next page')
          await Promise.all([
            page.click('a.pagination__next'),
            page.waitForNavigation({ waitUntil: 'domcontentloaded' })
          ])
          return scrapeAllPages() // re llamada de funcion para seguir scrap
        } else {
          console.log('✅ Última página alcanzada.')
        }
      }

      await scrapeAllPages()

      if (scrapedData.length === 0) {
        console.log('No products')
        return []
      }

      console.log(`OK DATA: ${scrapedData.length} products`)
      return scrapedData
    } catch (error) {
      console.error('Scraping problem', error)
      return []
    }
  }
}

module.exports = scraperObject

//VERSION PARA LA PRIMERA PAGINA
// const scraperObject = {
//   url: 'https://www.ebay.com/',
//   async scraper(browser) {
//     let page = await browser.newPage()
//     console.log(`going to  'https://www.ebay.com/`)

//     // Antibot
//     await page.setUserAgent(
//       'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36'
//     )

//     try {
//       await page.goto(this.url, { waitUntil: 'domcontentloaded' })

//       // Step 1 - Buscar Fernando Alonso
//       //search bar
//       await page.waitForSelector("input[aria-label='Search for anything']")
//       await page.type(
//         "input[aria-label='Search for anything']",
//         'Fernando Alonso'
//       )
//       //search button
//       await page.waitForSelector('#gh-search-btn')
//       await page.click('#gh-search-btn')

//       await page.waitForNavigation({ waitUntil: 'domcontentloaded' })

//       console.log(' Search OK, only first page')
//       // array general
//       let scrapedData = []

//       async function scrapeFirstPage() {
//         console.log('Scraping products')

//         await page.waitForSelector('#srp-river-main .srp-results', {
//           timeout: 10000
//         })
//         // busco la lista de los productos y selecciono nombre imagen y precio de cada Producto
//         let products = await page.$$eval(
//           '#srp-river-main .srp-results li.s-item',
//           (items) => {
//             return items.map((item) => {
//               const nameProduct = item.querySelector('.s-item__title')
//               const priceProduct = item.querySelector('.s-item__price')
//               const imgProduct = item.querySelector(
//                 '.s-item__image-wrapper img'
//               )
//               // devuelvo cada seleccion
//               return {
//                 name: nameProduct ? nameProduct.innerText.trim() : 'Cant find',
//                 price: priceProduct
//                   ? priceProduct.innerText.trim()
//                   : 'Cant find',
//                 img: imgProduct ? imgProduct.src : 'Cant find'
//               }
//             })
//           }
//         )

//         scrapedData.push(...products)

//         console.log(`Exctrcact ${scrapedData.length} products from first page.`)

//         // Guardar en MongoDB
//         console.log('Saving to MongoDB...')
//         await Product.insertMany(scrapedData)
//         console.log('OK IMPORT MongoDB ')
//       }

//       await scrapeFirstPage()

//       if (scrapedData.length === 0) {
//         console.log('Noo products found')
//         return []
//       }

//       console.log(`OK data: ${scrapedData.length} products`)
//       return scrapedData
//     } catch (error) {
//       console.error('Wrong Scraping', error)
//       return []
//     }
//   }
// }

// module.exports = scraperObject
