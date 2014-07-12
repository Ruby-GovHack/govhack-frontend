'use strict';

angular.module('govhackFrontendApp')
  .directive('jsMap', function (data) {
    return {
      templateUrl: 'views/jsmap.html',
      restrict: 'E',
      link: function postLink(scope, element) {
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      
        var yearSlider = $('#year-slider').slider({
          tooltip: 'always'
        });
        var monthSlider = $('#month-slider').slider({
          tooltip: 'always',
          formater: monthFormatter
        });
        
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
        
        function dostuff() {
          d3.selectAll('.big')
            .transition()
            .attr('r', rad + rad + 'px')
            .transition()
            .attr('r', rad + 'px');
          var curMonth = monthSlider.slider('getValue');
          var curYear = yearSlider.slider('getValue');
          ++curYear;
          //monthSlider.slider('setValue', curMonth);
          yearSlider.slider('setValue', curYear % yearSlider.slider('getAttribute', 'max'));
          $('#display-date').text(months[curMonth] + ', ' + curYear);
        }

        function updateData(response) {
          scope.sites = {};
          $.each(response, function(key, val) {
            if (/^[0-9]{6}$/.test(key))
              scope.sites[key] = val;
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
            styles: [{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"all","stylers":[{"hue":"#d0e19a"},{"lightness":-45},{"saturation":-60}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"simplified"},{"hue":"#ffffff"},{"lightness":100},{"saturation":100}]}]
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
                .on('mousemove', function(e) {
                  if (currentMouseOver != this)
                  {
                    currentMouseOver = this;
                    showData(scope.sites[this.__data__]);
                  }
                  $('#map-info')
                    .css('left', mouseX + 10 + 'px')
                    .css('top', mouseY - 60 + 'px')
                    .show();
                })
                .on('mouseout', function(e) {
                  if (currentMouseOver == this)
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
