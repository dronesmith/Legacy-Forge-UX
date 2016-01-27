'use strict';

angular
  .module('ForgeApp')
  .controller('MainCtrl', function(
    $scope,
    $state,
    Session,
    Error
  ) {

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

          if ($state.current.name == 'forge') {
            $state.go('analytics');
          }
        }
      }, Error)
    ;
  })
;
