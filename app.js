/*jslint node: true, maxerr: 50, maxlen: 79, nomen: true */

'use strict';

var express = require('express'),
    routes = require('./routes'),
    app = module.exports = express.createServer();

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
app.get('/admin', routes.admin);
app.get('/twitter', routes.twitter); // fixme: make post

app.listen(3000, function () {
    console.log("Express server listening on port %d in %s mode",
                app.address().port, app.settings.env);
});
