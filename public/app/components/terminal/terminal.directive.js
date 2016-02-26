'use strict';

angular
  .module('ForgeApp')
  .directive('terminal', function() {
    return {
      templateUrl: 'app/components/terminal/terminal.html',
      controller: 'TerminalCtrl'
    }
  })
;
