'use strict';

angular
  .module('ForgeApp')
  .controller('UploaderCtrl', function ($scope, uiUploader, Error) {

    var FileUploadElem = '#uploader form input[type=file]';

    $scope.uploadStatus = "";
    $scope.uploaded = false;
    $scope.files = [];
    $scope.progressBar = 0;

    // NOTE since ng-change doesn't work for file inputs, we're grabbing the
    // the element here.
    $(FileUploadElem)
      .on('change', function(e) {
        var files = e.target.files;
        uiUploader.addFiles(files);
        $scope.files = uiUploader.getFiles();
        $scope.$apply();
      })
    ;

    $scope.upload = function() {
        uiUploader.startUpload({
          url: '/index/mission',
          concurrency: 2,
          onProgress: function(file) {
            console.log(file);
            $scope.progressBar = (file.loaded / file.size) * 100;
            console.log($scope.progressBar);
            $scope.$apply();
          },
          onCompleted: function(file, response) {
            console.log(file);
            console.log(response);
            $scope.progressBar = 100;
            if (!response) {
              Error({
                "status": "UPLOADER",
                "statusText": "Got no response from the server",
                in: "directive::uploader::controller::$scope.upload::onCompleted"});
              $scope.uploadStatus = "error";
            } else {
              $scope.uploadStatus = "success";
            }
          },
          onCompletedAll: function(files) {
            $scope.uploaded = true;
          },
          onError: function(error) {
            Error(error);
            $scope.uploadStatus = "error";
          }
        });
    };

    $scope.clear = function() {
      uiUploader.removeAll();
      $(FileUploadElem)
        .replaceWith($(FileUploadElem).val('').clone(true));
      $scope.uploadStatus = "";
      $scope.uploaded = false;
      $scope.progressBar = 0;
    };

  })
;
