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
    templateUrl: 'template/home.html'
  });

  $stateProvider.state('index',{
    url: '/index',
    templateUrl: 'template/index.html'
  });

  $stateProvider.state('new_list', {
    url: '/new_list',
    templateUrl: 'template/new_list.html'
  })

  $stateProvider.state('all_list', {
    url: '/all_list',
    templateUrl: 'template/all_list.html'
  })

});



Vendable.factory('searchItemsService',function($http){
      return{
            scan:function(keyWord){
                  console.log("u")
            return $http.get('http://localhost:9393')
                    .then(function(response){
                      return response.data;
                    })
            }
            }
});

Vendable.factory('Lists',function(){
  return{
    all:function(){
      console.log("shit");
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
      //return index number 0 if no prior active list
    },

    setLastActiveList:function(id){
      window.localStorage['lastActiveList']=id;
    }

  }
})

Vendable.controller('VendableCtrl',
  // ['$scope','$http','$ionicModal',
    function($scope,searchItemsService,Lists,$ionicModal,$ionicSideMenuDelegate){

      $scope.basket=[];
      $scope.lists=Lists.all();//This is an array

      var createList=function(listName){
        var id = function(){
          if($scope.lists.length === 0){
            return 0
          }
          return $scope.lists[$scope.lists.length-1].id
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
        $scope.activeList=list;
        Lists.setLastActiveList(list.id);
        $ionicSideMenuDelegate.toggleLeft(false);
      }

      $scope.deleteList=function(list){
        Lists.removeList(list);
        $scope.selectList($scope.lists[0]);
      }

      $scope.toggleLeft = function() {
        console.log("here");
        $ionicSideMenuDelegate.toggleLeft()
      };

      $ionicModal.fromTemplateUrl("template/search.html",{
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

      $scope.search=function(){
        searchItemsService.scan($scope.data.keyWord).then(function(response){
          $scope.items=response
        });
      }

      $scope.addItem=function(item){
        console.log(Lists.getLastActiveList());
        $scope.lists[Lists.getLastActiveList()].items.push(item); 
        console.log(item)
      }

      $scope.deleteItem=function(item){
        var idx = $scope.basket.indexOf(item);
        $scope.basket.splice(idx,1);
      }
}
// ]
);

console.log("yeah")

