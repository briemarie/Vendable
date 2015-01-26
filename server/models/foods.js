var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/food');
mongoose.connect('mongodb://lancetipton04:tipton55@ds031601.mongolab.com:31601/vendable');
var Schema = mongoose.Schema;

var foodsSchema = new Schema({
  item: String,
  price: String
});

module.exports = mongoose.model('foods', foodsSchema);


