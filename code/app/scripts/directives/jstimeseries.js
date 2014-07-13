'use strict';

angular.module('govhackFrontendApp')
  .directive('jsTimeseries', function ($log, data) {
    return {
      templateUrl: 'views/jstimeseries.html',
      restrict: 'E',
      link: function ($scope, $element, $attrs) {
        data.getTimeseries({
           'timeperiod': 'monthly',
           'dataset': 'acorn-sat',
           'site': $attrs.site,
           'high_max_temp': true,
           'low_min_temp': true
        }).$promise.then(function(timeseries) {
          var maxTempData = [];
          var maxTempMin = null;
          var maxTempMax = null;
          for (var month in timeseries.data) {
            var observation = timeseries.data[month];
            var date = moment(month, 'YYYYMM');
            if (date.month() === 0) {
              var maxTemp = observation.high_max_temp;
              if (angular.isUndefined(maxTemp)) {
                continue;
              }
              if (maxTempMin === null || maxTemp < maxTempMin) {
                maxTempMin = maxTemp;
              }
              if (maxTempMax === null || maxTemp > maxTempMax) {
                maxTempMax = maxTemp;
              }
              maxTempData.push({
                x: date.unix(),
                y: maxTemp
              });
            }
          }

          var minTempData = [];
          var minTempMin = null;
          var minTempMax = null;
          for (var month in timeseries.data) {
            var observation = timeseries.data[month];
            var date = moment(month, 'YYYYMM');
            if (date.month() === 0) {
              var minTemp = observation.low_min_temp;
              if (angular.isUndefined(minTemp)) {
                continue;
              }
              if (minTempMin === null || minTemp < minTempMin) {
                minTempMin = minTemp;
              }
              if (minTempMax === null || minTemp > minTempMax) {
                minTempMax = minTemp;
              }
              minTempData.push({
                x: date.unix(),
                y: minTemp
              });
            }
          }

          // Sort by x axis.
          maxTempData.sort(function(a, b) {
            return parseFloat(a.x) - parseFloat(b.x)
          });
          minTempData.sort(function(a, b) {
            return parseFloat(a.x) - parseFloat(b.x)
          });

          var tempScale = d3.scale.linear()
            .domain([
                Math.min(maxTempMin, minTempMin),
                Math.max(maxTempMax, minTempMax)])
            .nice();

          var palette = new Rickshaw.Color.Palette();

          var graph = new Rickshaw.Graph({
            element: document.getElementById('chart'),
            width: 780,
            height: 250,
            renderer: 'line',
            series: [{
                name: 'Max Temp',
                data: maxTempData,
                color: palette.color(),
                scale: tempScale
            }, {
                name: 'Min Temp',
                data: minTempData,
                color: palette.color(),
                scale: tempScale
            }]
          });

          new Rickshaw.Graph.Axis.Time({
            graph: graph
          });

          new Rickshaw.Graph.Axis.Y.Scaled({
          element: document.getElementById('y_axis'),
            graph: graph,
            orientation: 'left',
            tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
            scale: tempScale
          });

          new Rickshaw.Graph.HoverDetail({
            graph: graph,
            xFormatter: function(x) {
              return moment.unix(x).format('MMM YYYY');
            }
          });

          new Rickshaw.Graph.RangeSlider({
          	graph: graph,
          	element: document.getElementById('preview'),
          });

          graph.render();
        }, function() {
          $log.log('Error getting data in jstimeseries.js.')
        });
      }
    };
  });
