var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var raleysSchema = new Schema({
  item: String,
  price: String,
  store: String
  },
  {
    collection : 'raleys'
  });


module.exports = mongoose.model('raleys', raleysSchema);


