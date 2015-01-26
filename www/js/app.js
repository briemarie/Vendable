// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var vendable = angular.module('Vendable', ['ionic'])

vendable.config(function($stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise('/')

  $stateProvider.state('home', {
    url: '/',
    templateUrl: 'templates/home.html'
  })

  $stateProvider.state('new_list', {
    url: '/new_list',
    templateUrl: 'templates/new_list.html'
  })

  $stateProvider.state('all_list', {
    url: '/all_list',
    templateUrl: 'templates/all_list.html'
  })
})

vendable.controller('VendableCtrl',
  // ['$scope','$ionicModal','$http',
  function($scope,$http, $ionicModal){

  $ionicModal.fromTemplateUrl("templates/map_modal.html", {
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
    var map = new GMaps({
      div: '#mapG',
      lat: position.coords.latitude,
      lng: position.coords.longitude
    });
    console.log(position.coords.latitude, position.coords.longitude )
  }
});


