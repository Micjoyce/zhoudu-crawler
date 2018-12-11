const { connect } = require('./mongodb')
const { startCrawler } = require('./crawler')

async function bootStrat() {
  // connection mongodb
  await connect()
  // start crawler
  const result = await startCrawler(238)
  console.log('Done ===> ', result)
}

bootStrat()