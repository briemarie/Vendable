var mongoose = require('mongoose');

var foodSchema = {
  type: String,
  stores: {}
}

module.exports = mongoose.model('food', foodSchema);