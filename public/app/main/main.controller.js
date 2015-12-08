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

    //
    // Get session
    //
    Session
      .get(
        {},
        function(data) {

          $scope.userInfo = data.userData || null;

        if (!data.userData) {
          Error(null, 'session:null');
        } else {
          ga('set', '&uid', data.userData.id);

          $scope.$broadcast("session:update", data.userData);
        }
      }, Error)
    ;
  })
;
