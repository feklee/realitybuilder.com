/*jslint node: true, maxerr: 50, maxlen: 79, nomen: true */

'use strict';

var express = require('express'),
    routes = require('./routes'),
    app = module.exports = express.createServer(),
    fs = require('fs'),
    secureApp = express.createServer({
        key: fs.readFileSync('separate/key.pem'),
        cert: fs.readFileSync('separate/cert.pem')
    }),
    nconf = require('nconf'),
    adminConfig;

nconf.file({file: 'separate/config.json'});


// Configuration

function configureApp(app) {
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
}

app.configure(function () { configureApp(app); });
secureApp.configure(function () { configureApp(secureApp); });

function configureDevelopmentApp(app) {
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
}

app.configure('development', function () { configureDevelopmentApp(app); });
secureApp.configure('development', function () {
    configureDevelopmentApp(secureApp);
});

function configureProductionApp(app) {
    app.use(express.errorHandler());
}

app.configure('production', function () { configureProductionApp(app); });
secureApp.configure('production', function () {
    configureProductionApp(secureApp);
});


// Routes

app.get('/', routes.index);
app.get('/presentation', routes.presentation);
app.get('/admin', routes.admin);
app.post('/twitter', routes.twitter);

adminConfig = nconf.get('admin');
secureApp.get('/admin', express.basicAuth(adminConfig.username,
                                          adminConfig.password),
              routes.secureAdmin);

function onListening(app) {
    console.log("Express server listening on port %d in %s mode",
                app.address().port, app.settings.env);
}

app.listen(8080, function () { onListening(app); });
secureApp.listen(8443, function () { onListening(secureApp); });
