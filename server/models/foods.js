var mongoose = require('mongoose');
var config = require('../configuration/config');
// mongoose.connect('mongodb://localhost/food');
mongoose.connect('mongodb://' + config.dbUserName + ':' + config.dbPassWord +'@ds031601.mongolab.com:31601/vendable');
var Schema = mongoose.Schema;

var foodsSchema = new Schema({
  item: String,
  price: String
});

module.exports = mongoose.model('foods', foodsSchema);


