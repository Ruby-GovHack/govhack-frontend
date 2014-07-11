'use strict';

/**
 * Use this service to access the backend data.
 */
angular.module('govhackFrontendApp')
  .factory('data', function ($resource) {
    var backendBaseUrl = 'http://api.rubygovhackers.org';

    return {
      // Usage:
      //   sites.query()
      // Returns:
      // [
      //     {"id": "069018", "site": "Moruya Heads", "lat": -35.909, "long": 150.153 },
      //     {"id": "070351", "site": "Canberra", "lat": -35.309, "long": 149.2 },
      //     {"id": "072150", "site": "Wagga Wagga", "lat": -35.158, "long": 147.457 },
      //     {"id": "072161", "site": "Cabramurra", "lat": -35.937, "long": 148.378 }
      // ]
      sites: $resource(backendBaseUrl + '/acorn-sat/v1/sites'),

      // Usage:
      //   temps.query({
      //     timeperiod: 'monthly', // options 'daily', 'monthly', 'yearly'
      //     maxormin: 'max', // options 'max', 'min'
      //     time: 200809, // YYYYMMDD depending on timeperiod
      //     north: -35.0,
      //     east: 150.5,
      //     south: -36.0,
      //     west: 147.2
      //   })
      // Returns:
      // [
      //     {"id": "069018", "max":20.02, "std-dev": 5.11 },
      //     {"id": "070351", "max":18.48, "std-dev": 3.95 },
      //     {"id": "072150", "max":20.32, "std-dev": 3.95 },
      //     {"id": "072161", "max":9.61, "std-dev": 3.62 }
      // ]
      temps: $resource(backendBaseUrl + '/:timeperiod/acorn-sat/v1/:maxormin-temp')
    };
  });
