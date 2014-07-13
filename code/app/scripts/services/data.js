'use strict';

/**
 * Use this service to access the backend data.
 */
angular.module('govhackFrontendApp')
  .factory('data', function ($resource) {
    var backendBaseUrl = 'http://api.rubygovhackers.org/v1';

    // Wrap JSON with an extra object layer so that angular can
    // add it's properties but we can still loop over the actual
    // properties of the object.
    var dataWrapper = function(dataString) {
      var data = JSON.parse(dataString);
      return {
        data: data
      };
    };

    var sitesResource = $resource(
      backendBaseUrl + '/sites/:dataset', {}, {
        get: {
          method : 'GET',
          cache : true,
          transformResponse: dataWrapper
        }
    });

    var timeseriesResource = $resource(
      backendBaseUrl + '/timeseries/:timeperiod/:dataset', {}, {
        get: {
          method : 'GET',
          cache : true,
          transformResponse: dataWrapper
        }
    });

    return {
      // Get sites. Results are cached.
      // Example usage:
      //   getSites({ 'dataset': 'acorn-sat' })
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
        return timeseriesResource.get(params);
      }
    };
  });
