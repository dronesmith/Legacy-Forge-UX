'use strict';

angular
  .module('ForgeApp')
  .controller('MainCtrl', function(
    $scope,
    $state,
    Session,
    Error
  ) {

    Session
      .get(
        {},
        function(data) {

        $scope.userInfo = data.userData || null;
        if (!$scope.userInfo) {
          Error(null, 'session:null');
        } else {
          ga('set', '&uid', $scope.userInfo.id);
        }
      }, Error)
    ;
  })
;
