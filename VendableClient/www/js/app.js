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

  $stateProvider.state('list',{
    url: '/list',
    templateUrl: 'templates/list.html'
  });

  $stateProvider.state('new-list', {
    url: '/new-list',
    templateUrl: 'templates/new-list.html'
  })

  $stateProvider.state('all_list', {
    url: '/list',
    templateUrl: 'templates/list.html'
  })

});



Vendable.factory('searchItemsService',function($http){
      return{
            scan:function(keyWord){
            return $http.get('http://aqueous-beyond-9351.herokuapp.com/'+keyWord+'&safeway')
            // return $http.get("http://localhost:9393")
                    .then(function(response){
                      return response.data;
                    })
            }
            }
});

Vendable.factory('ColorWheel',function(){
  window.localStorage['colors'] = angular.toJson([
                                  'FFC444', '0CE885', 'A2BCFF', 'E8C05B',
                                  'E8E5B9', 'FF8C0D', '8BE8AC', 'E85542',
                                  'D9E852', '75E8C6']);
  return {
    shiftOne:function(){
      var colors = angular.fromJson(window.localStorage['colors']);
          color = colors[0];
          colors = colors.splice(1,colors.length-1);
          colors.push(color);
          window.localStorage['colors'] = angular.toJson(colors);
          return color;
    }
  }

})

Vendable.factory('Lists',function(){
  return{
    all:function(){
      var listsString=window.localStorage['lists'];
      if(listsString){
        return angular.fromJson(listsString);
      }
      return [];
    },

    save:function(lists){
      window.localStorage['lists']=angular.toJson(lists);
    },

    newList:function(listName,id){
      return{
        id:id,
        title:listName,
        items:[],
        store:{}
      }
    },

    removeList:function(listObject){
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

    setLastActiveList:function(idx){
      window.localStorage['lastActiveList']=idx;
    }

  }
})

Vendable.controller('VendableCtrl',
  // ['$scope','$http','$ionicModal',
    function($scope,searchItemsService,ColorWheel, Lists,$ionicModal,$ionicSideMenuDelegate, $http){
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
      }

      $scope.activeList=$scope.lists[Lists.getLastActiveList()];

      $scope.addList=function(listName){
        var listName=listName;
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
        var index = $scope.lists.indexOf(list);
        $scope.lists.splice(index,1);
      }

      $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft()
      };

      $ionicModal.fromTemplateUrl("templates/list.html",{
        scope: $scope,
        animation: 'slide-in-down'
      }).then(function(modal){
        $scope.modalList=modal
      })

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

       $ionicModal.fromTemplateUrl("templates/panorama_modal.html", {
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

        $scope.setActiveStore = function(store){
          $scope.activeStore=store;
          $scope.activeStore.laln="https://www.google.com/maps/dir/@"+store.location.latitude+","+store.location.longitude
          $scope.closeModal()
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
           var initLat = position.coords.latitude
           var initLng = position.coords.longitude
           var map = new GMaps({
            div: '#mapG',
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });

          var setMarker = function(la,ln, info, origin) {
            marker = map.addMarker({
              lat: la,
              lng: ln,
              infoWindow: {
                content: '<h4>'+info+'</h4><img src="http://media.tumblr.com/tumblr_m7hu22giDp1rqxe4o.jpg">'
              },
              icon: icons[origin].icon
            });
          }

          var icons = {
            user: {
              icon: '../img/map-icons/pins/48/pin6.png'
            },
            supermarket: {
              icon: "../img/map-icons/pins/48/pin9.png"
            }
          }

          setMarker(initLat, initLng, 'Fuck my life', 'user')

          var list = $scope.activeList
          var length = list.items.length
          var total = 0
          for (var i = 0; i<length; i++) {
            number = parseFloat(list.items[i].price)
            total += number
          }
          $scope.total = total.toFixed(2)
          // console.log($scope.activeList.items[1].price)
          $http.get('http://aqueous-beyond-9351.herokuapp.com/food/yelp/'+position.coords.latitude+','+position.coords.longitude).success(function(response){
            length = response.length
              for(var i = 0; i< length; i++){
              // $scope What thte hell is this
              setMarker(response[i].location.latitude, response[i].location.longitude, response[i].name, "supermarket")
            }
          $scope.stores = response
         })
        }

        $scope.activeStore;

        // $scope.showPanaroma = function(la, ln){
        //   var panorama = GMaps.createPanorama({
        //     el: '#panorama',
        //     lat: 42.3455,
        //     ln: -71.0983
        //   })
        // }
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
        });}
      }

      $scope.addItem=function(item){
        $scope.activeList.items.push(item)
        Lists.save($scope.lists);
      }

      $scope.deleteItem=function(item){
        var list = $scope.activeList;
        var indexItem = list.items.indexOf(item)
        var index = $scope.lists.indexOf(list);
        $scope.lists[index].items.splice(indexItem,1);
        $scope.selectList($scope.list[0])
      }

      $scope.activeColor;

      $scope.changeColor=function(){
        // $scope.activeColor = ColorWheel.shiftOne();
        return 2000;
      }

      $scope.showButtons=true;

      $scope.toggleButtons=function(){
        if ($scope.showButtons){
          $scope.showButtons=false;
        }else{
          $scope.showButtons=true;
        }
      }
}
// ]
);

