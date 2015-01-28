var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var albertsonsSchema = new Schema({
  item: String,
  price: String,
  store: String,
  },
  {
    collection : 'albertsons'
  });

// mongoose.model('albertsons', new Schema({ item: String, price: String, store: String}), 'albertsons');


module.exports = mongoose.model('albertsons', albertsonsSchema);



