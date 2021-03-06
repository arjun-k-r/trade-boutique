var mongoose = require('mongoose')

var UserSchema = new mongoose.Schema({

  email: {type: String, required: true, lowercase: true, unique: true},

  funds: {type: Number, required: true},

  profile: {
    fullName: {type: String},
    picture: {type: String, match: /^(https?:\/\/)/i}
  },

  portfolio: [{
    symbol: {type: String, required: true, uppercase: true},
    company: {type: String},
    price: {type: Number, required: true},
    quantity: {type: Number, required: true},
    modified: {type: Date, default: Date.now()}
  }]

}, {timestamps: true})

UserSchema.index({email: 1})

module.exports = UserSchema

/*

THE USER SCHEMA WAS GOING TO BE MUCH MORE ELABORATE,
THAT'S WHY THERE'S A LOT OF COMMENTED CODE BELOW

WHEN I SWITCHED TO AUTH0 AUTHENTICATION, ALL THE SCHEMA'S
AUTHENTICATION METHODS BECAME OBSOLETE

THE USE OF DIFFERENT TYPES OF CURRENCIES IS ONE OF THE
THINGS ON MY TODO LIST

var bcrypt = require('bcrypt')

var CURRENCIES = ['USD', 'EUR', 'GBP']
var DEFAULT_CURRENCY = 'USD'

var SALT_ROUNDS = 10
var MAX_LOGIN_ATTEMPTS = 5
var LOCK_TIME = 15 * 60 * 1000 // 15 min

// RegExp for matching email address + error message
var emailMatch = [
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  'Email {VALUE} is invalid!']

// Part of user schema
  funds: [{
    currency: {type: String, enum: CURRENCIES, default: DEFAULT_CURRENCY},
    cash: {type: Number, required: true}
  }],

  data: {
    oauth: {type: String, default: ''},
    password: {type: String},
    loginAttempts: {type: String, required: true, default: 0},
    lockUntil: {type: Number}
  },

var currencySymbols = {'USD': '$', 'EUR': '€', 'GBP': '£'}

// add timestamps for every new user and allow virtuals
UserSchema.set('toObject', { virtuals: true })
UserSchema.set('toJSON', { virtuals: true })

UserSchema.virtual('isLocked').get(function () {
  return !!(this.data.lockUntil && this.data.lockUntil > Date.now())
})

UserSchema.pre('save', function (next) {
  var user = this

  if (user.isDirectModified('data.password') || user.isNew) {
    bcrypt.hash(user.data.password, SALT_ROUNDS, function (err, hash) {
      if (err) return next(err)

      user.data.password = hash
      next()
    })
  } else {
    return next()
  }
})

Trade Boutique  Copyright (C) 2017  Daniel Nitu
// hash the user password before saving it
UserSchema.pre('save', function (next) {
  var user = this

  if (user.data.oauth !== '') { return next() }

  if (!user.isDirectModified('data.password')) { return next() }

  bcrypt.hash(user.data.password, SALT_ROUNDS, function (err, hash) {
    if (err) return next(err)
    user.data.password = hash
    next()
  })
})

// return user funds for one or all currencies in readable format
UserSchema.methods.showFunds = function (currency) {
  var allFunds = []
  var userFunds = this.funds
  for (var i = 0; i < userFunds.length; i++) {
    var humanReadableFunds = currencySymbols[userFunds[i].currency] + '' + userFunds[i].cash
    if (currency) {
      if (userFunds[i].currency === currency) {
        return humanReadableFunds
      } else {
        return 'No funds available in ' + currency
      }
    } else {
      allFunds.push(humanReadableFunds)
    }
  }
  return allFunds
}

UserSchema.methods.comparePassword = function (userPass, cb) {
  bcrypt.compare(userPass, this.data.password, function (err, isMatch) {
    if (err) return cb(err)
    cb(null, isMatch)
  })
}

UserSchema.methods.increaseLoginAttemtps = function (cb) {
    // check for previous locks
  if (this.data.lockUntil && this.data.lockUntil < Date.now()) {
    return this.update({
      $set: {loginAttempts: 1},
      $unset: {lockUntil: 1}
    }, cb)
  }

  var updates = { $inc: {loginAttempts: 1} }
  if (this.data.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
    updates.$set = {lockUntil: Date.now() + LOCK_TIME}
  }
  return this.update(updates, cb)
}

var reasons = UserSchema.statics.failedLogin = {
  NOT_FOUND: 0,
  PASSWORD_INCORRECT: 1,
  MAX_ATTEMPTS: 2
}

UserSchema.statics.authenticate = function (email, password, cb) {
  this.findOne({email: email}, function (err, user) {
    if (err) return cb(err)

    if (!user) return cb(null, null, reasons.NOT_FOUND)

    if (user.isLocked) {
      return user.increaseLoginAttemtps(function (err) {
        if (err) return cb(err)
        return cb(null, null, reasons.MAX_ATTEMPTS)
      })
    }

    user.comparePassword(password, function (err, isMatch) {
      if (err) return cb(err)

      if (isMatch) {
        if (!user.data.loginAttempts && !user.data.lockUntil) { return cb(null, user) }

        var updates = {
          $set: {loginAttempts: 0},
          $unset: {lockUntil: 1}
        }

        return user.update(updates, function (err) {
          if (err) return cb(err)
          return cb(null, user)
        })
      }

      user.increaseLoginAttemtps(function (err) {
        if (err) return cb(err)
        return cb(null, null, reasons.PASSWORD_INCORRECT)
      })
    })
  })
}
*/
