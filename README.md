Introduction
============

This directory contains the code for the site hosted on: RealityBuilder.com

See also the [repository on GitHub][1].


Directory `separate`
====================

The directory `separate` is for components that should not be redistributed as
part of the RealityBuilder.com code, for example due to license issues or due
to size.


Directory `secret`
==================

The directory `secret` is for components that should not be redistributed as
part of the RealityBuilder.com code, and that should not be accessible from the
web.


Admin interface
===============

The date-time in the admin controls is shown in the time zone of the
system/browser.


Still images
============

Still images are not part of the code, due to their size. Download them from
the RealityBuilder.com code hosting site, and extract them to:

    /separate/still_images


Twitter OAuth secret
====================

The consumer secret for Twitter OAuth should be stored in:

    /secret/twitter.yaml

Example content:

    consumer_key: "123"
    consumer_secret: "abc"
    oauth_token: "987"
    oauth_token_secret: "xyz"


Internet Explorer support
=========================

To make the site work with Internet Explorer versions less than 9, FlashCanvas
Pro is required. For reasons of license, this library is not included in the
source code distribution. If desired, install it as follows:

 1. Download [FlashCanvas Pro 1.5 or compatible][2].

 2. Place FlashCanvas Pro into:

        /separate/FlashCanvasPro

    The directory "separate" is components that should not be redistributed as
    part of the Reality Builder source code.


Legal
=====

Copyright 2011-2012 Felix E. Klee [Felix E. Klee][3]

Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at

<http://www.apache.org/licenses/LICENSE-2.0>

Unless required by applicable law or agreed to in writing, software distributed
under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.


[1]: https://github.com/feklee/realitybuilder.com
[2]: http://flashcanvas.net/
[3]: mailto:felix.klee@inka.de
