'use strict';

angular
  .module('ForgeApp')
  .controller('signupPaneCtrl', function ($scope, Session, User, Error) {

    $scope.signupSubmitted = false;

    $scope.update = function(model) {
      var user = new User(model);
        user
          .$save()
          .then(function(data) {
            $scope.signupSubmitted = true;
          }, Error)
        ;
    };
  })
;
