'use strict';

angular.module('govhackFrontendApp')
  .controller('MojganCtrl', function ($scope) {
    $scope.test = 'Test';
	$scope.testSubmit = function() {
	  $scope.test = $scope.testInput;
	};
  });
  
