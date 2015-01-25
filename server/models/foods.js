var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/food');
// mongoose.connect('mongodb://lance:lance@ds031601.mongolab.com:31601/vendable');
var Schema = mongoose.Schema;

var foodsSchema = new Schema({
  type: { type: [String], index: "text" },
  stores: {}
});

module.exports = mongoose.model('foods', foodsSchema);