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
  
  console.log("orig===============");
  console.log(JSON.stringify(flowFile,null,2));

  if(bead.latitude !== undefined && bead.longitude !== undefined) {
    var url = 'https://api.forecast.io/forecast/' +
            forecastEnv.apiKey +
            '/' +
            bead.latitude + ',' + bead.longitude + ',' + bead.localISO 
    request(url,
            function(err, resp, body) {
              if(err) {
                throw err;
              };
              var forecast = JSON.parse(body);
              console.log("forecast===============");
              console.log(JSON.stringify(body,null,2));
              var newBead = _.assign(forecast.currently, bead);
              console.log("newBead===============");
              console.log(JSON.stringify(newBead,null,2));
              process.stdout.write(JSON.stringify(newBead, null, 2));
              process.exit(0);
              });
  } else {
    process.stdout.write(JSON.stringify(bead, null, 2));
    process.exit(0);
  };
});
