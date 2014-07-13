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
      .when('/timeseries', {
        templateUrl: 'views/alex.html',
        controller: 'AlexCtrl'
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
