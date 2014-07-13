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

        var maxTenMaxSeries = {
            name: 'Rolling Ten Year Maximum',
            data: [],
            color: palette.color()
        };
        var maxTempSeries = {
            name: 'Maximum Temperature for Month',
            data: [],
            color: palette.color()
        };
        var maxTenMinSeries = {
            name: 'Rolling Ten Year Minimum of Maximums',
            data: [],
            color: palette.color()
        };
        var maxMovingMeanSeries = {
            name: 'Rolling Mean of Maximums',
            data: [],
            color: palette.color()
        };
        var minTenMaxSeries = {
            name: 'Rolling Ten Year Minimums',
            data: [],
            color: palette.color()
        };
        var minTempSeries = {
            name: 'Minimum Temperature for Month',
            data: [],
            color: palette.color()
        };
        var minTenMinSeries = {
            name: 'Rolling Ten Year Minimum of Minimums',
            data: [],
            color: palette.color()
        };
        var minMovingMeanSeries = {
            name: 'Rolling Mean of Minimums',
            data: [],
            color: palette.color()
        };

        var setupSeries = function(timeseries) {
          // Clears the array.
          maxTenMaxSeries.data.length = 0;
          for (var month in timeseries.data) {
            var observation = timeseries.data[month];
            var date = moment(month, 'YYYYMM');
            if (date.month() == $attrs.month) {
              var temp = observation.max_ten_max;
              if (angular.isUndefined(temp) || temp === null) {
                continue;
              }
              maxTenMaxSeries.data.push({
                x: date.unix(),
                y: temp
              });
            }
          }
          // Clears the array.
          maxTempSeries.data.length = 0;
          for (var month in timeseries.data) {
            var observation = timeseries.data[month];
            var date = moment(month, 'YYYYMM');
            if (date.month() == $attrs.month) {
              var temp = observation.high_max_temp;
              if (angular.isUndefined(temp) || temp === null) {
                continue;
              }
              maxTempSeries.data.push({
                x: date.unix(),
                y: temp
              });
            }
          }
          // Clears the array.
          maxTenMinSeries.data.length = 0;
          for (var month in timeseries.data) {
            var observation = timeseries.data[month];
            var date = moment(month, 'YYYYMM');
            if (date.month() == $attrs.month) {
              var temp = observation.max_ten_min;
              if (angular.isUndefined(temp) || temp === null) {
                continue;
              }
              maxTenMinSeries.data.push({
                x: date.unix(),
                y: temp
              });
            }
          }
          // Clears the array.
          maxMovingMeanSeries.data.length = 0;
          for (var month in timeseries.data) {
            var observation = timeseries.data[month];
            var date = moment(month, 'YYYYMM');
            if (date.month() == $attrs.month) {
              var temp = observation.max_moving_mean;
              if (angular.isUndefined(temp) || temp === null) {
                continue;
              }
              maxMovingMeanSeries.data.push({
                x: date.unix(),
                y: temp
              });
            }
          }
            // Clears the array.
            minTenMaxSeries.data.length = 0;
            for (var month in timeseries.data) {
              var observation = timeseries.data[month];
              var date = moment(month, 'YYYYMM');
              if (date.month() == $attrs.month) {
                var temp = observation.min_ten_max;
                if (angular.isUndefined(temp) || temp === null) {
                  continue;
                }
                minTenMaxSeries.data.push({
                  x: date.unix(),
                  y: temp
                });
              }
            }
            // Clears the array.
            minTempSeries.data.length = 0;
            for (var month in timeseries.data) {
              var observation = timeseries.data[month];
              var date = moment(month, 'YYYYMM');
              if (date.month() == $attrs.month) {
                var temp = observation.low_min_temp;
                if (angular.isUndefined(temp) || temp === null) {
                  continue;
                }
                minTempSeries.data.push({
                  x: date.unix(),
                  y: temp
                });
              }
            }
            // Clears the array.
            minTenMinSeries.data.length = 0;
            for (var month in timeseries.data) {
              var observation = timeseries.data[month];
              var date = moment(month, 'YYYYMM');
              if (date.month() == $attrs.month) {
                var temp = observation.min_ten_min;
                if (angular.isUndefined(temp) || temp === null) {
                  continue;
                }
                minTenMinSeries.data.push({
                  x: date.unix(),
                  y: temp
                });
              }
            }
            // Clears the array.
            minMovingMeanSeries.data.length = 0;
            for (var month in timeseries.data) {
              var observation = timeseries.data[month];
              var date = moment(month, 'YYYYMM');
              if (date.month() == $attrs.month) {
                var temp = observation.min_moving_mean;
                if (angular.isUndefined(temp) || temp === null) {
                  continue;
                }
                minMovingMeanSeries.data.push({
                  x: date.unix(),
                  y: temp
                });
              }
            }

          // Sort by x axis.
          maxTenMaxSeries.data.sort(function(a, b) {
            return parseFloat(a.x) - parseFloat(b.x);
          });
          maxTempSeries.data.sort(function(a, b) {
            return parseFloat(a.x) - parseFloat(b.x);
          });
          maxTenMinSeries.data.sort(function(a, b) {
            return parseFloat(a.x) - parseFloat(b.x);
          });
          maxMovingMeanSeries.data.sort(function(a, b) {
            return parseFloat(a.x) - parseFloat(b.x);
          });
          minTenMaxSeries.data.sort(function(a, b) {
            return parseFloat(a.x) - parseFloat(b.x);
          });
          minTempSeries.data.sort(function(a, b) {
            return parseFloat(a.x) - parseFloat(b.x);
          });
          minTenMinSeries.data.sort(function(a, b) {
            return parseFloat(a.x) - parseFloat(b.x);
          });
          minMovingMeanSeries.data.sort(function(a, b) {
            return parseFloat(a.x) - parseFloat(b.x);
          });

          var combinedYData = $.map(
              maxTenMaxSeries.data.concat(
              maxTempSeries.data.concat(
              maxTenMinSeries.data.concat(
              maxMovingMeanSeries.data.concat(
              minTenMaxSeries.data.concat(
              minTempSeries.data.concat(
              minTenMinSeries.data.concat(
              minMovingMeanSeries))))))),
            function(data) {
              return data.y;
            });
          tempScale = d3.scale.linear()
            .domain([
               Math.min.apply(Math, combinedYData),
               Math.max.apply(Math, combinedYData)
             ])
            .nice();
          maxTenMaxSeries.scale = tempScale;
          maxTempSeries.scale = tempScale;
          maxTenMinSeries.scale = tempScale;
          maxMovingMeanSeries.scale = tempScale;
          minTenMaxSeries.scale = tempScale;
          minTempSeries.scale = tempScale;
          minTenMinSeries.scale = tempScale;
          minMovingMeanSeries.scale = tempScale;
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
             'low_min_temp': true,
             'max_highest_since' : true,
             'max_lowest_since' : true,
             'max_ten_max' : true,
             'max_ten_min' : true,
             'max_moving_mean' : true,
             'min_highest_since': true,
             'min_lowest_since' : true,
             'min_ten_max' : true,
             'min_ten_min' : true,
             'min_moving_mean' : true
          }).$promise.then(function(timeseries) {
            setupSeries(timeseries);

            if (graph === null) {
              graph = new Rickshaw.Graph({
                element: $element.find('.js-timeseries-chart').get(0),
                width: 700,
                height: 250,
                renderer: 'line',
                series: [
                  maxTenMaxSeries,
                  maxTempSeries,
                  maxTenMinSeries,
                  maxMovingMeanSeries,
                  minTenMaxSeries,
                  minTempSeries,
                  minTenMinSeries,
                  minMovingMeanSeries]
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
