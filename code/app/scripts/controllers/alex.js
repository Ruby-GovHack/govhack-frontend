'use strict';

angular.module('govhackFrontendApp')
  .controller('AlexCtrl', function ($scope, data) {
    $scope.sites = data.getSites({ 'dataset': 'acorn-sat' });
    $scope.months = [
      {
        monthId: 0,
        monthName: 'January'
      }, {
        monthId: 1,
        monthName: 'Febuary'
      }, {
        monthId: 2,
        monthName: 'March'
      }, {
        monthId: 3,
        monthName: 'April'
      }, {
        monthId: 4,
        monthName: 'May'
      }, {
        monthId: 5,
        monthName: 'June'
      }, {
        monthId: 6,
        monthName: 'July'
      }, {
        monthId: 7,
        monthName: 'August'
      }, {
        monthId: 8,
        monthName: 'September'
      }, {
        monthId: 9,
        monthName: 'October'
      }, {
        monthId: 10,
        monthName: 'November'
      }, {
        monthId: 11,
        monthName: 'December'
      }
    ];
    $scope.month = 0;
    $scope.site = '059040';
  });
