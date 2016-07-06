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
  .factory('Stream', function(socketFactory) {
    var mainConnection = io.connect();
    var connected = true; // connection is true unless session check fails

    var Stream = socketFactory({
      ioSocket: mainConnection
    });

    Stream.on('disconnect', function() {
      connected = false;
    });

    setInterval(function() {
      if (connected == false) {
        console.log("Attempting reconnect...");
        Stream.connect();
        connected = true;
      }
    }, 5000);

    return Stream;
  })
;
