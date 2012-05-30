Introduction
============

This directory is planned to contain code for the next version of the site
hosted on: RealityBuilder.com

The code of the current version is hosted on [Google Code][1].

See also the [repository on GitHub][2].


Directory separate
==================

The directory `separate` is for static components that should not be
redistributed as part of the RealityBuilder.com code, for example due to
licensing issues or due to size.


Directory secret
================

The directory `secret` is for components, such as passwords for web services,
that should not be redistributed as part of the RealityBuilder.com code.


Admin interface
===============

The date-time in the admin controls is shown in the time zone of the
system/browser.


Still images
============

Still images are not part of the code, due to their size. Download them from
the RealityBuilder.com code hosting site, and extract them to:

    /separate/public/still_images


Twitter OAuth secret
====================

The consumer secret for Twitter OAuth should be stored in:

    /secret/twitter.json

Example content:

    {
        "twitter": {
            "consumer_key": "123",
            "consumer_secret": "abc",
            "access_token_key": "987",
            "access_token_secret": "xyz"
        }
    }


Internet Explorer support
=========================

To make the site work with Internet Explorer versions less than 9, FlashCanvas
Pro is required. For reasons of license, this library is not included in the
source code distribution. If desired, install it as follows:

 1. Download [FlashCanvas Pro 1.5 or compatible][3].

 2. Place FlashCanvas Pro into:

        /separate/public/FlashCanvasPro


Legal
=====

Copyright 2011-2012 Felix E. Klee [Felix E. Klee][4]

Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at

<http://www.apache.org/licenses/LICENSE-2.0>

Unless required by applicable law or agreed to in writing, software distributed
under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.


[1]: http://code.google.com/p/realitybuildercom
[2]: https://github.com/feklee/realitybuilder.com
[3]: http://flashcanvas.net/
[4]: mailto:felix.klee@inka.de
