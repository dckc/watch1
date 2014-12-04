/**
 * app.js for watch1 -- show geo position
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
  
  function hereIAm(pos) {
    say('lat= ' + pos.coords.latitude + ' lon= ' + pos.coords.longitude);
  }

  function oops(err) {
    say('location error (' + err.code + '): ' + err.message);
  }

  var locationOptions = {
    enableHighAccuracy: true, 
    maximumAge: 10000, 
    timeout: 10000
  };

  world.getPos(hereIAm, oops, locationOptions);
}

(function privileged(){
  var UI = require('ui');

  main({
    mkCard: function(opts) {
      return new UI.Card(opts);
    },
    getPos: function(ok, err, opts) {
      return navigator.geolocation.getCurrentPosition(ok, err, opts);
    }
  });
})();
