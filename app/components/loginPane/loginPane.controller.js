'use strict';

angular
  .module('ForgeApp')
  .controller('LoginPaneCtrl', function ($scope, Session) {

    $scope.update = function(user) {
      Session
        .authenticate($scope.loginInfo)
        .$promise
        .then(function(data) {
          // $state.go('forge');
        })
      ;
    };
  })
;
