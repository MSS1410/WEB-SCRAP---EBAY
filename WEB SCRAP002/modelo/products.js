const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },

  price: { type: String, required: true, trim: true },
  img: { type: String, required: true, trim: true }
})

const Product = mongoose.model('Product', productSchema)
module.exports = Product
