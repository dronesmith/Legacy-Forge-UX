'use strict';

angular
  .module('ForgeApp')
  .controller('MainCtrl', function(
    $scope,
    $state,
    Session,
    Stream, // NOTE dep injection immediately constructs socket, initiating connection.
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
            $state.go('hangar');
          }
        }
      }, Error)
    ;
  })
;
