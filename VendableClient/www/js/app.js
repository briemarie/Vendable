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

Vendable.config(function($stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise('/')

  $stateProvider.state('home',{
    url: '/',
    templateUrl: 'templates/home.html'
  });

  $stateProvider.state('index',{
    url: '/index',
    templateUrl: 'templates/index.html'
  });

  $stateProvider.state('new_list', {
    url: '/new_list',
    templateUrl: 'templates/new_list.html'
  })

  $stateProvider.state('all_list', {
    url: '/index',
    templateUrl: 'templates/index.html'
  })

});



Vendable.factory('searchItemsService',function($http){
      return{
            scan:function(keyWord){

            // return $http.get('http://aqueous-beyond-9351.herokuapp.com/food/'+keyWord)
            return $http.get("http://localhost:9393")
                    .then(function(response){
                      return response.data;
                    })
            }
            }
});

Vendable.factory('Lists',function(){
  return{
    all:function(){
      var listsString=window.localStorage['lists'];
      if(listsString){
        return angular.fromJson(listsString);
      }
      return [];
    },

    save:function(listName){
      window.localStorage['lists']=angular.toJson(listName);
    },

    newList:function(listName,id){
      return{
        id:id,
        title:listName,
        items:[]
      }
    },

    removeList:function(listObject){
      console.log("I m here");
      var list=angular.fromJson(window.localStorage['lists']);
      var updatedList=list.filter(function(el){
        return el.title !== listObject.title
      })
      window.localStorage['lists']=angular.toJson(updatedList);
    },

    getLastActiveList:function(){
      return parseInt(window.localStorage['lastActiveList']) || 0;
      console.log(window.localStorage['lastActiveList'])
      //return index number 0 if no prior active list
    },

    setLastActiveList:function(idx){
      window.localStorage['lastActiveList']=idx;
    }

  }
})

Vendable.controller('VendableCtrl',
  // ['$scope','$http','$ionicModal',
    function($scope,searchItemsService,Lists,$ionicModal,$ionicSideMenuDelegate, $http){
      $scope.lists=Lists.all();//This is an array

      var createList=function(listName){
        var id = function(){
          if($scope.lists.length === 0){
            return 0
          }else{
          return $scope.lists[$scope.lists.length-1].id+1
        }
        };
        var newList=Lists.newList(listName,id());
        $scope.lists.push(newList);
        Lists.save($scope.lists);
        $scope.selectList(newList);
        console.log(newList)
      }

      $scope.activeList=$scope.lists[Lists.getLastActiveList()];


      $scope.addList=function(){
        var listName=prompt('Give me a Name');
        if (listName){
          createList(listName);
        }
      };

      $scope.selectList=function(list){
        console.log(list);
        $scope.activeList=list;
        Lists.setLastActiveList(list.id);
        $ionicSideMenuDelegate.toggleLeft(false);
      }

      $scope.deleteList=function(list){
        Lists.removeList(list);
        $scope.selectList($scope.lists[0]);
        var index = $scope.lists.indexOf(list);
        $scope.lists.splice(index,1);
      }

      $scope.toggleLeft = function() {
        console.log("here");
        $ionicSideMenuDelegate.toggleLeft()
      };

      $ionicModal.fromTemplateUrl("templates/search.html",{
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal){
        $scope.modalSearch = modal //This change the modal of the scope
      });
//-------------------------------------------
      $ionicModal.fromTemplateUrl("templates/map_modal.html", {
         scope: $scope,
         animation: 'slide-in-up'
       }).then(function(modal){
         $scope.modalMap = modal
       })

       $scope.openMap = function() {
          $scope.modalMap.show();
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(drawMap)
          }
          else {
            $('#message').text("Geolocation not supported")
          }
        }

        $scope.closeModal = function(){
          $scope.modalMap.hide();
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

          var setMarker = function(la,ln, info) {
            marker = map.addMarker({
              lat: la,
              lng: ln,
              infoWindow: {
                content: '<h4>'+info+'</h4>'
              }
            });
          }
          console.log($scope.activeList)
          $http.get('http://192.168.0.86:3000/food/yelp/'+position.coords.latitude+','+position.coords.longitude).success(function(response){
            length = response.length
            console.log(response[1])
            for(var i = 0; i< length; i++){
              setMarker(response[i].location.latitude, response[i].location.longitude, response[i].name)
            }
         })
        }
//-------------------------------------------------
      $scope.openSearchModal = function(){
        $scope.modalSearch.show()
      };

      $scope.closeSearchModal = function(){
        $scope.modalSearch.hide()
      }


      $scope.data={};
      $scope.results=[];

      $scope.search=function(){
        if ($scope.data.keyWord.length >= 3){
        searchItemsService.scan($scope.data.keyWord).then(function(response){
          $scope.results=response.slice(0,20)
          console.log($scope.results)
        });}
      }

      $scope.addItem=function(item){
        // console.log($scope.activeList)
        $scope.activeList.items.push(item)

        // console.log($scope.lists);
        Lists.save($scope.lists);
      }

      $scope.deleteItem=function(item){
        var list = $scope.activeList;
        var indexItem = list.items.indexOf(item)
        var index = $scope.lists.indexOf(list);
        $scope.lists[index].items.splice(indexItem,1);
      }
}
// ]
);

