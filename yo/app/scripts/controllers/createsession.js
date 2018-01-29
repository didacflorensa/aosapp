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
        $scope.aos_data = res.data.aos
      });

   /* $scope.aos_data = [
      {
        id: 'category-agriculture',
        header: 'agriculture',
        models: [
          {
            id: '2SFVSC-model',
            header: '2SFVSC',
            content: 'A Production Planning model considering uncertain demand using two stage stochastic programming in a fresh vegetable supply chain context.'
          },
          {
            id: 'DASC-model',
            header: 'DASC',
            versions: [
              {
                id: 'DASC-model-stochastic',
                header: 'stochastic',
                content: 'A two stage model to help the optimal purchase and storage policies for seasonal fruits.'
              },
              {
                id: 'DASC-model-deterministic',
                header: 'deterministic',
                content: 'A deterministic model to help the optimal purchase and storage policies for seasonal fruits.'
              }
            ]
          },
          {
            id: 'ODFP-model',
            header: 'ODFP',
            content: 'A Production Planning model considering uncertain demand using two stage stochastic programming in a fresh vegetable supply chain context.',
            versions: [
              {
                id: 'ODFP-deterministic',
                header: 'ODFP',
                content: 'A deterministic model to tackle the optimal delivery of fattened pigs to the abattoir.'
              },
              {
                id: 'ODFP-multistage',
                header: 'MSODFP',
                content: 'A multi - stage stochastic model to tackle the optimal delivery of fattened pigs to the abattoir'
              },
              {
                id: 'ODFP-multihorizon',
                header: 'MHODFP',
                content: 'A multi - horizon stochastic model to tackle the optimal delivery of fattened pigs to the abattoir'
              }
            ]
          }
        ]
      },
      {
        id: 'category-electricity',
        header: 'electricity',
        models: [
          {
            id: 'chiara-model',
            header: 'Chiara',
            content: 'A multi - horizon stochastic model to electricity fileds.'
          },
          {
            id: 'sam-model',
            header: 'Sam',

            versions: [
              {
                id: 'sam-model-deterministic',
                header: 'deterministic',
                content: 'A deterministic model to solve the microgrid problem.'
              },
              {
                id: 'sam-model-gt',
                header: 'game theory',
                content: 'A non - linear model to solve the equilibrium problems in microgrids.'
              }
            ]
          }
        ]
      },
      {
        id: 'category-cloud',
        header: 'cloud',
        models: [
          {
            id: 'category-cloud-GP',
            header: 'GP',
            content: 'A non linear model to assing task ensuring SLA.'
          }
        ]
      }
    ];*/


    $scope.expandCallback = function (index, id) {
      console.log('expand:', index, id);
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
      console.log(email);
    };






  });
