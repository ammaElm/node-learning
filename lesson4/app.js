let cheerio = require('cheerio')
let superagent = require('superagent')
let eventproxy = require('eventproxy')
let url = require('url')

let cnodeUrl = 'https://cnodejs.org/'

superagent.get(cnodeUrl)
  .end(function(err, res){
    if(err){
      return console.log(err)
    }

    let topicUrls = []
    let $ = cheerio.load(res.text)
    $('#topic_list .topic_title').each(function(idx, element){
      let $element = $(element)
      let href = url.resolve(cnodeUrl, $element.attr('href'));
      //拼接cnodeUr+href中内容
      topicUrls.push(href)
    })

    let ep = new eventproxy()
    ep.after('topic_html',topicUrls.length,function(topics){
      // topics 是个数组，包含了 40 次 ep.emit('topic_html', pair) 中的那 40 个 pair

      topics = topics.map(function(topicPair){
        // 接下来都是 jquery 的用法了
        let topicUrl = topicPair[0]
        let topicHtml = topicPair[1]
        let scores = topicPair[2]
        //ep.emit('topic_html',[topicUrl,res.text])对应[topicUrl,res.text]
        let $ = cheerio.load(topicHtml)
        return ({
          title: $('.topic_full_title').text().trim(),
          href: topicUrl,
          comment1: $('.reply_content').eq(0).text().trim(),
          author: $('.changes span').eq(1).find('a').text().trim(),
          scores: scores
        })
      })
      console.log('FINAL:')
      console.log(topics)
    })

    topicUrls.forEach(function(topicUrl){
      superagent.get(topicUrl)
      .end(function(err, res){
        console.log('fetch ' + topicUrl + ' successful')
        //获取个人积分
        let $ = cheerio.load(res.text)
        let authorURL = $('.changes span').eq(1).find('a').attr('href')
        authorURL = authorURL?'https://cnodejs.org' + authorURL:''
        console.log(authorURL)
        if(authorURL){
          superagent.get(authorURL)
            .end(function(err, resmore){
              let $ = cheerio.load(resmore.text)
              let scores = $('.unstyled .big').text().trim() 
              ep.emit('topic_html',[topicUrl,res.text,scores])             
            })
        }else{
          ep.emit('topic_html',[topicUrl,res.text,''])
        }
        // ep.emit('topic_html',[topicUrl,res.text,scores])
      })
    })

    // console.log(topicUrls)

  })

