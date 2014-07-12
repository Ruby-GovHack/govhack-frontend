'use strict';

angular.module('govhackFrontendApp')
  .directive('timeseries', function () {
    return {
      templateUrl: 'views/timeseries.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        var palette = new Rickshaw.Color.Palette();
       

var seriesData = [ [], [], [], [], [] ];
var random = new Rickshaw.Fixtures.RandomData(50);

for (var i = 0; i < 75; i++) {
	random.addData(seriesData);
}

var graph = new Rickshaw.Graph( {
	element: document.getElementById("chart"),
	renderer: 'multi',
	width: 900,
	height: 500,
	dotSize: 5,
	series: [
		{
			name: 'temperature',
			data: seriesData.shift(),
			color: 'rgba(255, 0, 0, 0.4)',
			renderer: 'stack'
		}, {
			name: 'heat index',
			data: seriesData.shift(),
			color: 'rgba(255, 127, 0, 0.4)',
			renderer: 'stack'
		}, {
			name: 'dewpoint',
			data: seriesData.shift(),
			color: 'rgba(127, 0, 0, 0.3)',
			renderer: 'scatterplot'
		}, {
			name: 'pop',
			data: seriesData.shift().map(function(d) { return { x: d.x, y: d.y / 4 } }),
			color: 'rgba(0, 0, 127, 0.4)',
			renderer: 'bar'
		}, {
			name: 'humidity',
			data: seriesData.shift().map(function(d) { return { x: d.x, y: d.y * 1.5 } }),
			renderer: 'line',
			color: 'rgba(0, 0, 127, 0.25)'
		}
	]
} );

var slider = new Rickshaw.Graph.RangeSlider.Preview({
	graph: graph,
	element: document.querySelector('#slider')
});

graph.render();

var detail = new Rickshaw.Graph.HoverDetail({
	graph: graph
});

var legend = new Rickshaw.Graph.Legend({
	graph: graph,
	element: document.querySelector('#legend')
});

var highlighter = new Rickshaw.Graph.Behavior.Series.Highlight({
    graph: graph,
    legend: legend,
    disabledColor: function() { return 'rgba(0, 0, 0, 0.2)' }
});

var highlighter = new Rickshaw.Graph.Behavior.Series.Toggle({
    graph: graph,
    legend: legend
});


