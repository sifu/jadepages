#!/usr/bin/env node

var jade = require( 'jade' );
var path = require( 'path' );
var fs = require( 'fs' );
var mkdirp = require( 'mkdirp' );
var argv = require( 'optimist' )
  .usage( 'Usage: $0 -i -o' )
  .demand( [ 'i', 'o' ] ).argv;

var globals = require( path.join( __dirname, 'pages', 'globals' ) );

var inputPath = argv.i;
var outputPath = argv.o;

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
      var relative = path.relative( inputPath, directory );
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
