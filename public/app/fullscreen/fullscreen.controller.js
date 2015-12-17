'use strict';

angular
  .module('ForgeApp')
  .controller('FullScreenCtrl', function ($scope, User, Drone, Error,
    Stream, $state, $stateParams) {

    $scope.droneId = $stateParams.id;
    $scope.mavStream = {};
    $scope.simStream = {};
    $scope.cameraMode = 'follow';

    // Null drone means use sim.
    if (!$scope.droneId) {
      Stream.on('sim:mavlink', function(data) {
        $scope.simStream[data.header] = data.data;
        updateHud($scope.simStream);

      });

    } else {

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
        updateHud($scope.mavStream[data.drone]);
      });
    }

    $scope.getDisplayText = function(str) {
      var stream;
      if ($scope.droneId) {
        stream = $scope.mavStream[$scope.droneId];
      } else {
        stream = $scope.simStream;
      }

      if (!stream) {
        return 0;
      }

      switch (str) {
        case 'roll': return (stream['ATTITUDE'][str] * (180 / 3.1415)).toFixed(2); break;

        case 'alt':
        case 'groundspeed':
        case 'throttle': return (stream['VFR_HUD'][str]).toFixed(2); break;

        case 'battery_remaining': return (stream['SYS_STATUS'][str]); break;

        case 'roll': return (stream['ATTITUDE'][str] * (180 / 3.1415)).toFixed(2); break;
      }
    }

    function updateHud(stream) {
      var width = window.innerWidth;
      var height = window.innerHeight;
      var loch;
      var locw;

      stream.camera = $scope.cameraMode;

      $('#throttleHeading').css({
        top: (height / 2) - 60,
        left: (width / 2) - 180
      });
      $('#speedHeading').css({
        top: (height / 2) - 60,
        left: (width / 2) + 135
      });

      $('#batteryHeading').css({
        top: (height / 2),
        left: (width / 2) - 80
      });

      $('#bat').css({
        top: (height / 2) + 10,
        left: (width / 2) - 80
      });

      $('#altHeading').css({
        top: (height / 2),
        left: (width / 2) + 80
      });

      $('#alt').css({
        top: (height / 2) + 10,
        left: (width / 2) + 80
      });

      if (stream['VFR_HUD']) {
        var throttlegui = $('#throttleArrow');
        var throttletext = $('#throttleAngle');

        var groundspeedArrow = $('#groundspeedArrow');
        var groundspeedText = $('#speed');

        loch = (height / 2) + 140 - stream['VFR_HUD'].throttle;
        locw = (width / 2) - 150;

        throttlegui.css({
          top: loch,
          left: locw
        });

        throttletext.css({
          top: loch,
          left: locw - 40
        });

        loch = (height / 2) + 140 - stream['VFR_HUD'].groundspeed * 10;
        locw = (width / 2) + 135;
        groundspeedArrow.css({
          top: loch,
          left: locw,
          transform: 'scaleX(-1)'
        });

        groundspeedText.css({
          top: loch,
          left: locw + 20
        });

        var scaling = 1.5;

        // if (stream['VFR_HUD'].heading < 225 || stream['VFR_HUD'].heading > 315) {
          $('#compassN').css({
            position: 'fixed',
            top: '14%',
            left: (width / 2) - (stream['VFR_HUD'].heading) * scaling
          });
        // }

        // $('#compassN2').css({
        //   position: 'fixed',
        //   top: '14%',
        //   left: (width / 2) - (stream['VFR_HUD'].heading + 360) * scaling
        // });

        $('#compassE').css({
          position: 'fixed',
          top: '14%',
          left: (width / 2) - (stream['VFR_HUD'].heading + 90) * scaling
        });

        $('#compassS').css({
          position: 'fixed',
          top: '14%',
          left: (width / 2) - (stream['VFR_HUD'].heading - 90) * scaling
        });

        $('#compassW').css({
          position: 'fixed',
          top: '14%',
          left: (width / 2) - (stream['VFR_HUD'].heading - 180) * scaling
        });
      }

      if (stream['ATTITUDE']) {

        // Grab elements
        var elem = $('#flightangle');
        var arrow = $('#angleArrow');
        var rollText = $('#rollAngle');


        var rval = stream['ATTITUDE'].roll * (180 / 3.1415);
        var pval = stream['ATTITUDE'].pitch * (180 / 3.1415);

        loch = (height / 2) + 18 - (100 * Math.cos(stream['ATTITUDE'].roll * 2 * 3.1415));
        locw = (width / 2) - (100 * Math.sin(stream['ATTITUDE'].roll * 2 * 3.1415));

        elem.css({
            transform: 'rotate(' + -rval + 'deg)' + 'rotateX(' + -pval + 'deg)'
        });

        arrow.css({
          top: loch,
          left: locw
        });

        rollText.css({
          top:    loch - 10,
          left:   locw
        });

      }
    }

  })
;
