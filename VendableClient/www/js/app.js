// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var Vendable=angular.module('Vendable',['ionic']);

Vendable.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

Vendable.controller('VendableCtrl',
  // ['$scope','$ionicModal','$http',
  function($scope,$http, $ionicModal){

  $ionicModal.fromTemplateUrl("map-modal.html", {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal){
    $scope.modal = modal
  })

  $scope.openMap = function() {
    $scope.modal.show();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(drawMap)
    }
    else {
      $('#message').text("Geolocation not supported")
    }
  }

  $scope.closeModal = function(){
    $scope.modal.hide();
  }

  // $scope.getLocation = function() {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(drawMap)
  //   }
  //   else {
  //     $('#message').text("Geolocation not supported")
  //   }
  // }
  var drawMap = function(position){
    new GMaps({
      div: '#mapG',
      lat: position.coords.latitude,//parseFloat($('#lat').text()),
      lng: position.coords.longitude //parseFloat($('#lng').text())
    });
  }
});

