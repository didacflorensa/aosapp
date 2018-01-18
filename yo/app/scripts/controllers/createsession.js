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
            header: '2SDASC',
            content: 'A two stage model to help the optimal purchase and storage policies for seasonal fruits.'
          },
          {
            id: 'subpane-1a',
            header: '2SDASC',
            content: 'A two stage model to help the optimal purchase and storage policies for seasonal fruits.'
          }]
      },
      {
        id: 'pane-3a',
        header: 'Pane 3',
        content: 'Aliquam erat ac ipsum. Integer aliquam purus. Quisque lorem tortor fringilla sed, vestibulum id, eleifend justo vel bibendum sapien massa ac turpis faucibus orci luctus non.',

        subpanes: [
          {
            id: 'subpane-1a',
            header: 'Subpane 1',
            content: 'Quisque lorem tortor fringilla sed, vestibulum id, eleifend justo vel bibendum sapien massa ac turpis faucibus orci luctus non.'
          },
          {
            id: 'subpane-2a',
            header: 'Subpane 2 (disabled)',
            content: 'Curabitur et ligula. Ut molestie a, ultricies porta urna. Quisque lorem tortor fringilla sed, vestibulum id.',
            isDisabled: true
          }
        ]
      }
    ];

    $scope.panesB = [
      {
        id: 'pane-1b',
        header: 'Pane 1',
        content: 'Curabitur et ligula. Ut molestie a, ultricies porta urna. Vestibulum commodo volutpat a, convallis ac, laoreet enim. Phasellus fermentum in, dolor. Pellentesque facilisis. Nulla imperdiet sit amet magna. Vestibulum dapibus, mauris nec malesuada fames ac turpis velit, rhoncus eu, luctus et interdum adipiscing wisi.',
        isExpanded: true
      },
      {
        id: 'pane-2b',
        header: 'Pane 2',
        content: 'Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellentesque dui, non felis. Maecenas malesuada elit lectus felis, malesuada ultricies.'
      },
      {
        id: 'pane-3b',
        header: 'Pane 3',
        content: 'Aliquam erat ac ipsum. Integer aliquam purus. Quisque lorem tortor fringilla sed, vestibulum id, eleifend justo vel bibendum sapien massa ac turpis faucibus orci luctus non.',

        subpanes: [
          {
            id: 'subpane-1b',
            header: 'Subpane 1',
            content: 'Quisque lorem tortor fringilla sed, vestibulum id, eleifend justo vel bibendum sapien massa ac turpis faucibus orci luctus non.'
          },
          {
            id: 'subpane-2b',
            header: 'Subpane 2 (disabled)',
            content: 'Curabitur et ligula. Ut molestie a, ultricies porta urna. Quisque lorem tortor fringilla sed, vestibulum id.',
            isDisabled: true
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

  });
