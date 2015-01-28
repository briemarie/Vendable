var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var safewaySchema = new Schema({
    item: String,
    price: String,
    store: String,
  },
  {
    collection : 'safeway'
  });



module.exports = mongoose.model('safeway', safewaySchema);


