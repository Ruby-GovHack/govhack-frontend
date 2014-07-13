'use strict';

angular.module('govhackFrontendApp')
  .controller('AlexCtrl', function ($scope, data) {
    $scope.site = '059040';
    $scope.sites = data.getSites({ 'dataset': 'acorn-sat' });
  });
