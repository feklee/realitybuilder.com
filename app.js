/*jslint node: true, maxerr: 50, maxlen: 79, nomen: true */

'use strict';

var express = require('express'),
    routes = require('./routes'),
    app = module.exports = express.createServer(),
    fs = require('fs'),
    nconf = require('nconf');

nconf.file({file: 'separate/config.json'});


// Configuration

app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('view options', {
        layout: false
    });
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(require('stylus').middleware({src: __dirname + '/public'}));
    app.use(app.router);
    app.use(express['static'](__dirname + '/public'));
    app.use(express['static'](__dirname + '/separate/public'));
    app.use(express.cookieParser());
    app.use(express.session({secret: nconf.get('sessionSecret')}));
});

app.configure('development', function () {
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});


// Routes

app.get('/', routes.index);
app.get('/presentation', routes.presentation);
app.post('/twitter', routes.twitter);
app.get('/admin', routes.admin);

function onListening(app) {
    console.log("Express server listening on port %d in %s mode",
                app.address().port, app.settings.env);
}

app.listen(3000, function () { onListening(app); });
