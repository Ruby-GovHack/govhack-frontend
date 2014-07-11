'use strict';

angular.module('govhackFrontendApp')
  .controller('AlexCtrl', function ($scope, data) {
    $scope.test = data.someMethod();
  });
