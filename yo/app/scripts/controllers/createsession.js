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

    $scope.panesA = [
      {
        id: 'pane-1a',
        header: '2SFVSC',
        content: 'A Production Planning model considering uncertain demand using two stage stochastic programming in a fresh vegetable supply chain context.',
        isExpanded: true
      },
      {
        id: 'pane-2a',
        header: 'DASC',

        subpanes: [
          {
            id: 'subpane-1a',
            header: 'stochastic',
            content: 'A two stage model to help the optimal purchase and storage policies for seasonal fruits.'
          },
          {
            id: 'subpane-2a',
            header: 'deterministic',
            content: 'A deterministic model to help the optimal purchase and storage policies for seasonal fruits.'
          },
          {
            id: 'subpane-3a',
            header: 'ODFP',

            subsubpanes: [
              {
                id: 'subsubpane-1a',
                header: 'deterministic',
                content: 'A deterministic model to tackle the optimal delivery of fattened pigs to the abattoir'
              },
              {
                id: 'subsubpane-2a',
                header: 'multistage',
                content: 'A multi - stage stochastic model to tackle the optimal delivery of fattened pigs to the abattoir.'
              },
              {
                id: 'subsubpane-3a',
                header: 'multihorizon',
                content: 'A multi - horizon stochastic model to tackle the optimal delivery of fattened pigs to the abattoir.'
              }

            ]
          }

          ]
      },
      {
        id: 'pane-3a',
        header: 'electricity',

        subpanes: [
          {
            id: 'subpane-1a',
            header: 'Chiara',
            content: 'A multi - horizon stochastic model to electricity fileds.'
          },
          {
            id: 'subpane-2a',
            header: 'Sam',

            subsubpanes: [
              {
                id: 'subsubpane-1a',
                header: 'deterministic',
                content: 'A deterministic model to solve the microgrid problem.'
              },
              {
                id: 'subsubpane-1a',
                header: 'game theory',
                content: 'A non - linear model to solve the equilibrium problems in microgrids.'
              }
            ]
          }
        ]
      },

      {
        id: 'pane-4a',
        header: 'sheduling',

        subpanes: [
          {
            id: 'subpane-1a',
            header: 'GP',
            content: 'A non linear model to assing task ensuring SLA.'
          }
        ]
      }
    ];


    $scope.expandCallback = function (index, id) {
      console.log('expand:', index, id);
    };

    $scope.collapseCallback = function (index, id) {
      console.log('collapse:', index, id);
    };

    $scope.$on('accordionA:onReady', function () {
      console.log('accordionA is ready!');
    });


    var json = $.getJSON("resources/aos.json", function () {
      console.log("Success");
      var data_str = JSON.stringify(json);

      console.log("Debug: " + data_str);


      var obj =  JSON.parse(data_str);

      console.log("Debug2: " + obj);

      var names = [];
      var values = [];

      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          names.push(key);
          values.push(obj[key]);
        }
      }

      var obj2 =  values[1];

      console.log("Model 0: " + obj.models);

      console.log("Model 0: " + obj2.models);
      /*console.log("1: " + obj2.models.agriculture[0]);
      console.log("2: " + obj2.models.agriculture[1]);
      console.log("3: " + obj2.models.agriculture[2]);
      console.log("4: " + obj2.models.agriculture[3]);*/


      console.log("JSON: " + values[1]);



    });


    $scope.execution = function () {

      var email = $("#email").val();
      console.log(email);
    };






  });
