var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var luckySchema = new Schema({
  item: String,
  price: String,
  store: String,
  },
  {
    collection : 'lucky'
  });


module.exports = mongoose.model('lucky', luckySchema);


