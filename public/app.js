'use strict';

angular
  .module('app', [
    'ngRoute',
    'angular-svg-round-progressbar'
    
  ])
  .config(function ($routeProvider, $locationProvider) {
    console.log('Inside config');
    $locationProvider.html5Mode(true);
    $routeProvider
      .when('/login', {
        templateUrl: '/views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/success', {
        templateUrl: '/views/success.html',
        controller: 'SuccessCtrl'
      })
      .otherwise({
        redirectTo: '/login'
      });
  });
