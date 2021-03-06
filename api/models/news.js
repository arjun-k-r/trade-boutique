var mongoose = require('mongoose')

var NewsSchema = new mongoose.Schema({

  symbol: {type: String, required: true, uppercase: true},
  logo: {type: String, match: /^(https?:\/\/)/i},
  news: [{
    title: {type: String},
    link: {type: String, match: /^(https?:\/\/)/i},
    picture: {type: String, match: /^(https?:\/\/)/i},
    date: {type: Date},
    description: {type: String}
  }],
  newData: {type: Boolean, default: true}
}, {timestamps: true})

NewsSchema.index({symbol: 1})

module.exports = NewsSchema
