var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var router = express.Router();
var cors = require('cors');

var food = require('./routes/food');

var app = express();
app.use(cors());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/', food);
app.use(express.static(path.join(__dirname, 'public')))

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});
