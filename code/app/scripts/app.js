'use strict';

/**
 * Main module of the application.
 */
angular
  .module('govhackFrontendApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/alex', {
        templateUrl: 'views/alex.html',
        controller: 'AlexCtrl'
      })
      .when('/max', {
        templateUrl: 'views/max.html',
        controller: 'MaxCtrl'
      })
      .when('/mojgan', {
        templateUrl: 'views/mojgan.html',
        controller: 'MojganCtrl'
      })
      .otherwise({
        template: '', // this is just needed to run the controller
        controller: function($http) {
          $http({
            method: 'GET',
            url: '/404.html'
          }).success(function(newpage){
            document.open();
            document.write(newpage); // jshint ignore:line
            document.close();
          });
        }
      });
  });
