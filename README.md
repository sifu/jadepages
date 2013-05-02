# Jade based Static Site Generator

this is an extremely simple, quick and dirty, static stite generator that lets
[jade](http://jade-lang.com/) do all the heavy lifting, like templating, 
layouts and markdown rendering.

you provide it an input directory like the provided example and an output 
directory.

just put some jade templates in the input directory and provide json files for 
variables that should be passed to the jade templates.

## Should you use it?

probably not. just write your own!

i just wrote it, because it took me longer to figure out how the existing ones 
work, than to build my own that fulfills my very simple requirements.

## TODO

* make the global.json and local.json files optional.
* recursive directory walking (so far only one level is possible).

