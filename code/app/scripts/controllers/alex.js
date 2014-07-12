'use strict';

angular.module('govhackFrontendApp')
  .controller('AlexCtrl', function ($scope, data) {
    $scope.sites = data.getSites({ 'dataset': 'acorn-sat' });

    $scope.timeseries = data.getTimeseries({
      'timeperiod': 'monthly', // options 'daily', 'monthly', 'yearly'
      'dataset': 'acorn-sat',
      'max-temp': true,
      'max-temp-std-dev': true,
      'time': '09-2008',
      'north': -35.0,
      'east': 150.5,
      'south': -36.0,
      'west': 147.2
    });
  });
