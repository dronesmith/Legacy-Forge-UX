'use strict';

angular

  // Add dependencies here
  .module('ForgeApp', [
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ui.router',
    'ui.bootstrap',
    'ui.uploader',
    'ui.map',
    'ui.ace',
    'nvd3',
    'ngCsv',
    'btford.socket-io'

  ])

  // Global configuration here
  .config(function (
    $stateProvider,
    $urlRouterProvider,
    $locationProvider
  ) {

    // Configure app state machine
    $stateProvider

      // Forge is the global non-error state. The app should always rest here.
      .state('forge', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })

      .state('live', {
        url: '/live/:id',
        templateUrl: 'app/fullscreen/fullscreen.html',
        controller: 'FullScreenCtrl'
      })

      // Hangar view
      .state('hangar', {
        url: 'hangar',
        templateUrl: 'app/hangar/hangar.html',
        controller: 'HangarCtrl',
        parent: 'forge'
      })

      // Code Portal
      .state('code', {
        url: 'code',
        templateUrl: 'app/code/code.html',
        controller: 'CodeCtrl',
        parent: 'forge'
      })

      // Reporting view
      .state('analytics', {
        url: 'analytics',
        templateUrl: 'app/reporting/reporting.html',
        controller: 'ReportingCtrl',
        parent: 'forge'
      })

      // Upload flight state
      .state('upload', {
        url: 'upload',
        template: '<uploader></uploader>',
        parent: 'forge'
      })

      // Login state. The app should always redirect to this state whenever the
      // session returned is null.
      .state('login', {
        url: '/login',
        templateUrl: 'app/loginView/loginView.html',
        controller: 'LoginViewCtrl'
      })

      // Signup state. Entered when the user wishes to make a new account.
      .state('signup', {
        url: '/signup',
        template: '<signup-pane></signup-pane>',
        parent: 'login'
      })

      // Whenever the user wishes to reset their password.
      .state('resetPassword', {
        url: '/resetPassword',
        template: '<reset-password-pane></reset-password-pane>',
        parent: 'login'
      })
    ;

    $urlRouterProvider
      .otherwise('/')
    ;

    $locationProvider
      .hashPrefix('!')
      .html5Mode(false)
    ;
  })
;

// Init Google Maps
window.onGoogleReady = function() {
  angular.bootstrap(document.getElementById("map"), ['ui.map']);
};
