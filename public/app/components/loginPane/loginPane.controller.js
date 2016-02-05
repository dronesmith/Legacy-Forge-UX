'use strict';

angular
  .module('ForgeApp')
  .controller('LoginPaneCtrl', function ($scope, $state, Session, Error, Stream) {

    $scope.update = function(user) {
      Session
        .authenticate(user)
        .$promise
        .then(function(data) {
          $state.go('forge');
        }, Error)
      ;
    };
  })
;
