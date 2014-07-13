'use strict';

angular.module('govhackFrontendApp')
  .directive('jsTimeseries', function (data) {
    return {
      templateUrl: 'views/jstimeseries.html',
      restrict: 'E',
      link: function ($scope, $element, $attrs) {
        var graph = null;
        var yAxix = null;

        var palette = new Rickshaw.Color.Palette();

        var tempScale = null;

        var maxTempSeries = {
            name: 'Max Temp',
            data: [],
            color: palette.color()
        };
        var minTempSeries = {
            name: 'Min Temp',
            data: [],
            color: palette.color()
        };

        var setupSeries = function(timeseries) {
          // Clears the array.
          maxTempSeries.data.length = 0;
          for (var month in timeseries.data) {
            var observation = timeseries.data[month];
            var date = moment(month, 'YYYYMM');
            if (date.month() == $attrs.month) {
              var maxTemp = observation.high_max_temp;
              if (angular.isUndefined(maxTemp) || maxTemp === null) {
                continue;
              }
              maxTempSeries.data.push({
                x: date.unix(),
                y: maxTemp
              });
            }
          }

          // Clears the array.
          minTempSeries.data.length = 0;
          for (var month in timeseries.data) {
            var observation = timeseries.data[month];
            var date = moment(month, 'YYYYMM');
            if (date.month() == $attrs.month) {
              var minTemp = observation.low_min_temp;
              if (angular.isUndefined(minTemp) || minTemp === null) {
                continue;
              }
              minTempSeries.data.push({
                x: date.unix(),
                y: minTemp
              });
            }
          }

          // Sort by x axis.
          maxTempSeries.data.sort(function(a, b) {
            return parseFloat(a.x) - parseFloat(b.x);
          });
          minTempSeries.data.sort(function(a, b) {
            return parseFloat(a.x) - parseFloat(b.x);
          });

          var combinedYData = $.map(
            maxTempSeries.data.concat(minTempSeries.data),
            function(data) {
              return data.y;
            });
          tempScale = d3.scale.linear()
            .domain([
               Math.min.apply(Math, combinedYData),
               Math.max.apply(Math, combinedYData)
             ])
            .nice();
          maxTempSeries.scale = tempScale;
          minTempSeries.scale = tempScale;
        };

        var updateGraph = function() {
          if (angular.isUndefined($attrs.site)
             || $attrs.site === null
             || angular.isUndefined($attrs.month)
             || $attrs.month === null) {
            return;
          }

          data.getTimeseries({
             'timeperiod': 'monthly',
             'dataset': 'acorn-sat',
             'site': $attrs.site,
             'high_max_temp': true,
             'low_min_temp': true
          }).$promise.then(function(timeseries) {
            setupSeries(timeseries);

            if (graph === null) {
              graph = new Rickshaw.Graph({
                element: $element.find('.js-timeseries-chart').get(0),
                width: 700,
                height: 250,
                renderer: 'line',
                series: [maxTempSeries, minTempSeries]
              });

              new Rickshaw.Graph.Axis.Time({
                graph: graph
              });

              yAxix = new Rickshaw.Graph.Axis.Y.Scaled({
                element: $element.find('.js-timeseries-y-axis').get(0),
                graph: graph,
                orientation: 'left',
                tickFormat: function(y) {
                  return Rickshaw.Fixtures.Number.formatKMBT(y) + '°C';
                },
                scale: tempScale
              });

              new Rickshaw.Graph.HoverDetail({
                graph: graph,
                formatter: function(series, x, y) {
                  return series.name + ': ' + y.toFixed(1) + '°C';
                },
                xFormatter: function(x) {
                  return moment.unix(x).format('MMM YYYY');
                }
              });

              new Rickshaw.Graph.RangeSlider({
                graph: graph,
                element: $element.find('.js-timeseries-preview').get(0)
              });
            }

            yAxix.scale = tempScale;

            graph.render();
          });
        };

        $attrs.$observe('site', updateGraph);
        $attrs.$observe('month', updateGraph);
      }
    };
  });
