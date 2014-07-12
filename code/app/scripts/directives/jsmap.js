'use strict';

angular.module('govhackFrontendApp')
  .directive('jsMap', function (data) {
    return {
      templateUrl: 'views/jsmap.html',
      restrict: 'E',
      link: function postLink(scope, element) {
        $('#date-slider').slider({
          tooltip: 'always'
        });
        scope.sites = {};
        var overlay;
        /*for (var i = 0; i < 20; ++i) {
            siteData.push([Math.random() * 20 - 37, Math.random() * 20 + 123])
        }*/
        
        //var jData = $.parseJSON('[ {"id": "069018", "site": "Moruya Heads", "lat": -35.909, "long": 150.153 }, {"id": "070351", "site": "Canberra", "lat": -35.309, "long": 149.2 }, {"id": "072150", "site": "Wagga Wagga", "lat": -35.158, "long": 147.457 }, {"id": "072161", "site": "Cabramurra", "lat": -35.937, "long": 148.378 } ]');
        
        var auTL = new google.maps.LatLng(-5, 110);
        var auC = new google.maps.LatLng(-28, 133);
        var auBR = new google.maps.LatLng(-49, 156);
        var auTLP;
        var auBRP;
        var auCP;
        var projection;
        var rad = 0;
        
        function dostuff() {
          d3.selectAll('.big')
            .transition()
            .attr('r', rad + 8 + 'px')
            .transition()
            .attr('r', rad + 'px');
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
            mapTypeId:google.maps.MapTypeId.TERRAIN
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
              rad = (auBRP.x - auTLP.x) / 80;
              
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
