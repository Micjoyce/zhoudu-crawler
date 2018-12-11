const Crawler = require("crawler")
const Book = require('./Book')

const c = new Crawler({
  maxConnections : 10,
  // rateLimit: 1000, // `maxConnections` will be forced to 1
  // This will be called for each crawled page
  callback : function (error, res, done) {
    if(error){
      console.log(error)
    }else{
      const $ = res.$
      // $ is Cheerio by default
      //a lean implementation of core jQuery designed specifically for the server
      console.log($("title").text())
    }
    done()
  }
})

// http://www.ireadweek.com/index.php/index/1.html
function crawlerPage(idx) {
  return new Promise((resolve, reject) => {
    // Queue URLs with custom callbacks & parameters
    c.queue([{
      uri: `http://www.ireadweek.com/index.php/index/${idx}.html`,
      // The global callback won't be called
      callback: function (error, res, done) {
        if(error){
          reject(error)
        }else{
          const result = []
          const $ = res.$
          const allEls = $(".hanghang-list a").toArray()
          allEls.forEach(ele => {
            const url = $(ele).attr('href')
            const name = $(ele).find('.hanghang-list-name').text()
            const num = $(ele).find('.hanghang-list-num').text()
            const zuozhe = $(ele).find('.hanghang-list-zuozhe').text()
            if (name && url && num && zuozhe) {
              result.push({
                name,
                count: num * 1,
                author: zuozhe,
                url: 'http://www.ireadweek.com' + url
              })
            }
          });
          resolve(result)
        }
        done()
      }
    }])
  })
}


const baseUrl = ``

function createArray(len) {
  const arr = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

async function startCrawler(pages) {
  const errorPage = []
  let successPage = 0
  let totalCount = 0
  let arr
  if (Array.isArray(pages)) {
    arr = pages
  } else if (typeof pages === 'number') {
    arr = createArray(pages)
  }
  for (let i = 0, len = arr.length; i < len; i++) {
    try {
      const data = await crawlerPage(i)
      await Book.insertMany(data)
      totalCount += data.length
      successPage += 1
      console.log(`crawler page ${i}, successPaeg: ${successPage}, data length: ${data.length}, totalCount: ${totalCount}`)
    } catch (error) {
      console.log(error)
      errorPage.push(i)
      console.log(`crawler page ${i}, successPaeg: ${successPage}, errorPage: ${errorPage}`)
    }
  }
  return {
    errorPage,
    successPage,
    totalCount,
  }
}

module.exports = {
  crawlerPage,
  startCrawler
}
