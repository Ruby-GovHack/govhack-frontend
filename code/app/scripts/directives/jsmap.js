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

        
        var auTL = new google.maps.LatLng(-5, 110);
        var auC = new google.maps.LatLng(-28, 133);
        var auBR = new google.maps.LatLng(-49, 156);
        var auTLP;
        var auBRP;
        var auCP;
        var projection;
        var rad = 0;

        function monthFormatter(val) {
          return months[val];
        }
        
        function dostuff() {
          d3.selectAll('.big')
            .transition()
            .attr('r', rad + 4 + 'px')
            .transition()
            .attr('r', rad + 'px');
          var curMonth = monthSlider.slider('getValue');
          var curYear = yearSlider.slider('getValue');
          ++curYear;
          //monthSlider.slider('setValue', curMonth);
          yearSlider.slider('setValue', curYear % yearSlider.slider('getAttribute', 'max'));
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

        function initialize() {
          var map = new google.maps.Map(document.getElementById('map'), {
            center: auC,
            zoom:4,
            mapTypeId:google.maps.MapTypeId.TERRAIN,
            styles: [{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"all","stylers":[{"hue":"#727D82"},{"lightness":-30},{"saturation":-80}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"simplified"},{"hue":"#F3F4F4"},{"lightness":80},{"saturation":-80}]}]
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

              rad = (auBRP.x - auTLP.x) / 160;

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
