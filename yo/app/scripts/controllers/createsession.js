'use strict';

/**
 * @ngdoc function
 * @name sposApp.controller:CreatesessionCtrl
 * @description
 * # CreatesessionCtrl
 * Controller of the sposApp
 */

angular.module('sposApp')
  .controller('CreateSessionCtrl', function ($scope, $q, $state, $http, $location) {
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


   /* var json;
    $http.get('resources/aos.json')
      .then(function(res){
        console.log(res.data);
        json = res.data;
        var categories = [];
        var apps = [];
        var models = [];

        for (var c in json.models){
          categories.push(c);
          var temp_apps = [];
          for(var app in json.models[c]){
            temp_apps.push(app);
            var temp_model = [];
            for(var model in json.models[c][app]){
              console.log(model);

              console.log("----");
              if (model !== "name"  & model !== "description"){
                temp_model.push(model)
              }
            }
            models.push(temp_model)
          }
          apps.push(temp_apps)
        }

        console.log(categories);
        console.log(apps);
        console.log(models);
  });*/




    $scope.execution = function () {

      var email = $("#email").val();
      console.log(email + "id: " + $scope.executionId);

        var config = {
          headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
        };

        var data = $.param({
          id: $scope.executionId,
          email: email
        });

        $http.post("http://localhost:8080/session/execution", data, config)
          .success(function () {
            console.log("Success");
          });
    };

    var uploadFileToUrl = function(file, uploadUrl){
      var fd = new FormData();

      console.log(file);

      return;

      fd.append('fileZip', file);


      $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
      })
        .success(function(){
          console.log("Success");
        })
        .error(function(){
          console.log("Error");
        });
    };

    //TODO create request on SessionController.java
    //TODO Implement this request and test
    $scope.uploadFiles = function () {
      uploadFileToUrl($scope.fileZip, "http://localhost:8080/uploadFile");
    };






  });
