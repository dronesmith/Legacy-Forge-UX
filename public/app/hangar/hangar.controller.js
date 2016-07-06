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
  .controller('HangarCtrl', function ($scope, User, Drone, Error, Stream,
    $uibModal, $state, $rootScope) {

      $scope.previewMode = DSSProps.previewMode;

    Stream.on('hb', function(data) {
      // console.log(data);
      $scope.liveDroneData = data;

    });

    $scope.mavStream = {};
    $scope.simStream = {};
    $scope.simStatus = 'offline';

    // if ($rootScope.terminalInfo) {
    //   $scope.pass = $rootScope.terminalInfo.pass;
    //   $scope.loginInfo = 'ssh://' + $rootScope.terminalInfo.uname
    //     + '@' + $rootScope.terminalInfo.url + ':' + $rootScope.terminalInfo.port;
    // }

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

    Stream.on('terminal:update', function(data) {

      // NOTE
      // This is dirty, but I'm not sure if I should build a service for something
      // like this yet. Since I may be able to fix the embedded terminal issues, this
      // may just be a temporary solution. (Hopefully).
      $rootScope.terminalInfo = data.msg;

      $scope.pass = $rootScope.terminalInfo.pass;
      $scope.loginInfo = 'ssh://' + $rootScope.terminalInfo.uname
        + '@' + $rootScope.terminalInfo.url + ':' + $rootScope.terminalInfo.port;

        var url = $state.href('terminal', {id: data.drone._id});
        window.open(url, "_blank");

      // FIXME
      // Loading terminal embedded in the page has all sorts of CSS problems because
      // gateOne overwrites and deletes everything on page. Issues with dynamically loaded elements
      // from the modal as well.

      // var modalInstance = $uibModal.open({
      //   animation: true,
      //   templateUrl: 'remoteTerminal.html',
      //   controller: 'RemoteTerminalModalCtrl',
      //   size: 'lg',
      //   resolve: {
      //     info: function () {
      //       return data;
      //     }
      //   }
      // });
      //
      // modalInstance.result.then(function (selectedItem) {
      //   console.log("Session closed");
      //   Stream.emit('drone:terminal', {drone: data.drone._id, enable: false});
      // }, function () {
      //   console.log("Session closed");
      //   Stream.emit('drone:terminal', {drone: data.drone._id, enable: false});
      // });
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

    $scope.updateRemoteTerminal = function(id, priorterm) {

      if (priorterm) {
        var url = $state.href('terminal', {id: id});
        window.open(url, "_blank");
      } else {
        var modal = $uibModal.open({
          animation: true,
          templateUrl: 'app/components/alertModal/alertModal.html',
          controller: 'alertModalCtrl',
          resolve: {
            title: function() {
              return '!! Warning !!';
            },
            text: function () {
              return 'This feature has not been fully tested and may be open to security vulnerabilities. Please exercise caution. Please close this session manually when you are finished.';
            }
          }
        });

        modal.result.then(function (selectedItem) {
          Stream.emit('drone:terminal', {drone: id, enable: true});
        }, function() {
          Stream.emit('drone:terminal', {drone: id, enable: false});
        });
      }
    }

    $scope.endRemoteTerminal = function(id) {
      Stream.emit('drone:terminal', {drone: id, enable: false});
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
  // .controller('RemoteTerminalModalCtrl', function($scope, $uibModalInstance, info) {
  //
  //   $scope.loaded = false;
  //
  //   $scope.title = 'ssh://' + info.msg.uname + '@' + info.msg.url + ':' + info.msg.port;
  //
  //   function initGateOne(server, connect) {
  //     GateOne.noSavePrefs['theme'] = 'solarized';
  //     GateOne.noSavePrefs['autoConnectURL'] = connect;
  //     GateOne.noSavePrefs['embedded'] = true;
  //     GateOne.noSavePrefs['goDiv'] = '#termdummy';
  //
  //     GateOne.init({
  //       url: server,
  //       theme: 'solarized',
  //       embedded: true,
  //       goDiv: '#termdummy',
  //       autoConnectURL: connect
  //     }, function() {
  //       GateOne.Base.superSandbox("NewExternalTerm", ["GateOne.Terminal", "GateOne.Terminal.Input"], function(window, undefined) {
  //         "use strict";
  //         GateOne.Terminal.newTerminal(null, null, '#term');
  //         $scope.loaded = true;
  //       });
  //     });
  //   }
  //
  //   initGateOne('http://localhost:10443', 'ssh://' + info.msg.uname + '@' + info.msg.url + ':' + info.msg.port);
  //
  //   $scope.end = function () {
  //     $uibModalInstance.close();
  //   };
  //
  //   $scope.cancel = function () {
  //     $uibModalInstance.dismiss('cancel');
  //   };
  // })
;
