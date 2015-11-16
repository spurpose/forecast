#! /usr/bin/env node

var pkginfo = require('./package.json');
var request = require('request');
var _ = require('lodash');

var flowFile = '';
var forecastEnv = process.env;

process.stdin.setEncoding('utf8');

process.stdin.on('readable', function() {
  var chunk = process.stdin.read();
  if(chunk != null) {
    flowFile = flowFile + chunk;
  };
});

process.stdin.on('end', function() {
  var bead = JSON.parse(flowFile);
  
  if(bead.latitude !== undefined && bead.longitude !== undefined && bead.localISO !== undefined) {
    var time = bead.localISO.split('.')[0];
    var url = 'https://api.forecast.io/forecast/' +
            forecastEnv.apiKey + '/' +
            bead.latitude + ',' +
            bead.longitude + ',' +
            time;
    request(url, function(err, resp, body) {
      if(err) {
        throw err;
      };
      var forecast = JSON.parse(body);
      var newBead = _.assign(forecast.currently, bead);
      console.log(JSON.stringify(newBead, null, 2));
      process.exit(0);
      });
  } else {
    console.log(JSON.stringify(bead, null, 2));
    process.exit(0);
  };
});
