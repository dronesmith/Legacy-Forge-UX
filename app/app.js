'use strict';

angular

  // Add dependencies here
  .module('ForgeApp', [
    'ngResource',
    'ngRoute',
    'ui.router',
    'ui.bootstrap'
  ])

  // Global configuration here
  .config(function (
    $stateProvider,
    $urlRouterProvider,
    $locationProvider
  ) {

    $urlRouterProvider
      .otherwise('/')
    ;

    $locationProvider
      .html5Mode(true)
    ;
  })
;
