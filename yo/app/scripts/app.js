'use strict';

/**
 * @ngdoc overview
 * @name sposApp
 * @description
 * # sposApp
 *
 * Main module of the application.
 */
angular
  .module('sposApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'hm.readmore',
    'chart.js',
    'rzModule',
    'vAccordion',
    'environment'
  ])
  .config(function ($stateProvider, envServiceProvider) {

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .state('createSession', {
        url: '/session/new',
        templateUrl: 'views/create_session.html',
        controller: 'CreateSessionCtrl'
      })
      .state('createSessionAdvanced', {
        url: '/session/new/advanced',
        templateUrl: 'views/create_session_advanced.html',
        controller: 'CreateSessionCtrl'
      })
      .state('viewSession', {
        url: '/session/view/:id?key',
        templateUrl: 'views/show-session.html',
        controller: 'ShowSessionCtrl'

      })
      .state('contact', {
        url: '/contact',
        templateUrl: 'views/contact.html',
        controller: 'ContactCtrl'

      })
      .state('about', {
        url: '/about',
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'

      });

    envServiceProvider.config({
      domains: {
        development: ['localhost'],
        production: ['stormy02.udl.cat']
      },
      vars: {
        development: {
          apiUrl: 'http://localhost:8080',
          staticUrl: 'http://localhost:8080'
        },
        production: {
          apiUrl: 'http://193.144.12.55:4000',
          staticUrl: 'http://193.144.12.55:4000'
        }
      }

    });

    envServiceProvider.check();


  })



      .run(function ($state) {
        $state.go('home');
      });
