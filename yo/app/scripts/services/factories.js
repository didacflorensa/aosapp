'use strict';

/**
 * @ngdoc service
 * @name sposApp.factories
 * @description
 * # factories
 * Service in the sposApp.
 */
angular.module('sposApp')
    .factory('ModelInfo', ['$resource','envService', function($resource, envService) {

      var url = getUrlEnvironment(envService.get());
      return $resource(url+'/models/:action/:search/:id', null,
          {
            'query': { method:'GET', isArray: false },
            'update': { method:'PUT' }
          });
    }]);

angular.module('sposApp')
    .factory('MethodInfo', ['$resource', 'envService', function($resource, envService) {

      var url = getUrlEnvironment(envService.get());
      return $resource(url+'/methods/:action/:search/:id', null,
            {
                'query': { method:'GET', isArray: false },
                'update': { method:'PUT' }
            });
    }]);

angular.module('sposApp')
    .factory('Parameters', ['$resource', 'envService', function($resource, envService) {

      var url = getUrlEnvironment(envService.get());
      return $resource(url+'/parameters/:id', null,
            {
                'query': { method:'GET', isArray: false },
                'update': { method:'PUT' }
            });
    }]);

angular.module('sposApp')
    .factory('Session', ['$resource', 'envService', function($resource, envService) {

      var url = getUrlEnvironment(envService.get());
      return $resource(url+'/session/:id', null,
            {
                'query': { method:'GET', isArray: false },
                'update': { method:'PUT' }
            });
    }]);

angular.module('sposApp')
    .factory('VirtualMachine', ['$resource', 'envService', function($resource, envService) {

      var url = getUrlEnvironment(envService.get());
      return $resource(url+'/virtualmachine/:id', null,
            {
                'query': { method:'GET', isArray: false },
                'update': { method:'PUT' }
            });
    }]);

  function getUrlEnvironment(environment) {

    if (environment === 'development'){
      return 'http://localhost:8080'
    }
    else if (environment === 'production'){
      return 'http://193.144.12.55:4000'
    }
    else {
      return 'http://localhost:8080'
    }
  }


