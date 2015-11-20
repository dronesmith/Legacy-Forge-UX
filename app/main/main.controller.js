'use strict';

angular
  .module('ForgeApp')
  .controller('MainCtrl', function(
    $scope,
    $state,
    $http,
    Session,
    Error
  ) {

    $scope.newDatum = {};
    $scope.CSVExport = 'export_' + (new Date()).getTime();

    //
    // Generate test data
    //
    $http.get('app/main/output.json').then(function(data) {
      $scope.flightData = data.data;
      $scope.nvGraphData = [
        addDataStream('Pitch Speed', 'line', '30:pitchspeed', $scope.flightData.flight),
        addDataStream('Yaw Speed', 'area', '30:yawspeed', $scope.flightData.flight),
        addDataStream('Roll Speed', 'bar', '30:rollspeed', $scope.flightData.flight)
      ];

    });

    //
    // Format data for CSV
    //
    $scope.getDataAsCSV = function() {
      var csvData = [['Time (s)']], index = 1;
      $scope.CSVExport = 'export_' + (new Date()).getTime();

      angular.forEach($scope.nvGraphData, function(stream) {
        csvData[0][index] = stream.key;
        var j = 1;
        angular.forEach(stream.values, function(point) {
          if (!csvData[j]) {
            csvData[j] = [];
          }

          if (!csvData[j][0]) {
            csvData[j][0] = point.x;
          }

          csvData[j][index] = point.y;
          ++j;
        });
        ++index;
      });

      return csvData;
    }

    //
    // Initializes a new datum to be edited in the frontend.
    //
    $scope.initDatum = function() {
      return {
        key: 'Altitude',
        type: 'line',
        msg: 74,
        name: 'alt'
      };
    };

    //
    // Get a datum to edit in the front end from a stream.
    //
    $scope.getDatum = function(index) {
      // Somtimes the index will be null if we removed the model.
      index |= 0;

      if ($scope.nvGraphData.length == 0) {
        return;
      }

      var stream = $scope.nvGraphData[index];
      return {
        key: stream.key,
        type: stream.type,
        name: stream.name,
        msg: +stream.msg
      };
    };

    //
    // Update an existing stream.
    //
    $scope.updateDataPoint = function(datum, index) {
      $scope.removeDataPoint(index);
      $scope.addDataPoint(datum);
    };

    //
    // Remove a stream.
    //
    $scope.removeDataPoint = function(index) {
      $scope.nvGraphData.splice(index, 1);
      $scope.newDatum = {};
    };

    //
    // Add a new stream
    //
    $scope.addDataPoint = function(newDatum) {
      $scope.nvGraphData.push(addDataStream(newDatum.key, newDatum.type,
        newDatum.msg + ':' + newDatum.name, $scope.flightData.flight));
    };

    //
    // Add a new set of data.
    //
    var addDataStream = function(name, type, key, data) {
      var filter = key.split(':');
      var stream = {
        msg: filter[0],
        name: filter[1],
        key: name,
        type: type,
        yAxis: 1,
        values: []
      };

      // Check for null data points.
      if (!data[0]) {
        return stream;
      }

      var startTime = (new Date(data[0].time)).getTime();
      angular.forEach(data, function(point) {
        var msg = filter[0];
        var id = filter[1];
        if (point.message == msg) {
          stream.values.push({
            y: point.payload[id],
            x: ((new Date(point.time)).getTime() - startTime) / 1000
          })
        }
      });
      return stream;
    };

    //
    // Graph configuration
    //
    $scope.nvGraphConfig = {
      chart: {
        type: 'multiChart',
        height: 450,
        margin : {
          top: 20,
          right: 20,
          bottom: 60,
          left: 55
        },
        showValues: true,
        valueFormat: function(d){ return d3.format(',.4f')(d); },
        transitionDuration: 500,
        xAxis: {
          tickFormat: function(d) { return d3.format(',.1f')(d); },
          axisLabel: 'Flight Time (s)'
        },
        yAxis1: {
          tickFormat: function(d) { return d3.format(',.3f')(d); },
          axisLabel: 'IMU Data',
          axisLabelDistance: -5
        },
        yAxis2: {
          tickFormat: function(d){ return d3.format(',.1f')(d); }
        }
      }
    };

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
