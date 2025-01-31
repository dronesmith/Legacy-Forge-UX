/**
 * Dronesmith Cloud
 *
 * Principle Engineer: Geoff Gardner <geoff@dronesmith.io>
 *
 * Copyright (C) 2016 Dronesmith Technologies Inc, all rights reserved.
 * Unauthorized copying of any source code or assets within this project, via
 * any medium is strictly prohibited.
 *
 * Proprietary and confidential.
 */

'use strict';

angular
  .module('ForgeApp')
  .factory('Drone', function(
    $resource) {

    return $resource('/index/drone/:id', {
    }, {
      addMission: {
        method: 'PUT',
        url: '/index/drone/addMission'
      },
      update: {
        method: 'PUT'
      }
    });
  })
;
