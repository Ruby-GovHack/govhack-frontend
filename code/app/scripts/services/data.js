'use strict';

/**
 * Use this service to access the backend data.
 */
angular.module('govhackFrontendApp')
  .factory('data', function () {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      someMethod: function () {
        return meaningOfLife;
      }
    };
  });
