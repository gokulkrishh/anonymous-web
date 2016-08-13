'use strict';

var path = require('path');
var copy = require('copy');
var opts = {
  cwd: path.resolve(__dirname, './'),
  flatten: true
};

copy.each(['manifest.json', 'CNAME', 'robots.txt', 'browserconfig.xml'], 'build', opts, function(err, files) {
  if (err) throw err;
  console.log('static assets are copied!');
});

copy('./static/images/**.*', 'build/static/images', opts, function(err, files) {
  if (err) throw err;
  console.log('Images are copied!');
});
