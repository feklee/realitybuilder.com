# Initializes the datastore with sample data.
#
# Possibilities to execute the code in this file:
#
# * GAE SDK 1.5 or compatible: Paste the code in the interactive console and
#   execute it.
# 
# * GAE (production):
# 
#   a) Enter the directory of the Reality Builder widget.
#
#   b) Connect to the remote API shell of the Reality Builder widget.
# 
#     On Windows XP's "cmd.exe" (substitute %-placeholders):
#
#       %PYTHON_PATH%\python.exe %GAE_PATH%\remote_api_shell.py -s ^
#       %VERSION%.%APPLICATION%.appspot.com
#
#     Note that, despite specifying a version above, the same datastore as for
#     all other versions is used: There is only one.
#
#   c) Paste the code. It will execute automatically.

# Copyright 2011 Felix E. Klee <felix.klee@inka.de>
#
# Licensed under the Apache License, Version 2.0 (the "License"); you may not
# use this file except in compliance with the License. You may obtain a copy of
# the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
# WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
# License for the specific language governing permissions and limitations under
# the License.

import os.path
import sys
sys.path.append(os.path.realpath('.'))

from google.appengine.dist import use_library
use_library('django', '0.96')

from main import Construction
from main import Block
from main import BlockProperties
from main import NewBlock
from main import PendingBlockEmail
from main import PrerenderMode
from django.utils import simplejson

from google.appengine.api import namespace_manager

if 'CURRENT_VERSION_ID' in os.environ:
    # Works in the SDK's interactive console.
    app_version = os.environ['CURRENT_VERSION_ID'].split('.')[0]
else:
    # Takes the version from the command line:
    parser = optparse.OptionParser()
    parser.add_option('-s', '--server', dest='server')
    (options, args) = parser.parse_args()
    app_version = options.server.split('.')[0]

namespace_manager.set_namespace(app_version + '_reality_builder_com')

# Deletes all construction entries:
queries = [Construction.all()]
for query in queries:
    for result in query:
        result.delete()

# Creates the construction configuration.
construction = Construction(key_name = 'main')
construction.update_interval_client = 2000
construction.blocks_data_version = '0'
construction.camera_data_version = '0'
construction.camera_pos = [-383.27, -371.82, 587.55]
construction.camera_a_x = 2.3884
construction.camera_a_y = 0.61438
construction.camera_a_z = -0.56
construction.camera_fl = 44.
construction.camera_sensor_resolution = 29.6
construction.put()

# Deletes all prerender-mode entries:
queries = [PrerenderMode.all()]
for query in queries:
    for result in query:
        result.delete()

# Sets up the prerender-mode:
prerenderMode = PrerenderMode(parent=construction)
prerenderMode.data_version = '0'
prerenderMode.is_enabled = True
prerenderMode.make_real_after = 0
prerenderMode.block_configurations = \
    [
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[2,0,1,1]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[2,0,1,1],[0,1,1,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[2,0,1,1],[0,1,1,0],[0,0,2,1]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[2,0,1,1],[0,1,1,0],[0,0,2,1],[1,0,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[2,0,1,1],[0,1,1,0],[0,0,2,1],[1,0,2,0],[1,1,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[2,0,1,1],[0,1,1,0],[0,0,2,1],[1,0,2,1]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[2,0,1,1],[0,1,1,0],[0,0,2,1],[1,1,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[2,0,1,1],[0,1,1,0],[1,0,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[2,0,1,1],[0,1,1,0],[1,0,2,0],[1,1,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[2,0,1,1],[0,1,1,0],[1,0,2,1]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[2,0,1,1],[0,1,1,0],[1,1,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[2,0,1,1],[0,1,1,1]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[2,0,1,1],[0,1,1,1],[1,1,1,1]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[2,0,1,1],[0,1,1,1],[1,1,1,1],[0,0,2,1]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[2,0,1,1],[0,1,1,1],[1,1,1,1],[0,0,2,1],[1,0,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[2,0,1,1],[0,1,1,1],[1,1,1,1],[0,0,2,1],[1,0,2,0],[1,1,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[2,0,1,1],[0,1,1,1],[1,1,1,1],[0,0,2,1],[1,0,2,0],[1,1,2,0],[0,2,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[2,0,1,1],[0,1,1,1],[1,1,1,1],[0,0,2,1],[1,0,2,0],[0,2,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[2,0,1,1],[0,1,1,1],[1,1,1,1],[0,0,2,1],[1,0,2,1]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[2,0,1,1],[0,1,1,1],[1,1,1,1],[0,0,2,1],[1,0,2,1],[0,2,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[2,0,1,1],[0,1,1,1],[1,1,1,1],[0,0,2,1],[1,1,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[2,0,1,1],[0,1,1,1],[1,1,1,1],[0,0,2,1],[1,1,2,0],[0,2,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[2,0,1,1],[0,1,1,1],[1,1,1,1],[0,0,2,1],[0,2,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[2,0,1,1],[0,1,1,1],[1,1,1,1],[1,0,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[2,0,1,1],[0,1,1,1],[1,1,1,1],[1,0,2,0],[0,1,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[2,0,1,1],[0,1,1,1],[1,1,1,1],[1,0,2,0],[0,1,2,0],[0,2,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[2,0,1,1],[0,1,1,1],[1,1,1,1],[1,0,2,0],[1,1,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[2,0,1,1],[0,1,1,1],[1,1,1,1],[1,0,2,0],[1,1,2,0],[0,2,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[2,0,1,1],[0,1,1,1],[1,1,1,1],[1,0,2,0],[0,2,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[2,0,1,1],[0,1,1,1],[1,1,1,1],[1,0,2,1]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[2,0,1,1],[0,1,1,1],[1,1,1,1],[1,0,2,1],[0,2,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[2,0,1,1],[0,1,1,1],[1,1,1,1],[0,1,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[2,0,1,1],[0,1,1,1],[1,1,1,1],[0,1,2,0],[0,2,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[2,0,1,1],[0,1,1,1],[1,1,1,1],[1,1,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[2,0,1,1],[0,1,1,1],[1,1,1,1],[1,1,2,0],[0,2,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[2,0,1,1],[0,1,1,1],[1,1,1,1],[0,2,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[2,0,1,1],[0,1,1,1],[0,0,2,1]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[2,0,1,1],[0,1,1,1],[0,0,2,1],[1,0,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[2,0,1,1],[0,1,1,1],[1,0,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[2,0,1,1],[1,1,1,1]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[2,0,1,1],[1,1,1,1],[1,0,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[2,0,1,1],[1,1,1,1],[1,0,2,0],[1,1,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[2,0,1,1],[1,1,1,1],[1,0,2,1]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[2,0,1,1],[1,1,1,1],[1,1,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[2,0,1,1],[1,0,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[0,1,1,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[0,1,1,0],[0,0,2,1]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[0,1,1,0],[0,0,2,1],[1,0,2,1]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[0,1,1,0],[1,0,2,1]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[0,1,1,1]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[0,1,1,1],[1,1,1,1]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[0,1,1,1],[1,1,1,1],[0,0,2,1]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[0,1,1,1],[1,1,1,1],[0,0,2,1],[1,0,2,1]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[0,1,1,1],[1,1,1,1],[0,0,2,1],[1,0,2,1],[0,2,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[0,1,1,1],[1,1,1,1],[0,0,2,1],[0,2,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[0,1,1,1],[1,1,1,1],[1,0,2,1]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[0,1,1,1],[1,1,1,1],[1,0,2,1],[0,2,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[0,1,1,1],[1,1,1,1],[0,1,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[0,1,1,1],[1,1,1,1],[0,1,2,0],[0,2,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[0,1,1,1],[1,1,1,1],[0,2,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[0,1,1,1],[0,0,2,1]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[1,1,1,1]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0],[1,1,1,1],[1,0,2,1]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[1,0,1,1]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[1,0,1,1],[2,0,1,1]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[1,0,1,1],[2,0,1,1],[0,1,1,1]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[1,0,1,1],[2,0,1,1],[0,1,1,1],[1,0,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[1,0,1,1],[2,0,1,1],[0,1,1,1],[1,0,2,0],[0,1,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[1,0,1,1],[2,0,1,1],[0,1,1,1],[1,0,2,0],[1,1,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[1,0,1,1],[2,0,1,1],[0,1,1,1],[0,1,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[1,0,1,1],[2,0,1,1],[0,1,1,1],[1,1,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[1,0,1,1],[2,0,1,1],[1,0,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[1,0,1,1],[2,0,1,1],[1,0,2,0],[1,1,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[1,0,1,1],[2,0,1,1],[1,1,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[1,0,1,1],[0,1,1,1]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[1,0,1,1],[0,1,1,1],[0,1,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[2,0,1,1]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[2,0,1,1],[0,1,1,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[2,0,1,1],[0,1,1,0],[1,1,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[2,0,1,1],[0,1,1,1]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[2,0,1,1],[0,1,1,1],[1,1,1,1]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[2,0,1,1],[0,1,1,1],[1,1,1,1],[0,1,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[2,0,1,1],[0,1,1,1],[1,1,1,1],[0,1,2,0],[0,2,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[2,0,1,1],[0,1,1,1],[1,1,1,1],[1,1,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[2,0,1,1],[0,1,1,1],[1,1,1,1],[1,1,2,0],[0,2,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[2,0,1,1],[0,1,1,1],[1,1,1,1],[0,2,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[2,0,1,1],[1,1,1,1]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[2,0,1,1],[1,1,1,1],[1,1,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,1,1,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,1,1,1]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,1,1,1],[1,1,1,1]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,1,1,1],[1,1,1,1],[0,1,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,1,1,1],[1,1,1,1],[0,1,2,0],[0,2,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,1,1,1],[1,1,1,1],[0,2,2,0]]',
    '[[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[1,1,1,1]]']
prerenderMode.i = 0
prerenderMode.reset_delay = 60000 # ms
prerenderMode.put()

# Deletes all block properties entries:
queries = [BlockProperties.all()]
for query in queries:
    for result in query:
        result.delete()

# Sets up the block properties (construction as parent is important so
# that the properties form one entity group with the construction,
# which is necessary when doing transactions):
blockProperties = BlockProperties(parent=construction)
blockProperties.data_version = '0'
blockProperties.has_2_fold_symmetry = True
blockProperties.pos_spacing_xy = 99.
blockProperties.pos_spacing_z = 60.
blockProperties.outline_bxy = '[[0, 0], [2, 0], [2, 1], [0, 1]]'
blockProperties.collision_offsets_list_bxy = \
    ['[[-1, 0], [0, 0], [1, 0]]',
     '[[0, 0], [1, 0], [0, -1], [1, -1]]']
blockProperties.attachment_offsets_list_b = \
    ['[[-1, 0, -1], [-1, 0, 1], ' + 
     '[0, 0, -1], [0, 0, 1], ' + 
     '[1, 0, -1], [1, 0, 1]]',
     '[[0, 0, -1], [0, 0, 1], ' + 
     '[1, 0, -1], [1, 0, 1], ' + 
     '[0, -1, -1], [0, -1, 1], ' +
     '[1, -1, -1], [1, -1, 1]]']
blockProperties.rot_center_bxy = [0.5, 0.5]
blockProperties.background_alpha = 0.2
blockProperties.put()

# Deletes all new block entries:
queries = [NewBlock.all()]
for query in queries:
    for result in query:
        result.delete()

# Sets up the new block:
newBlock = NewBlock(parent=construction)
newBlock.data_version = '0'
newBlock.init_pos_b = [0, 0, 3]
newBlock.init_a = 0
newBlock.move_space_1_b = [-1, -1, 0]
newBlock.move_space_2_b = [3, 3, 3]
newBlock.build_space_1_b = [0, 0, 0]
newBlock.build_space_2_b = [2, 2, 3]
newBlock.put()

# Deletes all block entries:
queries = [Block.all()]
for query in queries:
    for result in query:
        result.delete()

# Creates block entries:
cs = simplejson.loads(prerenderMode.block_configurations[0])
for c in cs:
    x_b = c[0]
    y_b = c[1]
    z_b = c[2]
    a = c[3]
    block = Block.insert_at(construction, [x_b, y_b, z_b], a)
    block.state = 2
    block.put()

# Deletes all pending block email entries:
queries = [PendingBlockEmail.all()]
for query in queries:
    for result in query:
        result.delete()

# Creates pending block email entries:
# 
# From the Google App Engine documentation:
#
#   For security purposes, the sender address of a message must be the email
#   address of an administrator for the application, the Google Account email
#   address of the current user who is signed in, or any valid email receiving
#   address for the app (see Receiving Mail). The message can also include a
#   "reply to" address, which must also meet these restrictions.
#
#   <http://code.google.com/appengine/docs/python/mail/overview.html>
#
# What doesn't seem to work as senders: group addresses, nicknames
pendingBlockEmail = PendingBlockEmail(parent=construction)
pendingBlockEmail.sender_address = 'Reality Builder <felix@realitybuilder.com>'
pendingBlockEmail.recipient_address = \
    'New Pending Blocks <new.pending.blocks@realitybuilder.com>'
pendingBlockEmail.put()

print 'Done.'
