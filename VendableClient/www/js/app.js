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
  // ['$scope','$http','$ionicModal', '$ionicSideMenuDelegate',
    function($scope,$http,$ionicSideMenuDelegate,$ionicModal){

      $scope.basket=[];

      $scope.toggleLeft = function() {
        console.log("here");
        $ionicSideMenuDelegate.toggleLeft()
      };

      $ionicModal.fromTemplateUrl("search-item-modal.html",{
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal){
        $scope.modal = modal //This change the modal of the scope
      });

      $scope.openSearchModal = function(){
        $scope.modal.show()
      };

      $scope.closeSearchModal = function(){
        $scope.modal.hide()
      }


      $scope.data={};
      $scope.items={};

      $scope.scan=function(){
          $http.get('https://sleepy-scrubland-3514.herokuapp.com/food/'+$scope.data.keyWord)
            .success(function(data){
              $scope.items=data;
            });
      };

      $scope.addItem=function(item){
        $scope.basket.push(item);
        console.log(item)
      }

      $scope.deleteItem=function(item){
        var idx = $scope.basket.indexOf(item);
        $scope.basket.splice(idx,1);
      }
}
// ]
);




