var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var config = require('../configuration/config');

mongoose.connect('mongodb://' + config.dbUserName + ':' + config.dbPassWord +'@ds031601.mongolab.com:31601/vendable');

var safeway = require('../models/safeway.js');
var albertsons = require('../models/albertsons.js');
var lucky = require('../models/lucky.js');
var raleys = require('../models/raleys.js');

var request = require('request');
var config = require('../configuration/config');
var parseString = require('xml2js').parseString;
var allItems = [];

var newStores = [];

// contact yelp:
var yelp = require("yelp").createClient({
  consumer_key: config.consumer_key,
  consumer_secret: config.consumer_secret,
  token: config.token,
  token_secret: config.token_secret
});

router.get('/:item&:store', function(req, res, next) {
  findStore = req.params['store']
  findItem = req.params['item']
  findFood(findStore, findItem, req, res);


});

router.get('/yelp/:data', function(req, res, next) {

  var stores = ['Safeway', 'Lucky', 'Albertsons', 'Raleys']

  findStoresOnYelp(stores, req.params.data, res)

});


function findFood(store, item, req, res){
  if (store == "safeway"){
    safeway.find( {"item" : new RegExp('^' + item, 'i')}, function (err, food){
      if (err) return handleError(err);
      res.json(food);
    })
  }
  else if (store == "albertsons"){
    albertsons.find( {"item" : new RegExp('^' + item, 'i')}, function (err, food){
      if (err) return handleError(err);
      res.json(food);
    })
  }
  else if (store == "lucky"){
    lucky.find( {"item" : new RegExp('^' + item, 'i')}, function (err, food){
      if (err) return handleError(err);
      res.json(food);
    })
  }
  else if (store == "raleys"){
    raleys.find( {"item" : new RegExp('^' + item, 'i')}, function (err, food){
      if (err) return handleError(err);
      res.json(food);
    })
  };
};



function findStoresOnYelp(stores, posistion, res){

  for(var i = 0; i < stores.length; i++){
    yelp.search({term: stores[i], limit: 1, ll: posistion }, function(error, data) {
      var name = data['businesses'][0]["name"];
      var location = data['businesses'][0]["location"]['coordinate'];
      var newStore = {name: name, location: location};
      newStores.push(newStore);

      if(newStores.length == stores.length){
        res.json(newStores);
        newStores = [];
      };
    });
  };



};



module.exports = router;



// router.get('/find', function(req, res, next) {
//   findFooditmes();
// });


// function findFooditmes(){
//   for(var i = 30000; i < 69869; i++){

//     request('http://www.supermarketapi.com/api.asmx/COMMERCIAL_SearchByItemID?APIKEY=APIKEY&ItemId=' + i, function (error, response, body) {
//       var newItem;
//        parseString(body, function (err, result) {
//         var itemName = result["ArrayOfProduct_Commercial"]["Product_Commercial"][0]["Itemname"][0];
//         var price = result["ArrayOfProduct_Commercial"]["Product_Commercial"][0]["Pricing"];
//         foods.create({item: itemName, price: price});
//         console.log("{\"item\" => " + "\"" + itemName + "\"," + " \"price\" => " + "\"" + price + "\"," + " store => \"safeway\"}");

//       });

//     });
//   };
// }



