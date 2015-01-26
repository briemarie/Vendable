// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var vendable = angular.module('starter', ['ionic'])

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


