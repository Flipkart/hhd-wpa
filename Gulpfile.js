'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var express = require('express');
var fs = require('fs');
var packageJson = require('./package.json');
var path = require('path');
var swPrecache = require('sw-precache');

function generateServiceWorkerFileContents(rootDir, handleFetch, callback) {
  var config = {
    cacheId: packageJson.name,
    logger: console.log,
    staticFileGlobs: [
      rootDir + '/Scripts/**.js',
      rootDir + '/Scripts/**.css',
      rootDir + '/view1/view1.js',
      rootDir + '/view1/view1.html',
      rootDir + '/view2/view2.js',
      rootDir + '/view2/view2.html',
      rootDir + '/components/version/**.js',
      rootDir + '/app.js',
      rootDir + '/manifest.json',
      rootDir + '/app.css',
      rootDir + '/index.html',
      rootDir + '/service-worker.js',
      '/tote/*'
    ],
    stripPrefix: path.join(rootDir, path.sep)
  };

  swPrecache(config, callback);
}

gulp.task('build', function(callback) {
  generateServiceWorkerFileContents('./app', false, function(error, serviceWorkerFileContents) {
    if (error) {
      return callback(error);
    }
    //console.log(serviceWorkerFileContents)
    fs.writeFile(path.join('./app/my-sw.js'), serviceWorkerFileContents, callback);
  });
});
