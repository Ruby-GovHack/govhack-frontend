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
      backendBaseUrl + '/timeseries/:timeperiod/:dataset', {}, {
        get: { method : 'GET', cache : true }
    });

    return {
      // Get sites. Results are cached.
      // Example usage:
      //   getSites({ 'dataset': 'acorn-sat' })
      // Returns:
      //   {
      //     "069018": { "label": "Moruya Heads", "lat": -35.909, "long": 150.153 },
      //     "070351": { "label": "Canberra", "lat": -35.309, "long": 149.2 },
      //     "072150": { "label": "Wagga Wagga", "lat": -35.158, "long": 147.457 },
      //     "072161": { "label": "Cabramurra", "lat": -35.937, "long": 148.378 }
      //   }
      getSites: function(params) {
        return sitesResource.get(params);
      },

      // Get timeseries. Results are cached.
      // Example usage:
      //   temps.query({
      //     'timeperiod': 'monthly', // options 'daily', 'monthly', 'yearly'
      //     'dataset': 'acorn-sat',
      //     'site': '069018' // see getSites()
      //     'max-temp': true,
      //     'max-temp-std-dev': true,
      //     'time': '09-2008', // DD-MM-YYYY depending on timeperiod
      //     'north': -35.0,
      //     'east': 150.5,
      //     'south': -36.0,
      //     'west': 147.2
      //   })
      getTimeseries: function(params) {
        return timeseriesResource.query(params);
      }
    };
  });
