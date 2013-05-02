#!/usr/bin/env node

var jade = require( 'jade' );
var path = require( 'path' );
var fs = require( 'fs' );
var mkdirp = require( 'mkdirp' );
var argv = require( 'optimist' )
  .usage( 'Usage: $0 -i -o' )
  .demand( [ 'i', 'o' ] ).argv;

var pj = path.join;

var inputPath = argv.i;
var outputPath = argv.o;

if( fs.existsSync( pj( inputPath, 'globals.json' ) ) ) {
  var globals = JSON.parse( fs.readFileSync( pj( inputPath, 'globals.json' ), 'utf-8' ) );
} else {
  var globals = {};
}

function copy( obj ) {
  return JSON.parse( JSON.stringify( obj ) );
}

function process( directory ) {
  fs.readFile( pj( directory, 'options.json' ), 'utf-8', function( err, content ) {
    var options = JSON.parse( content );
    var locals = copy( globals );
    for( var key in options ) {
      locals[ key ] = options[ key ];
    }
    fs.readFile( pj( directory, 'index.jade' ), 'utf-8', function( err, content ) {
      var relative = path.relative( inputPath, directory );
      var outputDir = pj( outputPath, relative );
      var outputFile = pj( outputDir, 'index.html' );
      var html = jade.compile( content, { pretty: true, filename: pj( directory, 'index.jade' ) } )( locals );
      mkdirp( outputDir, function( err ) {
        fs.writeFile( outputFile, html, 'utf-8' );
      } );
    } );
  } );
}

fs.readdir( inputPath, function( err, files ) {
  files.forEach( function( file ) {
    var file = pj( inputPath, file );
    fs.stat( file, function( err, stat ) {
      if( stat.isDirectory( ) ) {
        process( file );
      }
    } );
  } );
} );

process( inputPath ) // the index file
