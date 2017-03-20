// -*- coding: utf-8 -*-

// Copyright 2010-2012 Felix E. Klee <felix.klee@inka.de>
//
// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy of
// the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations under
// the License.

/*jslint node: true, maxerr: 50, maxlen: 79, nomen: true */

'use strict';

var Twitter = require('ntwitter'),
    config = require('../separate/config.json'),
    twitter,
    realityBuilderVersion = '1-10-0',
    adminPassword;

twitter = new Twitter(config.twitter);
twitter.verifyCredentials(function (errorMessage) {
    if (errorMessage) {
        console.log('Verifying Twitter credentials failed: ' + errorMessage);
        process.exit(1);
    }
});

adminPassword = config.adminPassword;

// Home page.
/*jslint unparam:true */
exports.index = function (req, res) {
    /*jslint unparam:false */
    res.render('index', {
        title: 'Reality Builder',
        realityBuilderVersion: realityBuilderVersion,
        stillImagesBaseUrl: config.stillImagesBaseUrl
    });
};

// Returns true, iff the process runs in a production enviroment and the
// request was via HTTP.
function httpReqInProductionEnv(req) {
    return (typeof process.env.NODE_ENV !== 'undefined' &&
            process.env.NODE_ENV === 'production' &&
            req.headers.hasOwnProperty('x-forwarded-proto') &&
            req.headers['x-forwarded-proto'] === 'http');
}

function userIsAdmin(req) {
    return (typeof req.session.userIsAdmin !== 'undefined' &&
            req.session.userIsAdmin);
}

function logOutRequested(req) {
    return typeof req.query.log_out !== 'undefined';
}

function logOutUser(req) {
    delete req.session.userIsAdmin;
}

// Redirects to the same page but behind SSL.
function redirectToHttps(req, res) {
    res.redirect('https://' + req.header('Host') + req.url);
}

// Administration interface.
exports.admin = function (req, res) {
    if (httpReqInProductionEnv(req)) {
        redirectToHttps(req, res); // force HTTPS in production
    } else if (logOutRequested(req)) {
        logOutUser(req);
        res.redirect(req.route.path);
    } else if (!userIsAdmin(req)) {
        res.render('admin_password_prompt', {
            wrongPassword: typeof req.query.wrong_password !== 'undefined'
        });
    } else {
        res.render('admin', {
            title: 'Reality Builder Administration',
            realityBuilderVersion: realityBuilderVersion,
            stillImagesBaseUrl: config.stillImagesBaseUrl
        });
    }
};

exports.verifyAdminPassword = function (req, res) {
    if (req.body.password && req.body.password === adminPassword) {
        req.session.userIsAdmin = true;
        res.redirect(req.route.path);
    } else {
        res.redirect(req.route.path + '?wrong_password');
    }
};

// Linked to from (as of early 2012):
//
//   <url:http://prezi.com/3rglon2gvazu/reality-builder/?auth_key=772126086aa01
//   bb98733b87b6295b6baac03ca72>
exports.presentation = function (req, res) {
    res.render('presentation');
};

// Twitters a tweet via Twitter.
/*jslint unparam:true */
exports.twitter = function (req, res) {
    /*jslint unparam:false */

    twitter.updateStatus(
        req.body.status,
        function (errorMessage) {
            if (errorMessage) {
                console.log('Tweeting failed: ' + errorMessage);
            }
        }
    );

    res.end();
};
