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
    $scope.series = 0; // dumb, but necessary.

    $http.get('app/main/output.json').then(function(data) {
      $scope.flightData = data.data;
      $scope.data = [
        $scope.addDatum('Roll', 'line', '30:roll', $scope.flightData.flight),
        $scope.addDatum('Yaw', 'line', '30:yaw', $scope.flightData.flight),
        $scope.addDatum('Roll Speed', 'line', '30:rollspeed', $scope.flightData.flight)
      ];

      $scope.stream = $scope.data[0];

    });

    $scope.initDatum = function() {
      return {
        key: 'Altitude',
        type: 'line',
        msg: 74,
        name: 'alt'
      };
    };

    $scope.getDatum = function(stream) {
      return {
        index: stream.series,
        key: stream.key,
        type: stream.type,
        name: stream.name,
        msg: +stream.msg
      };
    };

    $scope.updateDataPoint = function(datum) {
      $scope.data.splice(datum.series, 1);
      $scope.addDataPoint(datum);
      $scope.updateGraph();
    };

    $scope.removeDataPoint = function(datum) {
      $scope.data.splice(datum.series, 1);
      $scope.updateGraph();
    };

    $scope.updateGraph = function() {
      // FIXME
      // console.log(nv);
      // if (nv && nv.graphs) {
      //   nv.graphs.forEach(function(nvGraph) {
      //     console.log("got here");
      //     nvGraph.update();
      //   });
      // }
    }

    $scope.addDataPoint = function(newDatum) {
      $scope.data.push($scope.addDatum(newDatum.key, newDatum.type,
      newDatum.msg + ':' + newDatum.name, $scope.flightData.flight));
      $scope.updateGraph();
    };

    $scope.addDatum = function(name, type, key, data) {
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
          // console.log(point);
          stream.values.push({
            y: point.payload[id],
            x: ((new Date(point.time)).getTime() - startTime) / 1000
          })
        }
      });
      return stream;
    }

    $scope.options = {
        chart: {
            type: 'multiChart',
            height: 450,
            margin : {
                top: 20,
                right: 20,
                bottom: 60,
                left: 55
            },
            // x: function(d){ return d.label; },
            // y: function(d){ return d.value; },
            showValues: true,
            valueFormat: function(d){
                return d3.format(',.4f')(d);
            },
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

    // function generateData(){
    //         var testdata = stream_layers(1,10+Math.random()*100,.1).map(function(data, i) {
    //             return {
    //                 key: 'Stream' + i,
    //                 values: data.map(function(a){a.y = a.y * (i <= 1 ? -1 : 1); return a})
    //             };
    //         });
    //
    //         testdata[0].type = "area"
    //         testdata[0].yAxis = 1
    //         // testdata[1].type = "area"
    //         // testdata[1].yAxis = 1
    //         // testdata[2].type = "line"
    //         // testdata[2].yAxis = 1
    //         // testdata[3].type = "line"
    //         // testdata[3].yAxis = 2
    //         // testdata[4].type = "bar"
    //         // testdata[4].yAxis = 2
    //         // testdata[5].type = "bar"
    //         // testdata[5].yAxis = 2
    //         // testdata[6].type = "bar"
    //         // testdata[6].yAxis = 2
    //
    //         console.log(testdata);
    //
    //         return testdata;
    //     }
    //
    //     /* Inspired by Lee Byron's test data generator. */
    //     function stream_layers(n, m, o) {
    //         if (arguments.length < 3) o = 0;
    //         function bump(a) {
    //             var x = 1 / (.1 + Math.random()),
    //                 y = 2 * Math.random() - .5,
    //                 z = 10 / (.1 + Math.random());
    //             for (var i = 0; i < m; i++) {
    //                 var w = (i / m - y) * z;
    //                 a[i] += x * Math.exp(-w * w);
    //             }
    //         }
    //         return d3.range(n).map(function() {
    //             var a = [], i;
    //             for (i = 0; i < m; i++) a[i] = o + o * Math.random();
    //             for (i = 0; i < 5; i++) bump(a);
    //             return a.map(stream_index);
    //         });
    //     }
    //
    //     function stream_index(d, i) {
    //         return {x: i, y: Math.max(0, d)};
    //     }
    //
    // $scope.data = [{
    //     key: "Cumulative Return",
    //     values: [
    //         { "label" : "A" , "value" : -29.765957771107 },
    //         { "label" : "B" , "value" : 0 },
    //         { "label" : "C" , "value" : 32.807804682612 },
    //         { "label" : "D" , "value" : 196.45946739256 },
    //         { "label" : "E" , "value" : 0.19434030906893 },
    //         { "label" : "F" , "value" : -98.079782601442 },
    //         { "label" : "G" , "value" : -13.925743130903 },
    //         { "label" : "H" , "value" : -5.1387322875705 }
    //     ]
    // }];

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
