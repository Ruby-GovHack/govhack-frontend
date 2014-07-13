'use strict';

angular.module('govhackFrontendApp')
  .directive('jsMap', function (data) {
    return {
      templateUrl: 'views/jsmap.html',
      restrict: 'E',
      link: function postLink(scope, element) {
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        
        var loadedYears = {};
        var playing = false;
        
        var curMonth = 0;
        var curYear = 0;
        
        var tempRange = [0, 70];
        
        scope.sites = {};
        var overlay;
        var svg;
        var mapType = 'max-temp';

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

        $('#min-temp').click(function() { mapType = this.value; updateSites(); });
        $('#max-temp').click(function() { mapType = this.value; updateSites(); });
        
        $(document).bind('mousemove', function(e) { 
          mouseX = e.pageX;
          mouseY = e.pageY;
        }); 
        
        function monthFormatter(val) {
          return months[val];
        }
        
        $('#button-play').click(function() {
          playing = !playing;
          $(this).find('span')
            .toggleClass('glyphicon-play')
            .toggleClass('glyphicon-pause');
        });
        
        var yearSlader = $('#year-slader').slader({
          tooltip: 'always'
        }).on('slide', setDates);
        var monthSlader = $('#month-slader').slader({
          tooltip: 'always',
          formater: monthFormatter
        }).on('slide', setDates);
        
        function setDates() {
            curMonth = monthSlader.slader('getValue');
            curYear = yearSlader.slader('getValue');
            $('#display-date-month').text(months[curMonth]);
            $('#display-date-year').text(curYear);
            loadYear(curYear);
            updateSites();
        }
        
        function dostuff() {
          if (playing)
          {
            /*d3.selectAll('.big')
              .transition()
              .attr('r', rad + rad + 'px')
              .transition()
              .attr('r', rad + 'px');*/
            //monthSlader.slader('setValue', curMonth);
            yearSlader.slader('setValue', (yearSlader.slader('getValue') + 1) % yearSlader.slader('getAttribute', 'max'));
          }
          setDates();
        }
        
        function updateSites()
        {
          svg.selectAll('g')
            .each(function(d) {
              alignSite(this, scope.sites[d]);
            });
        }
                
        function updateData(response) {
          scope.sites = response.data;
          //$.each(response, function(key, val) {
            //if (/^[0-9]{6}$/.test(key)) {
            //  scope.sites[key] = val;
            //}
          //});
          overlay.draw();
        }

        function alignSite(site, d) {
          var pos = projection.fromLatLngToDivPixel(new google.maps.LatLng(d.lat, d.long));
          $(site)
            .attr('transform', 'translate(' + (pos.x - auTLP.x) + ', ' + (pos.y - auTLP.y) + ')');
          if (site !== currentMouseOver) {
            if (typeof d.data !== 'undefined' && typeof d.data[curYear * 100 + curMonth + 1] !== 'undefined') {
              var sTemp = 0;
              var rTemp = 0;
              if (mapType == 'min-temp') {
                sTemp = (d.data[curYear * 100 + curMonth + 1].low_min_temp + 10);
                rTemp = (d.data[curYear * 100 + curMonth + 1].min_ten_min + 10);
              } else {
                sTemp = (d.data[curYear * 100 + curMonth + 1].high_max_temp + 10);
                rTemp = (d.data[curYear * 100 + curMonth + 1].max_ten_max + 10);
              }
              var percent = sTemp / tempRange[1];
              var percentR = rTemp / tempRange[1];
              var colP = percent;
              var colPR = percentR;
              if (mapType == 'min-temp')
              {
                percent = 1 - percent;
                percentR = 1 - percentR;
              }
              d3.select(site)
                .select('.small')
                  .transition()
                  .style('fill', rgb2hex([Math.floor(colP * 120 + 135), Math.floor((1 - colP) * 255), 0]))
                  .attr('r', rad + rad * percent * percentR);
              d3.select(site)
                .select('.big')
                  .transition()
                  .style('fill', rgb2hex([Math.floor(colPR * 120 + 135), Math.floor((1 - colPR) * 255), 0]))
                  .attr('r', rad + rad * percentR * percentR);
            } else {
              d3.select(site)
                .select('.small')
                  .transition()
                  .style('fill', '')
                  .style('opacity', '')
                  .attr('r', rad);
              d3.select(site)
                .select('.big')
                  .transition()
                  .style('fill', '')
                  .style('opacity', '')
                  .attr('r', rad);
            }
          }
        }
        
        var hexDigits = new Array
          ("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"); 

        function rgb2hex(rgb) {
          return "#" + hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
        }

        function hex(x) {
          return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
        }
        
        function showData(d)
        {
          var cont = 
            '<div class="info-label">' + d.label + '</div>' +
            '<div class="info-text">' + 
            '<div class="row">' +
            '<div class="col-lg-6">Latitude:</div>' +
            '<div class="col-lg-6">' + d.lat + '</div>' +
            '</div><div class="row">' +
            '<div class="col-lg-6">Longitude:</div>' +
            '<div class="col-lg-6">' + d.long + '</div>';
          if (typeof d['data'] !== 'undefined' && typeof d.data[curYear * 100 + curMonth + 1] !== 'undefined')
          {
            cont += 
            '</div><div class="row">' +
            '<div class="col-lg-6">Minimum:</div>' +
            '<div class="col-lg-6">' + d.data[curYear * 100 + curMonth + 1].low_min_temp + '</div>' +
            '</div><div class="row">' +
            '<div class="col-lg-6">Maximum:</div>' +
            '<div class="col-lg-6">' + d.data[curYear * 100 + curMonth + 1].high_max_temp + '</div>' +
            '</div><div class="row">' +
            '<div class="col-lg-6">10 Year Min:</div>' +
            '<div class="col-lg-6">' + d.data[curYear * 100 + curMonth + 1].min_ten_min + '</div>' +
            '</div><div class="row">' +
            '<div class="col-lg-6">10 Year Max:</div>' +
            '<div class="col-lg-6">' + d.data[curYear * 100 + curMonth + 1].max_ten_max + '</div>'
          }
          cont +=
            '</div>' +
            '</div>';
          $('#map-info').html(cont);
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
                  { "saturation": -60 },
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
            svg = d3.select(this.getPanes().overlayLayer).append('svg');
            overlay.draw = function() {

              projection = this.getProjection();

              auTLP = projection.fromLatLngToDivPixel(auTL);
              auBRP = projection.fromLatLngToDivPixel(auBR);
              auCP = projection.fromLatLngToDivPixel(auC);

              rad = (auBRP.x - auTLP.x) / 800 + 4;

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
                  if (currentMouseOver !== this.parentNode)
                  {
                    currentMouseOver = this.parentNode;
                    showData(scope.sites[this.__data__]);
                  }
                  d3.select(this)
                    .style('fill', '#ffffff')
                    .style('opacity', '1')
                    .attr('r', rad * 3);
                  $('#map-info')
                    .css('left', mouseX + 10 + 'px')
                    .css('top', mouseY - 60 + 'px')
                    .slideDown(50);
                })
                .on('mouseout', function() {
                  currentMouseOver = null;
                  alignSite(this.parentNode, scope.sites[this.__data__]);
                  $('#map-info')
                    .slideUp(50);
                });

              updateSites();
            };
          };
          overlay.setMap(map);

          setInterval(dostuff, 2000);
        }

        function updateYearly(response)
        {
          $.each(response.data, function(key, val) {
            if (typeof scope.sites[key] !== 'undefined')
            {
              if (typeof scope.sites[key].data === 'undefined') {
                scope.sites[key].data = response.data[key];
              } else {
                $.extend(scope.sites[key].data, response.data[key]);
              }
            }
          });
          updateSites();
        }
        
        initialize();
        data.getSites({ dataset: 'acorn-sat' }).$promise.then(updateData);
        
        function loadYear(year)
        {
          if (typeof loadedYears[year] === 'undefined' || typeof loadedYears[year + 1] === 'undefined')
          {
            if (typeof loadedYears[year] !== 'undefined') {
              ++year;
            }
            /*
              var auTL = new google.maps.LatLng(-5, 110);
              var auC = new google.maps.LatLng(-28, 133);
              var auBR = new google.maps.LatLng(-49, 156);
            */
            loadedYears[year] = 1;
            loadedYears[year + 1] = 1;
            data.getTimeseries({
               'timeperiod': 'monthly',
               'dataset': 'acorn-sat',
               'high_max_temp': true,
               'low_min_temp': true,
               'max_ten_max': true,
               'min_ten_min': true,
               'start': '01-' + year,
               'end': '12-' + (year + 1)/*,
               'north': '-40',
               'south': '-49',
               'west': '143',
               'east': '156'*/
            }).$promise.then(updateYearly);
          }
        }
      }
    };
  });
