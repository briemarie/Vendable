var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var foods = require('../models/foods.js');
var newStores = [];

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

  var posistion = userInfo['posistion'] // "37.7846064,-122.39755670000001"

  var stores = userInfo['stores'] //['safeway', 'costco', 'whole foods']

  findStoresOnYelp(stores, posistion, res)

});

function findStoresOnYelp(stores, posistion, res){
  for(var i = 0; i < stores.length; i++){
    yelp.search({term: stores[i], limit: 1, ll: posistion }, function(error, data) {
      var name = data['businesses'][0]["name"];
      var location = data['businesses'][0]["location"]['coordinate'];
      var newStore = {name: name, location: location};
      newStores.push(newStore);

      if(newStores.length == stores.length){
        res.json(newStores);
      };

    });
  };


};


module.exports = router;





