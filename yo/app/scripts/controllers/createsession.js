'use strict';

/**
 * @ngdoc function
 * @name sposApp.controller:CreatesessionCtrl
 * @description
 * # CreatesessionCtrl
 * Controller of the sposApp
 */

angular.module('sposApp')
  .controller('CreateSessionCtrl', function ($scope, $q, $state, $http, $location, VirtualMachine, Parameters, Session, fileReader, ModelInfo, MethodInfo) {
    $scope.vmConfig = {virtualCPUs:0, realCPUs:0, ram:0};
    $scope.parameters = {isClustered: false, files: []};
    $scope.session = {};

    $scope.CreateState = {
      FIRSTSTEP: 1,
      SECONDSTEP: 2,
      CREATING: 3,
      CREATED: 4,
      ERROR: 5
    };

    $scope.CreateStep = {
      CREATING_SESSION: 1,
      UPLOADING_FILE: 2
    };

    $scope.MethodLoadState = {
      NONLOADED: 1,
      LOADING: 2,
      LOADED: 3,
      ERROR: 4
    };

    $scope.location = $location;
    $scope.predefinedVM = "";
    $scope.createStep = $scope.CreateStep.CREATING_SESSION;
    $scope.state = $scope.CreateState.FIRSTSTEP;
    $scope.methodLoadState = $scope.MethodLoadState.NONLOADED;
    $scope.uploadMessage = "";
    $scope.selectedModel = "";
    $scope.selectedMethod = "";
    $scope.errorFile = "";
    $scope.problemType = "";

    $scope.sessionKey = "";
    $scope.sessionId = "";


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

        uploadFiles (session.id, $scope.email, $scope.executionId);
        alert("You will shortly receive and email to gain access to the results ");
      }).catch(function (error) {
        console.log("Error: " + error);
      });

    };

    var uploadFiles = function (id, email, executionId) {
      if ($scope.fileZip) {
        var fd_zip = new FormData();
        fd_zip.append('zip', $scope.fileZip);

        console.log("Upload File and start execution");

        $http.post('http://localhost:8080/session/uploadAndExecution', fd_zip, {
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
          .success(function () {
            console.log("success")
          })
          .error(function () {
          });
      }
    };

  });
