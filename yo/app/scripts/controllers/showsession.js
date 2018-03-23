'use strict';

/**
 * @ngdoc function
 * @name sposApp.controller:ShowSessionCtrl
 * @description
 * # ShowSessionCtrl
 * Controller of the sposApp
 */
angular.module('sposApp')
  .controller('ShowSessionCtrl', function ($scope, $sce, $http, $stateParams, Session, envService) {
      $scope.sessionKey = $stateParams.key;
      $scope.sessionId = $stateParams.id;
      $scope.sessionExecutionId = $stateParams.executionId;

      $scope.session = null;
      $scope.logged = false;
      $scope.loginError = "";
      $scope.sessionStatus = "---------";
      $scope.files = [];
      $scope.shortResults = "";
      $scope.fullResults = "";

      $scope.cpuLabels = [];
      $scope.cpuData = [[]];

      $scope.memLabels = [];
      $scope.memData = [[]];

      $scope.showCharts = true;
      $scope.loadingFile = "Loading input file... Please wait.";
      $scope.divFile = "";
      $scope.messageDownload = false;
      $scope.buttonDownload = true;
      $scope.statePrepared = true;
      $scope.stateExectuion = false;
      $scope.stateFinished = false;
      $scope.urlEnvironment = "";



    $scope.init = function () {
        ClearSession();
        $scope.logged = $scope.sessionKey && $scope.sessionId;
        $scope.loadingFile
        $scope.urlEnvironment = getUrlEnvironment($scope.environment);

        console.log("env: " + $scope.urlEnvironment);

        if ($scope.logged){
          GetSession();
          GetResultFile();
        }
      };

      var GetResultFile = function () {

        if($scope.session.executionState == 'R'){
          $http.get($scope.urlEnvironment + '/session/' + $scope.sessionId + "/GetFileResults", "")
            .then(function (resultData) {
              console.log(resultData.data);
              $scope.loadingFile = resultData.data;
              angular.element('#divFile').css('height', '500px');
            });
        }

        else if($scope.session.executionState == 'F'){
          $scope.loadingFile = "The execution is finalized. To see the results download them";
          angular.element('#divFile').css('height', '70px');

        }

      };


      $scope.logInSession = function(){
        GetSession();
      };

      $scope.getFile = function(){
        ClearSession();
        $scope.logged = $scope.sessionKey && $scope.sessionId;
        $scope.loadingFile
        if ($scope.logged){
          GetSession();
          GetResultFile();
        }
        var $icon = document.getElementsByClassName("icon-refresh"),
          animateClass = "icon-refresh-animate";
        $(".icon-refresh1").addClass( animateClass );
        window.setTimeout( function() {
          $(".icon-refresh1").removeClass( animateClass );
        }, 2000 );

      };

      var GetSession = function () {
        Session.query({id: $scope.sessionId, key: $scope.sessionKey})
          .$promise.then(function (session) {
            if (session) {
              $scope.logged = true;
              $scope.session = session;

              GetResultFile();
              GetSessionStatus();
              if ($scope.files.length == 0) {
                $http.get($scope.urlEnvironment + '/session/' + $scope.sessionId + "/inputFiles?key=" + $scope.sessionKey, "")
                  .success(function (rawData, status) {
                    var files = rawData.split("//++//@^@//++//");
                    for (var i = 0; i < files.length; i++) {
                      var file = {name: "", content: ""};
                      var fileData = files[i].split('//++//@*@//++//');
                      file.name = fileData[0];
                      file.content = fileData[1];
                      $scope.files.push(file);
                    }
                  });
              }
              if ($scope.shortResults == "" && $scope.fullResults == "") {
                $http.get('http://localhost:8080/session/' + $scope.sessionId + "/results?key=" + $scope.sessionKey, "")
                  .success(function (resultData, status) {
                    GetResults(resultData);
                    GetChartsData(resultData);
                    GetSessionStatus();
                  });
                GetSessionStatus();
              }
            }

        }).catch(function (error) {
            $scope.loginError = "Incorrect ID or key. Please try again";
        });
      };

      var GetResults = function (resultData) {
        $scope.shortResults = resultData[0];
        $scope.fullResults = resultData[1];
        var blob = new Blob([$scope.fullResults], { type : 'text/plain' });
        $scope.url = (window.URL || window.webkitURL).createObjectURL(blob);
        GetSessionStatus();
      };

      var GetChartsData = function(resultData) {
        var rawCpuData = resultData[2].match(/^.*((\r\n|\n|\r)|$)/gm);
        var rawMemData = resultData[3].match(/^.*((\r\n|\n|\r)|$)/gm);

        var executionDuration = parseInt(resultData[4]);
        if (executionDuration < 60 * 20)
        {
          $scope.showCharts = false;
        }

        for (var i=0; i < rawCpuData.length; i++){

          if (rawCpuData[i].indexOf(':') == -1 || rawMemData[i].indexOf(':') == -1)
            continue;

          var splitCpuData = rawCpuData[i].split(':');
          var splitMemData = rawMemData[i].split(':');

          var utcCpuSeconds = parseInt(splitCpuData[0].trim());
          var utcMemSeconds = parseInt(splitMemData[0].trim());

          var cpuDate = new Date(0);
          var memDate = new Date(0);

          cpuDate.setUTCSeconds(utcCpuSeconds);
          memDate.setUTCSeconds(utcMemSeconds);

          if (i%3 == 0){
            $scope.cpuLabels.push(("0" + cpuDate.getHours()).slice(-2) + ":" +("0" + cpuDate.getMinutes()).slice(-2));
            $scope.memLabels.push(("0" + memDate.getHours()).slice(-2) + ":" +("0" + memDate.getMinutes()).slice(-2));
          } else {
            $scope.cpuLabels.push("");
            $scope.memLabels.push("");
          }


          $scope.cpuData[0].push(Number(splitCpuData[1].trim()));
          $scope.memData[0].push(Number(splitMemData[1].trim()) / 1048576);
        }
      };

      var GetSessionStatus = function () {
        var result;
        var errorMsg = "An error has occurred during the execution. Please download the full result to check the solver output";

        if ($scope.session == null)
          result = "---------";

        if ($scope.session.executionState == "P"){
          result = $sce.trustAsHtml("<span style=\"color: #ff7f02;\"> Preparing </span>");
          $scope.statePrepared = true;
          $scope.stateExectuion = false;
          $scope.stateFinished = false;
        }

        if ($scope.session.executionState == "R"){
          result = $sce.trustAsHtml("<span style=\"color: #FFC107;\"> Executing </span>");
          $scope.statePrepared = false;
          $scope.stateExectuion = true;
          $scope.stateFinished = false;
        }

        if ($scope.session.executionState == "F"){
          result = $sce.trustAsHtml("<span style=\"color: #4CAF50;\"> Finished </span>");
          $scope.messageDownload = true;
          $scope.buttonDownload = false;

          $scope.statePrepared = false;
          $scope.stateExectuion = false;
          $scope.stateFinished = true;
        }

        if (($scope.fullResults != "" && ($scope.fullResults.toLowerCase().indexOf("fatal") != -1))
              || ($scope.fullResults != "" && $scope.shortResults == errorMsg)) {

          result = $sce.trustAsHtml("<span style=\"color: #ff0011;\"> Error </span>");
        }

        if ($scope.fullResults != "" && ($scope.shortResults == "" ))
        {
          $scope.shortResults = $scope.fullResults;
        }

        $scope.sessionStatus = result;
      };

      var ClearSession = function () {
        $scope.session = null;
        $scope.logged = false;
        $scope.loginError = "";
        $scope.sessionStatus = "---------";
      };

      $scope.refresh = function () {
        var $icon = document.getElementsByClassName("icon-refresh"),
          animateClass = "icon-refresh-animate";
        ClearSession();
        GetSession();
        $(".icon-refresh").addClass( animateClass );
        window.setTimeout( function() {
          $(".icon-refresh").removeClass( animateClass );
        }, 2000 );
      };

      $scope.init();

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
  })
  .config(['$compileProvider',
    function ($compileProvider) {
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
    }]);
