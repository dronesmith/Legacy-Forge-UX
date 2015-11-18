'use strict';

angular
  .module('ForgeApp')
  .factory('Session', function(
    $resource) {

    return $resource('/index/user', {

    }, {
      update: {
        method: 'PUT'
      },
      forgotPassword: {
        method: 'PUT',
        url: '/index/user/forgotPassword'
      }
    })
  })
;
