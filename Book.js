const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
  name: String,
  count: Number,
  author: String,
  url: String,
}, {
  timestamps: true
})


const Book = mongoose.model('Book', bookSchema)
module.exports = Book
