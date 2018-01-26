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

    var accordion_format = [
      {
        id: 'agriculture',
        header: 'agriculture'
      },
      {
        id: 'electricity',
        header: 'electrictiy'
      },
      {
        id: 'pane',
        header: 'pane'
      }
    ];

    console.log("Format: "+accordion_format);

    //$scope.panesA = accordion_format;

/*    $scope.panesA = [
      {
        id: 'pane-1a',
        header: 'agriculture',

        subpanes: [
          {
            id: 'subpane-1a',
            header: '2SFVSC',
            content: 'A Production Planning model considering uncertain demand using two stage stochastic programming in a fresh vegetable supply chain context.'
          },
          {
            id: 'subpane-2a',
            header: 'DASC',
            subsubpanes: [
              {
                id: 'subsubpane-1a',
                header: 'stochastic',
                content: 'A two stage model to help the optimal purchase and storage policies for seasonal fruits.'
              },
              {
                id: 'subsubpane-2a',
                header: 'deterministic',
                content: 'A deterministic model to help the optimal purchase and storage policies for seasonal fruits.'
              }
            ]
          },
          {
            id: 'subpane-3a',
            header: 'ODFP',
            content: 'A Production Planning model considering uncertain demand using two stage stochastic programming in a fresh vegetable supply chain context.'
          }
        ]
//        isExpanded: true
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


    //var json = $.getJSON("resources/aos.json", function () {


    var json = {
      "models": {
        "agriculture": {
          "2SFVSC": {
            "name": "2SFVSC",
            "description": "A Production Planning model considering uncertain demand using two stage stochastic programming in a fresh vegetable supply chain context."
          },
          "DASC": {
            "stochastic": {
              "name": "2SDASC",
              "description": "A two stage model to help the optimal purchase and storage policies for seasonal fruits."
            },
            "deterministic": {
              "name": "DASC",
              "description": "A deterministic model to help the optimal purchase and storage policies for seasonal fruits"
            }
          },
          "ODFP": {
            "deterministic": {
              "name": "ODFP",
              "description": "A deterministic model to tackle the optimal delivery of fattened pigs to the abattoir"
            },
            "multistage": {
              "name": "MSODFP",
              "description": "A multi - stage stochastic model to tackle the optimal delivery of fattened pigs to the abattoir"
            },
            "multihorizon": {
              "name": "ODFP",
              "description": "A multi - horizon stochastic model to tackle the optimal delivery of fattened pigs to the abattoir"
            }
          }
        },

        "electricity": {
          "Chiara": {
            "name": "Chiara Model",
            "description": "A multi - horizon stochastic model to electricity fileds."
          },
          "Sam": {
            "deterministic": {
              "name": "SAM",
              "description": "A deterministic model to solve the microgrid problem."
            },
            "game theory": {
              "name": "SAMGT",
              "description": "A non - linear model to solve the equilibrium problems in microgrids."
            }
          }
        },

        "scheduling": {

          "GP": {
            "name": "Green Police",
            "description": "A non linear model to assing task ensuring SLA."
          }
        }

      }

    };



    var categories = [];
    var aux_app = []

    var app = json.models

    for (var i in app)
    {
      categories.push(i);
      aux_app.push(app[i]);
    }

    var accordion = [];
    var accordion_aux = {};
    var accordion_sub = [];
    var accordion_aux_sub = {};

    for (var y in categories)
    {
      accordion_aux["id"] = categories[y];
      accordion_aux["header"] = categories[y];

      for (var n in aux_app[y])
      {
        console.log(categories[y] +" - "+aux_app[y][n]);
        accordion_aux_sub ["id"] = aux_app[y][n];
        accordion_aux_sub ["header"] = aux_app[y][n];
        accordion_sub.push(accordion_aux_sub);

        accordion_aux_sub = {}

      }

      accordion_aux["subpane"] = accordion_sub;

      accordion_sub = [];

      accordion.push(accordion_aux);

      accordion_aux = {};

    }
    console.log(accordion);


      /*console.log("Debug JSON: " + json);

      var categories = [];
      var json_aux = [];

      console.log("models: " + json.models);

      for (var key in json.models) {
        categories.push(key);
        json_aux.push(json.models[key]);
      }

      //console.log("Debug categories: " + categories);
      //console.log("Debug json_aux: " + json_aux);

      var accordion = [];
      var aux_accordion = {};
      var aux_accordion_sub = {};
      var aux = [];

      for (var i in categories)
      {
        aux_accordion["id"] = categories[i];
        aux_accordion["header"] = categories[i];

        var aux_category = json_aux[i];

        for (var key in aux_category) {
          aux_accordion_sub["id"] = key;
          aux_accordion_sub["header"] = key;
          aux.push(aux_accordion_sub);
          aux_accordion_sub = {};
        }

        aux_accordion["subpane"]=aux;


        accordion.push(aux_accordion);
        aux_accordion = {};
      }

      console.log(accordion);*/

      $scope.panesA = accordion;
      /*var obj2 =  values[0];

      var categories_name = [];
      var categories_values = [];

      for (var key in obj2) {
        if (obj2.hasOwnProperty(key)) {
          categories_name.push(key);
          categories_values.push(obj2[key]);
        }
      }


      console.log("Categories_name: " + categories_name);

      var names2 = [];
      var values2 = [];
      for (var key in values[1]) {
        if (values[1].hasOwnProperty(key)) {
          names2.push(key);
          values2.push(values[1][key]);
        }
      }*/

      /*var



var categories = []
var models = []
var aux_models = []
var aux_applications = []
for (var key in json.models){
    categories.push(key)
    aux_models.push(json.models[key])
}

console.log(aux_models)

for (var c in categories){
    aux_category = aux_models[c]
    for (var key2 in aux_category){
        models.push(key2)
        aux_applications.push(aux_models[key2])
    }
}

console.log(categories)
console.log(models)*/






    //});


    $scope.execution = function () {

      var email = $("#email").val();
      console.log(email);
    };






  });
