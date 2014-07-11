'use strict';

angular.module('govhackFrontendApp')
  .controller('AlexCtrl', function ($scope, data) {
    $scope.sites = data.sites.query();
    
    $scope.temps = data.temps.query({
      timeperiod: 'monthly', // options 'daily', 'monthly', 'yearly'
      maxormin: 'max', // options 'max', 'min'
      time: 200809, // YYYYMMDD depending on timeperiod
      north: -35.0,
      east: 150.5,
      south: -36.0,
      west: 147.2
    });
  });
