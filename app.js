/**
 * app.js for watch1 -- show geo position
 * by Dan Connolly
 */

function main(world) {
  var ui = world.mkCard({
    title:'Where am I?',
  });

  function say(what) {
    ui.body(what);
    ui.show();   
  }

  say('stand by...');
  
  function oops(err) {
    say('location error (' + err.code + '): ' + err.message);
  }

  function hereIAm(pos) {
    var here = '' + pos.coords.latitude + ',' + pos.coords.longitude;
    
    say('Getting ETA from ' + here + ' to ' + world.home);
    
    world.getDirections(
      here, world.home,
      function(results) {
        console.log(results.status);
        if(results.status == 'OK') {
          var theLeg = results.routes[0].legs[0];
          var eta = world.clock();
          eta.setSeconds(eta.getSeconds() + theLeg.duration.value);
          say('ETA: ' + eta.toLocaleTimeString());      
        } else {
          console.log(results.error_message);
          say(results.error_message);
        }
      },
      oops
    );
  }


  var locationOptions = {
    enableHighAccuracy: true, 
    maximumAge: 10000, 
    timeout: 10000
  };

  world.getGPS(hereIAm, oops, locationOptions);
}


function fmtQ(params) {
  // Replace spaces in addresses
  // but leave comma in lat,lon alone.
  var q = '?', sep='';

  for (var k in params) {
    q = q + sep + k + '=' + params[k].replace(/ /g, '+');
    sep = '&';
  }
  return q;
}

function mkGetDirections(ajax, api_key) {
  // https://developers.google.com/maps/documentation/directions/#DirectionsRequests
  var maps_addr = 'https://maps.googleapis.com/maps/api/directions/json';
  
  return function(origin, destination, ok, err) {
    var q = maps_addr + fmtQ({
      origin: origin,
      destination: destination,
      key: api_key
    });

    console.log('q = ' + q);
    ajax({url: q, type:'json'}, ok, err);
  };
}

(function privileged(){
  // http://developer.getpebble.com/getting-started/pebble-js-tutorial/part2/
  var ajax = require('ajax');
  var UI = require('ui');
  var eta_home = 'API_KEY_HERE';

  main({
    home: '...',
    clock: function() { return new Date(); },
    mkCard: function(opts) { return new UI.Card(opts); },
    getGPS: function(ok, err, opts) {
      return navigator.geolocation.getCurrentPosition(ok, err, opts);
    },
    getDirections: mkGetDirections(ajax, eta_home)
  });
})();
