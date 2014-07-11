'use strict';

angular.module('govhackFrontendApp')
  .directive('jsMap', function (data) {
    return {
      templateUrl: 'views/jsmap.html',
      restrict: 'E',
      link: function postLink(scope, element) {
        var siteData = [];
        var overlay;
        /*for (var i = 0; i < 20; ++i) {
            siteData.push([Math.random() * 20 - 37, Math.random() * 20 + 123])
        }*/
        
        //var jData = $.parseJSON('[ {"id": "069018", "site": "Moruya Heads", "lat": -35.909, "long": 150.153 }, {"id": "070351", "site": "Canberra", "lat": -35.309, "long": 149.2 }, {"id": "072150", "site": "Wagga Wagga", "lat": -35.158, "long": 147.457 }, {"id": "072161", "site": "Cabramurra", "lat": -35.937, "long": 148.378 } ]');
        
        data.sites.query(updateData);
        var auTL = new google.maps.LatLng(-5, 110);
        var auC = new google.maps.LatLng(-27, 133);
        var auBR = new google.maps.LatLng(-49, 156);
        var rad = 0;
        
        function dostuff() {
            d3.selectAll('.big')
                .transition()
                .attr('r', rad + 8 + 'px')
                .transition()
                .attr('r', rad + 'px');
        }
        
        function updateData(response) {
          for (var i = 0; i < response.length; ++i)
            siteData.push([response[i].lat, response[i].long])
          overlay.draw();
          console.info(siteData);
        }
        
        function initialize() {
          $('input.slider').slider();
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
              d3.selectAll('circle').remove();
              
              var projection = this.getProjection();
              
              var auTLP = projection.fromLatLngToDivPixel(auTL);
              var auBRP = projection.fromLatLngToDivPixel(auBR);
              var auCP = projection.fromLatLngToDivPixel(auC);
              
              rad = (auBRP.x - auTLP.x) / 80;
              
              svg.style('left', auTLP.x + 'px')
                .style('top', auTLP.y + 'px')
                .style('width', auBRP.x - auTLP.x + 'px')
                .style('height', auBRP.y - auTLP.y + 'px');
              
              for (var i = 0; i < siteData.length; ++i) {
                var pos = projection.fromLatLngToDivPixel(new google.maps.LatLng(siteData[i][0], siteData[i][1]));
                svg.append('circle')
                  .attr('r', rad)
                  .attr('cx', pos.x - auTLP.x + 'px')
                  .attr('cy', pos.y - auTLP.y + 'px')
                  .attr('fill', '#ffaa00')
                  .attr('class', 'big');
                svg.append('circle')
                  .attr('class', 'small')
                  .attr('r', rad)
                  .attr('cx', pos.x - auTLP.x + 'px')
                  .attr('cy', pos.y - auTLP.y + 'px')
                  .attr('fill', '#ff0000');
              }
            };
          };
          overlay.setMap(map);
          
          setInterval(dostuff, 1000);
        }
        
        initialize();
      }
    };
  });
