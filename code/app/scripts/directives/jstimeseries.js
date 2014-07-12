'use strict';

angular.module('govhackFrontendApp')
  .directive('jsTimeseries', function (data) {
    return {
      templateUrl: 'views/jstimeseries.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        data.getTimeseries({
           'timeperiod': 'monthly',
           'dataset': 'acorn-sat',
           'site': '023090',
           'high_max_temp': true
        }).$promise.then(function(timeseries) {
          var maxTempMin = null;
          var maxTempMax = null;

          var maxTempData = [];
          for (var i = 0; i < timeseries.length; i++) {
            var date = moment(timeseries[i].month, 'MM-YYYY');
            if (date.month() === 0) {
              var maxTemp = timeseries[i].high_max_temp;
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

          var maxTempScale = d3.scale.linear()
            .domain([maxTempMin, maxTempMax])
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
                scale: maxTempScale
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
            scale: maxTempScale
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
        });
      }
    };
  });
