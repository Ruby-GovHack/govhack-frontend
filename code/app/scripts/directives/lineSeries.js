'use strict';

angular.module('govhackFrontendApp')
  .directive('lineSeries', function () {
    return {
      templateUrl: 'views/lineSeries.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        var palette = new Rickshaw.Color.Palette();
        var lines= [
                {
                        name: "Northeast",
                        data: [ { x: -1893456000, y: 25868573 }, { x: -1577923200, y: 29662053 }, { x: -1262304000, y: 34427091 }, { x: -946771200, y: 35976777 }, { x: -631152000, y: 39477986 }, { x: -315619200, y: 44677819 }, { x: 0, y: 49040703 }, { x: 315532800, y: 49135283 }, { x: 631152000, y: 50809229 }, { x: 946684800, y: 53594378 }, { x: 1262304000, y: 55317240 } ],
                        color: palette.color()
               
                }];
        
        var graph = new Rickshaw.Graph( {
        element: document.querySelector("#chart"),
        width: 540,
        height: 240,
        renderer: 'line',
        series: lines
        } );
        
        var x_axis = new Rickshaw.Graph.Axis.Time( { graph: graph } );

        var y_axis = new Rickshaw.Graph.Axis.Y( {
                graph: graph,
                orientation: 'left',
                tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
                element: document.getElementById('y_axis'),
        } );

        var legend = new Rickshaw.Graph.Legend( {
                element: document.querySelector('#legend'),
                graph: graph
        } );     

        graph.render();        