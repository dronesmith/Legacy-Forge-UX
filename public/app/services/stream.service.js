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
      }
    }, 5000);

    return Stream;
  })
;
