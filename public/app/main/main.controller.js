/**
 * Dronesmith Cloud
 *
 * Principle Engineer: Geoff Gardner <geoff@dronesmith.io>
 *
 * Copyright (C) 2016 Dronesmith Technologies Inc, all rights reserved.
 * Unauthorized copying of any source code or assets within this project, via
 * any medium is strictly prohibited.
 *
 * Proprietary and confidential.
 */

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
