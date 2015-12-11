'use strict';

angular
  .module('ForgeApp')
  .controller('FullScreenCtrl', function ($scope, User, Drone, Error,
    Stream, $state, $stateParams) {

    $scope.droneId = $stateParams.id;
    $scope.mavStream = {};

    Stream.on('hb', function(data) {
      // console.log(data);
      $scope.liveDroneData = data;

    });

    Stream.on('mavlink', function(data) {
      $scope.preview = data;

      if (!$scope.mavStream[data.drone]) {
        $scope.mavStream[data.drone] = {};
      }

      $scope.mavStream[data.drone][data.payload.header] = data.payload.data;
    });
  })
;
