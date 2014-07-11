'use strict';

angular.module('govhackFrontendApp')
  .directive('jsMap', function () {
    return {
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        scope.data = [10,20,30,40,60,80];

        var root = d3.select(element[0]);
        root.append('div').attr('class', 'chart')
           .selectAll('div')
           .data(scope.data).enter().append('div')
           .transition().ease('elastic')
           .style('width', function(d) { return d + '%'; })
           .text(function(d) { return d + '%'; });
      }
    };
  });
