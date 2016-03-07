'use strict';

angular
  .module('ForgeApp')
  .directive('appView', function() {
    return {
      templateUrl: 'app/components/appView/appview.html',
      controller: 'AppViewCtrl'
    }
  })
;
