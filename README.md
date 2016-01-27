Who Says What?
==============

Get someone's entire Twitter timeline as a spreadsheet.

Part of a set of Twitter tools, also including [Who Said That?] (https://github.com/maxharlow/who-said-that) and [Who Follows Who?] (https://github.com/maxharlow/who-follows-who).

Requires [Node] (https://nodejs.org/).

Usage
-----

To use the Twitter API, you need credentials, by [creating a new Twitter app] (https://apps.twitter.com/). The credentials are made up of four parts, the 'consumer key', 'consumer secret', 'access token key', and 'access token secret'.

Configuration should be stored in `config.json`. An example of the fields required is given in `config.example.json`.

Install dependencies:

    $ npm install

Run:

    $ node who-says-what

The resulting spreadsheet can be found in `results.csv`.
