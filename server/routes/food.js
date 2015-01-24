var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var food = require('../models/food.js');


router.get('/', function(req, res, next) {
  food.find(function (err, foods) {
    res.json(foods);
  });
});


router.post('/', function(req, res, next) {
  food.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});


router.get('/:id', function(req, res, next) {
  food.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});


router.put('/:id', function(req, res, next) {
  food.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});


router.delete('/:id', function(req, res, next) {
  food.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
