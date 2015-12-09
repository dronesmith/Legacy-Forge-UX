'use strict';

angular
  .module('ForgeApp')
  .controller('alertModalCtrl',
    function (
      $scope,
      $uibModalInstance,
      text, title) {

    $scope.text = text;
    $scope.title = title;

    $scope.ok = function () {
      $uibModalInstance.close();
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  })
;
