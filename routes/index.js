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
    nconf = require('nconf'),
    twitter;

nconf.file({file: 'secret/twitter.json'});
twitter = new Twitter(nconf.get('twitter'));
twitter.verifyCredentials(function (errorMessage) {
    if (errorMessage) {
        console.log('Verifying Twitter credentials failed: ' + errorMessage);
        process.exit(1);
    }
});

// Home page.
/*jslint unparam:true */
exports.index = function (req, res) {
    /*jslint unparam:false */
    res.render('index', {title: 'Reality Builder',
                         realityBuilderVersion: '1-9-0'});
};

exports.admin = function (req, res) {
    res.redirect('https://' + req.header('Host') + req.url);
};

// Administration interface.
exports.secureAdmin = function (req, res) {
    res.render('admin', {title: 'Reality Builder Administration',
                         realityBuilderVersion: '1-9-0'});
};

// Presentation, as of early 2012 linked from:
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
