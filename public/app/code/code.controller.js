angular
  .module('ForgeApp')
  .controller('CodeCtrl', function ($scope, $http, Stream) {

    $scope.output = [];

    $('.aceEditor').css({
      height: window.innerHeight
    });

    Stream.on('sim:output', function(data) {
      $scope.output.push(data);
    });

    $scope.aceLoaded = function(_editor) {
      // Options
      // _editor.setReadOnly(true);

      var session = _editor.session;

      $scope.aceSession = session;

      $http.get('app/code/demo.py').then(function(ev) {
        session.insert({}, ev.data);
      });
    };

    $scope.aceChanged = function(e) {
      //
    };

    $scope.runSim = function() {
      // upload and run on simly
      $scope.output = [];

      $scope.aceSession.getValue();

    };

    window.addEventListener('resize', onWindowResize, false);

    function onWindowResize(e) {
      $('.aceEditor').css({
        height: window.innerHeight
      });
    }
  })
;
