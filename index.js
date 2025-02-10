const cowsay = require("cowsay")
const math = require('./math')

//let res = math.add(2, 10)
//let res2 = math.minus(8, 10)

const CC = require('currency-converter-lt')
//let currencyConverter = new CC({from:"USD", to:"EUR", amount:100})
//currencyConverter.convert(100).then((response) => {
//console.log(response) //or do something else
//})
const fs = require('fs')

//let result = fs.readFileSync('some.txt', 'utf-8')

//console.log(result)

//fs.writeFileSync('some.txt', result + '\nhello world')
//fs.mkdir('text-filies', () => { 
//    fs.writeFile('./text-filies/some.txt', 'hello', () => {})
//})
//fs.unlink('./text-filies/some.txt', () => {
//    fs.rmdir('./text-filies', () => { })
// })
const http = require('http')
let server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    console.log(req.url)
    if (req.url == '/') {
        fs.createReadStream('./templates/index.html').pipe(res);
    }
    else if (req.url == '/about') {
        fs.createReadStream('./templates/about.html').pipe(res);
    }
    else if (req.url == '/favicon.ico') {
    }
    else {
        fs.createReadStream('./templates/error.html').pipe(res);
    }

})

const PORT = 3000
const HOST = 'localhost'

server.listen(PORT, HOST, () => {
    console.log(`сервер запущен: http://${HOST}:${PORT}`)
})
