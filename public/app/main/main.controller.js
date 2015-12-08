'use strict';

angular
  .module('ForgeApp')
  .controller('MainCtrl', function(
    $scope,
    $state,
    Session,
    Error
  ) {

    if ($state.current.name == 'forge') {
      $state.go('analytics');
    }

    // TODO global session handling
  })
;
