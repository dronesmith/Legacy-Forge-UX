'use strict';

angular
  .module('ForgeApp')
  .controller('HangarCtrl', function ($scope, User, Drone, Error, Stream, $uibModal) {

    Stream.on('hb', function(data) {
      // console.log(data);
      $scope.liveDroneData = data;

    });

    $scope.mavStream = {};
    $scope.simStream = {};
    $scope.simStatus = 'offline';

    var simlyCounter = 5;

    setInterval(function() {
      if (simlyCounter-- <= 0) {
        $scope.simStatus = 'offline';
      }
    }, 10 * 1000);

    // got something from simly
    Stream.on('sim:mavlink', function(data) {
      $scope.simStream[data.header] = data.data;
      $scope.simStream.camera = 'follow';
      simlyCounter = 5;
      $scope.simStatus = 'online';
    });

    Stream.on('mavlink', function(data) {
      $scope.preview = data;

      if (!$scope.mavStream[data.drone]) {
        $scope.mavStream[data.drone] = {};
      }

      $scope.mavStream[data.drone][data.payload.header] = data.payload.data;
      $scope.mavStream[data.drone].camera = 'follow';
    });

    if (!$scope.userInfo) {
      $scope.$on('session:update', function(ev, data) {
        $scope.userInfo = data;
        init();
      });
    } else {
      init();
    }

    // when server sends a db update.
    Stream.on('update', function(data) {
      init();
    });

    $scope.getLiveDrone = function(id) {
      if (!$scope.liveDroneData) {
        return null;
      }
      var keys = Object.keys($scope.liveDroneData);
      for (var i = 0; i < keys; ++i) {
        var k = keys[i];
        if (k == id) {
          return $scope.liveDroneData[k];
        }
      }
    };

    $scope.updateGCSBroadcast = function(id) {
      var isBroadcast = $scope.liveDroneData[id].gcBroadcast;
      if (!isBroadcast) {
        var modal = $uibModal.open({
          animation: true,
          templateUrl: 'app/components/alertModal/alertModal.html',
          controller: 'alertModalCtrl',
          resolve: {
            title: function() {
              return '!! Warning !!';
            },
            text: function () {
              return 'This feature allows you to pipe incoming MAVlink from this drone to a Ground Control Station on this computer. '
              + 'By the nature of MAVLink, this data is insecure. Should you continue, it is highly recommended you close this manually when you are finished.'
              + ' You must remain logged in to Dronesmith Cloud, and your drone remain online to receive the data. Please check your router\'s firewall settings if no data is being received.'
              + ' Connect to the data by listening to address 0.0.0.0:14550.';
            }
          }
        });

        modal.result.then(function (selectedItem) {
          Stream.emit('drone:gcs', {drone: id, enable: true});
        }, function() {
        });

      } else {
        Stream.emit('drone:gcs', {drone: id, enable: false});
      }
    }

    $scope.deleteDrone = function(drone) {
      var modal = $uibModal.open({
        animation: true,
        templateUrl: 'app/components/alertModal/alertModal.html',
        controller: 'alertModalCtrl',
        resolve: {
          title: function() {
            return '!! Warning !!';
          },
          text: function () {
            return 'By clicking confirm, all flights associated with this drone will be removed! '
            + 'Any data stored on your drone will remain. Are you really sure you want to do this?';
          }
        }
      });

      modal.result.then(function (selectedItem) {
        Drone
          .delete({id: drone._id})
          .$promise
          .then(function(data) {
            Stream.emit('drone:delete', drone);
            init();
          }, Error);
      }, function () {
      });
    };

    $scope.updateDrone = function(isCollapsed, drone) {
      if (!isCollapsed) {
        return;
      }

      Drone
        .update({id: drone._id}, drone)
        .$promise
        .then(function(data) {
          init();
        }, Error)
      ;
    };

    function init() {
      User
        .get({id: $scope.userInfo.id})
        .$promise
        .then(function(data) {
          $scope.drones = data.drones;
        }, Error)
      ;
    }
  })
;
