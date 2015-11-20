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
    $scope.series = 0; // dumb, but necessary. FIXME
    $scope.CSVExport = 'export_' + (new Date()).getTime();

    //
    // Generate test data
    //
    $http.get('app/main/output.json').then(function(data) {
      $scope.flightData = data.data;
      $scope.nvGraphData = [
        addDataStream('Roll', 'line', '30:roll', $scope.flightData.flight),
        addDataStream('Yaw', 'line', '30:yaw', $scope.flightData.flight),
        addDataStream('Roll Speed', 'line', '30:rollspeed', $scope.flightData.flight)
      ];

      $scope.stream = $scope.nvGraphData[0];

    });

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
    $scope.getDatum = function(stream) {
      return {
        index: stream.series,
        key: stream.key,
        type: stream.type,
        name: stream.name,
        msg: +stream.msg
      };
    };

    //
    // Update an existing stream.
    //
    $scope.updateDataPoint = function(datum) {
      $scope.removeDataPoint(datum);
      $scope.addDataPoint(datum);
    };

    //
    // Remove a stream.
    //
    $scope.removeDataPoint = function(datum) {
      $scope.nvGraphData.splice(datum.series, 1);
      $scope.newDatum = {};
      $scope.stream = $scope.nvGraphData[0];
    };

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

    $scope.addDataPoint = function(newDatum) {
      $scope.nvGraphData.push(addDataStream(newDatum.key, newDatum.type,
      newDatum.msg + ':' + newDatum.name, $scope.flightData.flight));
      $scope.stream = $scope.nvGraphData[0];
      console.log($scope.stream);
    };

    //
    // Add a new set of data.
    //
    var addDataStream = function(name, type, key, data) {
      var filter = key.split(':');
      var stream = {
        series: $scope.series++,
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
