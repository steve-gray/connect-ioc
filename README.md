# connect-ioc

[![Build Status](https://travis-ci.org/steve-gray/connect-ioc.svg?branch=master)](https://travis-ci.org/steve-gray/connect-ioc)
[![Prod Dependencies](https://david-dm.org/steve-gray/connect-ioc/status.svg)](https://david-dm.org/steve-gray/connect-ioc)
[![Dev Dependencies](https://david-dm.org/steve-gray/connect-ioc/dev-status.svg)](https://david-dm.org/steve-gray/connect-ioc#info=devDependencies)
[![Coverage Status](https://coveralls.io/repos/github/steve-gray/connect-ioc/badge.svg?branch=master)](https://coveralls.io/github/steve-gray/connect-ioc?branch=master)
[![npm version](https://badge.fury.io/js/connect-ioc.svg)](https://badge.fury.io/js/connect-ioc)

![Stats]( https://nodei.co/npm/connect-ioc.png?downloads=true&downloadRank=true&stars=true)
![Downloads](https://nodei.co/npm-dl/connect-ioc.png?height=2)

IoC middleware functionality for Express/Connect based web applications. Uses the [somersault](https://www.npmjs.com/package/somersault)
project as the container implementation but can use alternate providers that implement the same
contract. 

Targets NodeJS >= 4.x, support for all later versions (including up to 6.x). For
specific versions we test with, please review the .travis.yml file in our repository.

## Installation
To install:

    npm install --save connect-ioc

## Usage 
To add the middleware to your application:

        const ioc = require('connect-ioc');

        // Create instance and register
        const instance = ioc();

        // Register objects for injection
        ioc.rootContainer.register('someService', class|arrowFunc|func|obj-here);

        // App = Your Express/Connect App
        app.use(ioc.middleware);

Within your requests you will now have the following `ioc` object attached to `req`:

    const myRouteHandler = (req, res) => {
      // Handle some request.

      // Able to now dynamically build up classes with a someService constructor
      // argument automatically.
      const anotherWay = req.ioc.build(MyClass);

      // Call other methods here.
      const myObject = req.ioc.resolve('someService');  // Make me a some-service

      // Can also register dependencies per-request
      req.ioc.register('someService', overrideObjectHere);
    });

Each request has it's own independent IoC child context, meaning that when you modify or
add registrations, _it only affects that specific request_: each request is independent
in this regard.

The following registrations are done automatically on your behalf:

  - __req, request__ - The current Connect/Express request.
  - __res, response__ - The current Connect/Express response.

For further information on how to register components for dependency injection or perform 
run-time build-up of objects, please refer to the [documentation for somersault](https://www.npmjs.com/package/somersault)
which covers this in more detail.

## Automatic Registrations
It is possible to pass an autoRegister parameter via the options object on the middleware
constructor, allowing automatic registration of modules in a path with the IoC solution:

        const ioc = require('connect-ioc');
        const instance = ioc({
            autoRegister: { pattern: './services/**/*.js', rootDirectory: __dirname },
        });

This will effectively iterate through all *.js files in the services directory relative
to the currently executing script, calling:

    rootContainer.register('friendlyName', require('./services/folder/file'))

Where friendlyname is determined as:

    - filename.split('-').map(x => upperFirst(x)).join()
        - some-file-name.js --> someFileName
        - someFileName --> someFileName
        - AlreadyCaps -> alreadyCaps
        - aWONTCHANGE -> aWONTCHANGE

If you want to customise the alias to register your object as, then modify
module.exports and have an additional .tags property, i.e:

    module.exports.tags = ['serviceAliasHere'];

## Configuration Detail
The middleware has a constructor take takes the following arguments:

    {
        // Provide your own base container for all requests. If not, creates
        // an empty root container.
        rootContainer,

        // Automatic registration of IoC services at at root/app level.
        autoRegister: {
            // Files to find, uses `glob`
            pattern: './service-objects/**/*.js',
            
            // Root directory
            rootDirectory: __dirname
        }
    }

## Debugging
To debug (OS X / Linux):

    export DEBUG=connect-ioc

Or on Windows;

    set DEBUG=connect-ioc

This will show debug information about what your application is doing and why.
