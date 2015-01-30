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
            scan:function(keyWord, store){

            // return $http.get('hhttps://lit-ravine-6515.herokuapp.com/'+keyWord+'&'+store)

              console.log("here")
            return $http.get('http://192.168.0.86:3000/'+keyWord+'&'+store)
            // return $http.get("http://localhost:9393")
                    .then(function(response){
                      return response.data;
                    })
            }
            }
});


Vendable.factory('ColorWheel',function(){
  window.localStorage['colors'] = angular.toJson(['0CE885', 'A2BCFF', 'E8C05B',
                                                  'E8E5B9', 'FF8C0D', '8BE8AC', 'E85542'
                                                  ,'75E8C6']);
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

    newList:function(listName,id, store){
      return{
        id:id,
        title:listName,
        items:[],
        store: store,
        total: 0
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
    function($scope,searchItemsService,ColorWheel, Lists,$ionicModal,$ionicSideMenuDelegate, $http, $ionicPopover, $ionicPopup){

      $scope.lists=Lists.all();//This is an array

      var createList=function(listName){
        var id = function(){
          if($scope.lists.length === 0){
            return 0
          }else{
          return $scope.lists[$scope.lists.length-1].id+1
          }
        };
        // console.log($scope.activeStore)
        var newList=Lists.newList(listName,id(),$scope.activeStore);
        console.log(newList)
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


      $scope.setActiveStore = function(store,$event){
        $scope.activeStore=store;
        $scope.activeStore.name=$scope.activeList.store.name.split(/\W/)[0];;
        console.log($scope.activeStore);
        $scope.activeStore.laln="https://www.google.com/maps/dir/@"+store.location.latitude+","+store.location.longitude
        $scope.openPopover($event)
      }
//-------------------------MAP----------------------------------------------------------------
      $ionicModal.fromTemplateUrl("templates/map_modal.html", {
         scope: $scope,
         animation: 'slide-in-up'
       }).then(function(modal){
         $scope.modalMap = modal
       })

       $ionicPopover.fromTemplateUrl('templates/popover.html', {
          scope: $scope,
        }).then(function(popover) {
          $scope.popover = popover;
        });


       $scope.openPopover = function($event) {
         $scope.popover.show($event);
       };

       $scope.closePopover = function() {
         $scope.popover.hide();
       };

       $scope.$on('popover.hidden', function() {
          // console.log($scope.activeStore)
          var store = $scope.activeStore
          drawRoute(store.location.latitude, store.location.longitude)
        });

       $scope.getDirections = function(mode){
          var store = $scope.activeStore
          $http.get('http://192.168.0.86:3000/directions/'+$scope.initLat+','+$scope.initLng+'&'+store.location.latitude+','+store.location.longitude+'&'+mode).success(function(response){
            console.log(response.duration.text, response.distance.text, response.end)
            $scope.showConfirm(response.duration.text, response.distance.text, response.end)
          })

      $scope.showConfirm = function(duration, distance, address) {
        var confirmPopup = $ionicPopup.confirm({
          title: 'Your Itynerary',
          template: 'Distance:'+distance+'Duration:'+duration+'Destination address:'+address
        });
        confirmPopup.then(function(res) {
          if(res) {
            $scope.popover.hide();
          } else {
            $scope.popover.hide();
          }
        });
      };
         // if(mode === 'driving') {
         //  $http.get('https://lit-ravine-6515.herokuapp.com/directions/?origin='+$scope.initLat+','+$scope.initLng+'&destination='+store.location.latitude+','+store.location.longitude+'&mode='+mode)
          // $http.get('https://maps.googleapis.com/maps/api/directions/json?origin='+$scope.initLat+','+$scope.initLng+'&destination='+store.location.latitude+','+store.location.longitude+'&key=AIzaSyC5sxp6CP5nv9xKsqMYOOeo5z5WEcz7Vbo&sensor=false').success(function(response){console.log(response)
         //  })
         // }
       }


       $scope.openMap = function(flag) {
          console.log(flag)
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
           $scope.initLat = position.coords.latitude
           $scope.initLng = position.coords.longitude
          map = new GMaps({
            div: '#mapG',
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });

          var setMarker = function(la,ln, info, origin) {
            marker = map.addMarker({
              lat: la,
              lng: ln,
              infoWindow: {
                content: '<h4>'+info+'</h4><img src="../img/store-icons/'+info+'.png">'
              },
              icon: icons[origin].icon
            });
          }

          var icons = {
            user: {
              icon: '../img/map-icons/pins/48/pin6.png'
            },
            supermarket: {
              icon: '../img/map-icons/pins/48/pin9.png'
            }
          }

          setMarker($scope.initLat, $scope.initLng, 'I am hungry!!', 'user')


          // console.log($scope.activeList.items[1].price)

          $http.get('https://lit-ravine-6515.herokuapp.com/yelp/'+position.coords.latitude+','+position.coords.longitude).success(function(response){
            length = response.length
              for(var i = 0; i< length; i++){
              // $scope What thte hell is this
              setMarker(response[i].location.latitude, response[i].location.longitude, response[i].name, "supermarket")
            }
          $scope.stores = response
          console.log($scope.stores)
         })
        }




        $scope.activeStore=function(){
          // window.localStorage.clear()
          if($scope.activeList){
            return $scope.activeList.store.name.split(/\W/)[0];
          }
        }();


        // $scope.activeStore=$scope.activeList.store


        // $scope.showPanaroma = function(la, ln){
        //   var panorama = GMaps.createPanorama({
        //     el: '#panorama',
        //     lat: 42.3455,
        //     ln: -71.0983
        //   })
        // }
//--------------------------------------------------------------------END OF MAP

        var drawRoute= function(desLat, desLng){
          map.drawRoute({
            origin: [$scope.initLat, $scope.initLng],
            destination: [desLat,desLng],
            travelMode: 'driving',
            strokeColor: '#0066FF',
            strokeOpacity: 1,
            strokeWeight: 6
          });
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
        console.log($scope.activeStore.name)
        if ($scope.data.keyWord.length >= 3){
        searchItemsService.scan($scope.data.keyWord,$scope.activeStore.name).then(function(response){
          $scope.results=response.slice(0,20)
        });}
        // var data = angular.fromJson(window.localStorage['colors'])
        // data.splice(7,1);
        // window.localStorage['colors']=angular.toJson(data);
      }

      $scope.addItem=function(item){
        console.log(item);
        $scope.activeList.items.push((JSON.parse(JSON.stringify(item))))
        Lists.save($scope.lists);
        document.querySelector('#search-input').value=null;
        $scope.closeSearchModal();
        $scope.calculate();
      }

      $scope.deleteItem=function(item){
        console.log($scope.activeList)
        var list = $scope.activeList;
        var indexItem = list.items.indexOf(item)
        var index = $scope.lists.indexOf(list);
        $scope.lists[index].items.splice(indexItem,1);
        Lists.save($scope.lists);
        $scope.selectList($scope.activeList);
        $scope.calculate();
      }


      $scope.changeColor=function(){
        $scope.activeColor = ColorWheel.shiftOne();
        return 2000;
      }
      $scope.activeColor;

      $scope.showButtons=true;

      $scope.toggleButtons=function(){
        if ($scope.showButtons){
          $scope.showButtons=false;
        }else{
          $scope.showButtons=true;
        }
      }

      // $scope.total= $scope.activeList.total || 0;
      $scope.calculate=function(){
          var list = $scope.activeList.items;
          $scope.activeList['total'] = 0;
          for (i in list){
            $scope.activeList.total += round(list[i].price*100);
            console.log($scope.activeList.total);
          }
        }
        console.log($scope.activeList);
}
// ]
);

