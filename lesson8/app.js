let express = require('express')

let fibonacci = function(n){
  // typeof NaN === 'number' 是成立的，所以要判断 NaN
  if(typeof n !== 'number' || isNaN(n)){
    throw new Error('n should be a Number')
  }
  if(n<0){
    throw new Error('n should >= 0')
  }
  if(n>10){
    throw new Error('n should <= 10')
  }
  if(n===0){
    return 0
  }
  if(n===1){
    return 1
  }
  return fibonacci(n-1) + fibonacci(n-2)
}

let app = express()

app.get('/fib',function(req, res){
  //http传来的东西默认都是没有类型的，都是string，所以我们要手动转换类型
  let n = Number(req.query.n)
  try{
    res.send(String(fibonacci(n)))
  } catch(e){
    res
      .status(500)
      .send(e.message);
  }
});

module.exports = app

app.listen(3000, function(){
  console.log('app is listening at port 3000')
})