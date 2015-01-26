var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var foods = require('../models/foods.js');
var request = require('request');
var config = require('../configuration/config');

var allItems = [];

var newStores = [];

// contact yelp:
var yelp = require("yelp").createClient({
  consumer_key: config.consumer_key,
  consumer_secret: config.consumer_secret,
  token: config.token,
  token_secret: config.token_secret
});

// router.get('/find', function(req, res, next) {
//   findFooditmes();
// });


// function findFooditmes(){
//   for(var i = 69870; i < 89999; i++){

//     request('http://www.supermarketapi.com/api.asmx/COMMERCIAL_SearchByItemID?APIKEY=APIKEY&ItemId=' + i, function (error, response, body) {
//       var newItem;
//        parseString(body, function (err, result) {
//         var itemName = result["ArrayOfProduct_Commercial"]["Product_Commercial"][0]["Itemname"][0];
//         var price = result["ArrayOfProduct_Commercial"]["Product_Commercial"][0]["Pricing"];
//         foods.create({item: itemName, price: price});
//         console.log("item: " + itemName + " price: " + price);

//       });

//     });
//   };
// }



router.get('/', function(req, res, next) {

  foods.find(function (err, allFoods) {
    res.json(allFoods);
  });
});

router.get('/:letter', function(req, res, next) {

  foods.find( {"item" : new RegExp('^' + req.params.letter, 'i')}, function (err, food){
    if (err) return handleError(err);
    res.json(food);
  })

});

router.get('/yelp/:data', function(req, res, next) {


  var stores = ['Safeway', 'Costco', 'Lucky', 'Albertsons', 'Raleys']

     // "37.7846064,-122.39755670000001"


  findStoresOnYelp(stores, req.params.data, res)

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
        newStores = [];
      };
    });
  };



};




// function writeToDisk(writeString) {

//   fs.writeFile("test", writeString, function(err) {
//       if(err) {
//           console.log(err);
//       } else {
//           console.log("The file was saved!");
//       }
//   });
// }



module.exports = router;





