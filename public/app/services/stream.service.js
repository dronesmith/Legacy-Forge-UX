'use strict';

angular
  .module('ForgeApp')
  .factory('Stream', function(
    socketFactory) {

    return socketFactory();
  })
;
