let async = require('async')

//并发连接数的计数器
let concurrencyCount = 0
let fetchUrl = function(url,callback){
  //delay的值在2000以内，是个随机数
  let delay = parseInt((Math.random()*10000000)%2000,10)
  concurrencyCount++;
  console.log('现在的并发数是',concurrencyCount,'正在抓取的是',url,'耗时'+delay+'毫秒')
  setTimeout(function(){
    concurrencyCount--;
    callback(null,url+' html content')
  },delay)
}


let urls = []
for(let i=0; i<30; i++){
  urls.push('http://datasource_'+i)
}

async.mapLimit(urls,5,function(url,callback){
  fetchUrl(url,callback);
},function(err,result){
  console.log('final:')
  console.log(result)
})