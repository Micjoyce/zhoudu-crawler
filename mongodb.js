const mongoose = require('mongoose')

const mongoUrl = 'mongodb://localhost:27017/zhoudu_article'

const connect = () => {
  return new Promise((resolve, reject) => {
    mongoose.connect(mongoUrl, { useNewUrlParser: true })
    mongoose.connection.on('error', (error) => {
      reject('connection error', error)
    })
    mongoose.connection.once('open', () => {
      resolve('connect success')
    })
  })
}

module.exports = {
  connect,
}