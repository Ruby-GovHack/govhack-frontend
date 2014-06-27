'use strict';

angular.module('govhackFrontendApp')
  .controller('HeaderCtrl', function ($scope, $location) {
      $scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };
  });
