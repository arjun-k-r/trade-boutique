var express = require('express')
var cors = require('cors')
var wagner = require('wagner-core')
var auth = require('./api/middleware/auth')

var port = process.env.PORT || 3000
var ROUTES = './api/routes/'

require('./api/models')(wagner)

var app = express()

app.use(express.static('./client/'))

app.use(cors())

app.use(auth.jwt)
app.use(auth.error)
app.use('/api/news', require(ROUTES + 'news')(wagner))
app.use('/api/price', require(ROUTES + 'price')(wagner))
app.use('/api/data', require(ROUTES + 'symbol-data')(wagner))

app.listen(port, function () {
  console.log('Server running on port ' + port)
})
