'use strict';

angular
  .module('ForgeApp')
  .controller('MainCtrl', function(
    $scope,
    $state,
    Session,
    Error
  ) {

    // $scope.chartTypes = [
    //   'discreteBarChart',
    //   'lineChart',
    //   'stackedAreaChart',
    //   ''
    // ];

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
            // showValues: true,
            valueFormat: function(d){
                return d3.format(',.4f')(d);
            },
            transitionDuration: 500,
            xAxis: {
                tickFormat: function(d) { return d3.format(',.1f')(d); },
                axisLabel: 'X Axis'
            },
            yAxis1: {
                tickFormat: function(d) { return d3.format(',.1f')(d); },
                axisLabel: 'Y Axis',
                axisLabelDistance: -5
            },
            yAxis2: {
                tickFormat: function(d){ return d3.format(',.1f')(d); },
                axisLabel: 'Y1 Axis'
            }
        }
    };

    $scope.data = generateData();

    function generateData(){
            var testdata = stream_layers(7,10+Math.random()*100,.1).map(function(data, i) {
                return {
                    key: 'Stream' + i,
                    values: data.map(function(a){a.y = a.y * (i <= 1 ? -1 : 1); return a})
                };
            });

            testdata[0].type = "area"
            testdata[0].yAxis = 1
            testdata[1].type = "area"
            testdata[1].yAxis = 1
            testdata[2].type = "line"
            testdata[2].yAxis = 1
            testdata[3].type = "line"
            testdata[3].yAxis = 2
            testdata[4].type = "bar"
            testdata[4].yAxis = 2
            testdata[5].type = "bar"
            testdata[5].yAxis = 2
            testdata[6].type = "bar"
            testdata[6].yAxis = 2

            console.log(testdata);

            return testdata;
        }

        /* Inspired by Lee Byron's test data generator. */
        function stream_layers(n, m, o) {
            if (arguments.length < 3) o = 0;
            function bump(a) {
                var x = 1 / (.1 + Math.random()),
                    y = 2 * Math.random() - .5,
                    z = 10 / (.1 + Math.random());
                for (var i = 0; i < m; i++) {
                    var w = (i / m - y) * z;
                    a[i] += x * Math.exp(-w * w);
                }
            }
            return d3.range(n).map(function() {
                var a = [], i;
                for (i = 0; i < m; i++) a[i] = o + o * Math.random();
                for (i = 0; i < 5; i++) bump(a);
                return a.map(stream_index);
            });
        }

        function stream_index(d, i) {
            return {x: i, y: Math.max(0, d)};
        }
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
