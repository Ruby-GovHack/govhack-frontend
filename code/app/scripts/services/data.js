'use strict';

/**
 * Use this service to access the backend data.
 */
angular.module('govhackFrontendApp')
  .factory('data', function ($resource) {
    var backendBaseUrl = 'http://api.rubygovhackers.org/v1';

    var sitesResource = $resource(
      backendBaseUrl + '/sites/:dataset', {}, {
        get: { method : 'GET', cache : true }
    });

    var timeseriesResource = $resource(
      backendBaseUrl + '/:timeperiod/:dataset/:vars', {}, {
        get: { method : 'GET', cache : true }
    });

    return {
      // Get sites. Results are cached.
      // Example usage:
      //   getSites({ dataset: 'acorn-sat' })
      // Returns:
      //   {
      //     "069018": { "label": "Moruya Heads", "lat": -35.909, "long": 150.153 },
      //     "070351": { "label": "Canberra", "lat": -35.309, "long": 149.2 },
      //     "072150": { "label": "Wagga Wagga", "lat": -35.158, "long": 147.457 },
      //     "072161": { "label": "Cabramurra", "lat": -35.937, "long": 148.378 }
      //   }
      getSites: function(params, callback) {
        return sitesResource.get(params, callback);
      },

      // Get timeseries. Results are cached.
      // Example usage:
      //   temps.query({
      //     timeperiod: 'monthly', // options 'daily', 'monthly', 'yearly'
      //     dataset: 'acorn-sat'
      //     // any combination of 'min-temp', 'max-temp', 'mean-temp' seperated by '+'
      //     var: 'min-temp+max-temp+mean-temp',
      //     time: '200809', // YYYYMMDD depending on timeperiod
      //     north: -35.0,
      //     east: 150.5,
      //     south: -36.0,
      //     west: 147.2
      //   })
      // Returns:
      //   [
      //     {"id": "069018", "max":20.02, "std-dev": 5.11 },
      //     {"id": "070351", "max":18.48, "std-dev": 3.95 },
      //     {"id": "072150", "max":20.32, "std-dev": 3.95 },
      //     {"id": "072161", "max":9.61, "std-dev": 3.62 }
      //   ]
      getTimeseries: function(params) {
        sites = getSites();
        timeseries = timeseriesResource.query(params);

      },
    };
  });
