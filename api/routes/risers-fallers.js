var express = require('express')
var bodyparser = require('body-parser')
var getRisersFallers = require('../services/risers-fallers').getRisersFallers

module.exports = function (wagner) {
  var api = express.Router()

  api.use(bodyparser.json())

  // GET MARKET RISERS / FALLERS
  api.get('/:market?', wagner.invoke(function (RisersFallers) {
    return function (req, res) {
      var market = req.params.market || 'US'

      RisersFallers.findOne({market: market}, function (err, data) {
        if (err) {
          return res
            .status(500)
            .json({error: err.toString()})
        }

        // If market isn't found in database, or records are older than one hour,
        // connect to the API and retrieve data
        if (!data || (Date.now() - new Date(data.updatedAt) >= 1000 * 60 * 60)) {
          getRisersFallers(RisersFallers, market, function (err, stocks) {
            if (err) {
              return res.json({error: 'Could not get market risers/fallers' + err})
            } else {
              res.json({stocks: stocks})
            }
          })
        } else {
          res.json({stocks: data})
        }
      })
    }
  }))

  return api
}
