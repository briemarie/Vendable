var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var foods = require('../models/foods.js');

// contact yelp:
var yelp = require("yelp").createClient({

});

router.get('/', function(req, res, next) {
  foods.find(function (err, allFoods) {
    res.json(allFoods);
  });
});

router.get('/:letter', function(req, res, next) {

  foods.find( {"type" : new RegExp('^' + req.params.letter, 'i')}, function (err, food){
    if (err) return handleError(err);
    res.json(food);
  })

});

router.get('/yelp/:userInfo', function(req, res, next) {

  var posistion = "37.7846064,-122.39755670000001"

  var stores = ['safeway', 'costco', 'whole foods']

  var foundStores = [];

  for(var i = 0; i < stores.length; i++){

    yelp.search({term: stores[i], limit: 1, ll: posistion }, function(error, data) {
      var name = data['businesses'][0]["name"];
      var location = data['businesses'][0]["location"]['coordinate'];
      var foundStore = {name: name, location: location};
      foundStores.push(foundStore);
    });


  };

      console.log(foundStores);

});


module.exports = router;







