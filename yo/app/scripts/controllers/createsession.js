'use strict';

/**
 * @ngdoc function
 * @name sposApp.controller:CreatesessionCtrl
 * @description
 * # CreatesessionCtrl
 * Controller of the sposApp
 */

angular.module('sposApp')

  .controller('CreateSessionCtrl', function ($scope, $q, $state, $http, $location, envService, VirtualMachine, Parameters, Session) {
    $scope.vmConfig = {virtualCPUs:0, realCPUs:0, ram:0};
    $scope.parameters = {isClustered: false, files: []};
    $scope.session = {};

    $scope.location = $location;

    $scope.sessionKey = "";
    $scope.sessionId = "";

    $scope.environment = envService.get(); // store the current environment
    $scope.vars = envService.read();


    $scope.urlEnvironment = getUrlEnvironment($scope.environment);


    $http.get('resources/aos.json')
      .then(function(res){
        $scope.aos_data = res.data.aos;
      });


    $scope.expandCallback = function (index, id) {
      console.log('expand:', index, id);
      $scope.executionId = id;
    };

    $scope.collapseCallback = function (index, id) {
      console.log('collapse:', index, id);
    };

    $scope.$on('accordionA:onReady', function () {
      console.log('accordionA is ready!');
    });

    //Launch execution

    $scope.execution = function () {
      Session.save($scope.session).$promise.then(function (session) {
        $scope.sessionId = session.id;
        $scope.sessionKey = session.key;

        console.log("Id: " +session.id);
        console.log("key: " +session.key);


        uploadFiles (session.id, $scope.email, $scope.executionId);
        window.alert("To enter for your private area\n Session ID: " + session.id + "\n Key: " + session.key);

      }).catch(function (error) {
        console.log("Error: " + error);
      });

    };

    var uploadFiles = function (id, email, executionId) {
      if ($scope.fileZip) {
        var fd_zip = new FormData();
        fd_zip.append('zip', $scope.fileZip);

        console.log("Upload File and start execution");
        console.log("env: " + $scope.urlEnvironment);

        $http.post($scope.urlEnvironment + '/session/uploadAndExecution', fd_zip, {
          transformRequest: angular.identity,
          headers: {
            'Content-Type': undefined
          },
          params: {
            id: id,
            idExec: executionId,
            email: email
          }
        })
          .then(function () {
            console.log("success");
          })
      }
    };

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

  });
