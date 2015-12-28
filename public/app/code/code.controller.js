angular
  .module('ForgeApp')
  .controller('CodeCtrl', function ($scope, $http) {

    $('.aceEditor').css({
      height: window.innerHeight
    });

    $scope.aceLoaded = function(_editor) {
      // Options
      // _editor.setReadOnly(true);

      var session = _editor.session;

      $http.get('app/code/demo.py').then(function(ev) {
        session.insert({}, ev.data);
      });
    };

    $scope.aceChanged = function(e) {
      //
    };

    window.addEventListener('resize', onWindowResize, false);

    function onWindowResize(e) {
      $('.aceEditor').css({
        height: window.innerHeight
      });
    }
  })
;
