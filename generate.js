#!/usr/bin/env node

var jade = require( 'jade' );
var path = require( 'path' );
var fs = require( 'fs' );
var mkdirp = require( 'mkdirp' );

var globals = require( path.join( __dirname, 'pages', 'globals' ) );

var inputPath = path.join( __dirname, 'pages' );
var outputPath = path.join( __dirname, 'output' );

function copy( obj ) {
  return JSON.parse( JSON.stringify( obj ) );
}

function process( directory ) {
  fs.readFile( path.join( directory, 'options.json' ), 'utf-8', function( err, content ) {
    var options = JSON.parse( content );
    var locals = copy( globals );
    for( var key in options ) {
      locals[ key ] = options[ key ];
    }
    fs.readFile( path.join( directory, 'index.jade' ), 'utf-8', function( err, content ) {
      var relative = path.relative( __dirname, directory );
      var outputDir = path.join( outputPath, relative );
      var outputFile = path.join( outputDir, 'index.html' );
      var html = jade.compile( content, { pretty: true, filename: path.join( directory, 'index.jade' ) } )( locals );
      mkdirp( outputDir, function( err ) {
        fs.writeFile( outputFile, html, 'utf-8' );
      } );
    } );
  } );
}

fs.readdir( inputPath, function( err, files ) {
  files.forEach( function( file ) {
    var file = path.join( inputPath, file );
    fs.stat( file, function( err, stat ) {
      if( stat.isDirectory( ) ) {
        process( file );
      }
    } );
  } );
} );

process( inputPath ) // the index file
