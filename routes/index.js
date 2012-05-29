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

// Home page.
/*jslint unparam:true */
exports.index = function (req, res) {
    /*jslint unparam:false */
    res.render('index', {title: 'Reality Builder',
                         realityBuilderVersion: '1-9-0'});
};

// Administration interface.
exports.admin = function (req, res) {
    res.render('admin', {title: 'Reality Builder',
                         realityBuilderVersion: '1-9-0'});
};

// Twitters a tweet via Twitter.
/*jslint unparam:true */
exports.twitter = function (req, res) {
    var twitter = require('ntwitter');
    /*jslint unparam:false */
    console.log('twitter'); // fixme
/*fixme    res.render('index', {title: 'Reality Builder',
                         realityBuilderVersion: '1-9-0'});*/
};
