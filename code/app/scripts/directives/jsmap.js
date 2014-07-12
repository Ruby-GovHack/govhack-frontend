'use strict';

angular.module('govhackFrontendApp')
  .directive('jsMap', function (data) {
    return {
      templateUrl: 'views/jsmap.html',
      restrict: 'E',
      link: function postLink(scope, element) {
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        
        scope.sites = {};
        var overlay;

        var currentMouseOver;
        var mouseX = 0;
        var mouseY = 0;
        var auTL = new google.maps.LatLng(-5, 110);
        var auC = new google.maps.LatLng(-28, 133);
        var auBR = new google.maps.LatLng(-49, 156);
        var auTLP;
        var auBRP;
        var auCP;
        var projection;
        var rad = 0;

        $(document).bind('mousemove', function(e) { 
          mouseX = e.pageX;
          mouseY = e.pageY;
        }); 
        
        function monthFormatter(val) {
          return months[val];
        }
        
        var yearSlader = $('#year-slader').slader({
          tooltip: 'always'
        });
        var monthSlader = $('#month-slader').slader({
          tooltip: 'always',
          formater: monthFormatter
        });
        
        function dostuff() {
          d3.selectAll('.big')
            .transition()
            .attr('r', rad + rad + 'px')
            .transition()
            .attr('r', rad + 'px');
          var curMonth = monthSlader.slader('getValue');
          var curYear = yearSlader.slader('getValue');
          ++curYear;
          //monthSlader.slader('setValue', curMonth);
          yearSlader.slader('setValue', curYear % yearSlader.slader('getAttribute', 'max'));
          $('#display-date').text(months[curMonth] + ', ' + curYear);
          
        }

        function updateData(response) {
          scope.sites = response.data;
          //$.each(response, function(key, val) {
            //if (/^[0-9]{6}$/.test(key)) {
            //  scope.sites[key] = val;
            //}
          //});
          scope['023090'].data = {};
          $.extend(scope['023090'].data, {
            "200501":{"month":"01-2005","high_max_temp":41.8},
            "200502":{"month":"02-2005","high_max_temp":42.8},
            "200503":{"month":"03-2005","high_max_temp":33.8},
            "200504":{"month":"04-2005","high_max_temp":34.8},
            "200505":{"month":"05-2005","high_max_temp":35.8},
            "200506":{"month":"06-2005","high_max_temp":36.8},
            "200507":{"month":"07-2005","high_max_temp":37.7},
            "200508":{"month":"08-2005","high_max_temp":48.8},
            "200509":{"month":"09-2005","high_max_temp":49.9},
            "200510":{"month":"10-2005","high_max_temp":41.0},
            "200511":{"month":"11-2005","high_max_temp":41.1},
            "200512":{"month":"12-2005","high_max_temp":21.2},
            "200601":{"month":"01-2006","high_max_temp":21.1},
            "200602":{"month":"02-2006","high_max_temp":21.2},
            "200603":{"month":"03-2006","high_max_temp":21.3},
            "200604":{"month":"04-2006","high_max_temp":21.4},
            "200605":{"month":"05-2006","high_max_temp":21.5},
            "200606":{"month":"06-2006","high_max_temp":11.6},
            "200607":{"month":"07-2006","high_max_temp":11.7},
            "200608":{"month":"08-2006","high_max_temp":41.8}
          });
          overlay.draw();
        }

        function alignSite(site, d) {
          var pos = projection.fromLatLngToDivPixel(new google.maps.LatLng(d.lat, d.long));
          $(site)
            .attr('transform', 'translate(' + (pos.x - auTLP.x) + ', ' + (pos.y - auTLP.y) + ')');
        }
        
        function showData(d)
        {
          $('#map-info').html(
            '<div class="info-label">' + d.label + '</div>' +
            '<div class="info-text">' + 
            '<div class="row">' +
            '<div class="col-lg-5">Latitude:</div>' +
            '<div class="col-lg-7">' + d.lat + '</div>' +
            '<div class="col-lg-5">Longitude:</div>' +
            '<div class="col-lg-7">' + d.long + '</div>' +
            '</div>' +
            '</div>'
          );
        }

        function initialize() {
          var map = new google.maps.Map(document.getElementById('map'), {
            center: auC,
            zoom:4,
            disableDefaultUI: true,
            styles: [
              {
                "elementType": "labels",
                "stylers": [
                  { "visibility": "off" }
                ]
              },{
                "featureType": "water",
                "stylers": [
                  { "visibility": "simplified" },
                  { "color": "#FFFFFF" }
                ]
              },{
                "featureType": "landscape",
                "stylers": [
                  { "saturation": -70 },
                  { "lightness": -60 },
                  { "gamma": 0 },
                  { "hue": "#ff0000" }
                ]
              }
            ]
          });

          overlay = new google.maps.OverlayView();
          overlay.onAdd = function()
          {
            var svg = d3.select(this.getPanes().overlayLayer).append('svg');
            overlay.draw = function() {

              projection = this.getProjection();

              auTLP = projection.fromLatLngToDivPixel(auTL);
              auBRP = projection.fromLatLngToDivPixel(auBR);
              auCP = projection.fromLatLngToDivPixel(auC);

              rad = (auBRP.x - auTLP.x) / 800 + 5;

              svg.style('left', auTLP.x + 'px')
                .style('top', auTLP.y + 'px')
                .style('width', auBRP.x - auTLP.x + 'px')
                .style('height', auBRP.y - auTLP.y + 'px');

              svg.selectAll('g')
                .data(d3.keys(scope.sites))
                .enter()
                .append('g')
                .each(function() {
                  d3.select(this)
                    .append('circle')
                    .attr('class', 'big');
                  d3.select(this)
                    .append('circle')
                    .attr('class', 'small');
                })
                .data(d3.keys(scope.sites))
                .exit()
                .remove();

              svg.selectAll('circle')
                .attr('r', rad)
                .attr('cx', 0)
                .attr('cy', 0)
                .attr('fill', '#ff0000');
              svg.selectAll('g')
                .select('.small')
                .on('mousemove', function() {
                  if (currentMouseOver !== this)
                  {
                    currentMouseOver = this;
                    showData(scope.sites[this.__data__]);
                    $(this).css('fill', '#ffffff');
                  }
                  $('#map-info')
                    .css('left', mouseX + 10 + 'px')
                    .css('top', mouseY - 60 + 'px')
                    .show();
                })
                .on('mouseout', function() {
                  $(this).css('fill', '');
                  if (currentMouseOver === this)
                  {
                    currentMouseOver = this;
                    $('#map-info')
                      .hide();
                  }
                });

              svg.selectAll('g')
                .each(function(d) { alignSite(this, scope.sites[d]); });
            };
          };
          overlay.setMap(map);

          setInterval(dostuff, 1000);
        }

        initialize();
        data.getSites({ dataset: 'acorn-sat' }).$promise.then(updateData);
      }
    };
  });
