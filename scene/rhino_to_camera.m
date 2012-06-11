## An Octave script for calculating camera (35 mm) orientation (rotation about
## x- and y-axes) from settings retrieved with Rhino 3D 3.0, where the live
## image was matched to the construction. The rotation about the z-axis is not
## calculated. It can be figured out easily by trial and error.

## Copyright 2010, 2011 Felix E. Klee <felix.klee@inka.de>
##
## Licensed under the Apache License, Version 2.0 (the "License"); you may not
## use this file except in compliance with the License. You may obtain a copy
## of the License at
##
##   http://www.apache.org/licenses/LICENSE-2.0
##
## Unless required by applicable law or agreed to in writing, software
## distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
## WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
## License for the specific language governing permissions and limitations
## under the License.


## VALUES FROM RHINO 3D

## All in mm

position = [-383.27,-371.82,587.55]
target = [117.08,113.31,70.16]


## INITIAL CALCULATIONS

## Direction of view, as a unit vector in world space.
tmp = target - position
direction = tmp / norm(tmp)


## X-ANGLE

## What needs to be calculated is the angle between the z-axis and the plane in
## which the circle lies which on which the head of the direction vector lies
## anywhere it is rotated about the view space y axis. This plane is parallel
## to the world space x-axis. The calculation is be accomplished in two steps.

## Step 1. Gets the projection of the direction vector onto the y-z-plane.

tmp = direction([2;3])
direction_yz = tmp / norm(tmp)

## Step 2. Gets the angle between the projected vector and the z-axis.

a_x = acos(dot(direction_yz, [0, 1]))


## Y-ANGLE

## The calculation is accomplished in four steps.

## Step 1. If the x-angle is 0 or pi, then the y-angle is 0 (due to the way the
## camera is oriented in Rhino). No further steps are needed.

## Step 2. Calculates the direction vector, rotated back about x.

M_rot = [1, 0, 0; 0, cos(a_x), -sin(a_x); 0, sin(a_x), cos(a_x)]
direction_rot = (M_rot * direction')'

## Step 3. Gets the projection of the rotated direction vector onto the
## z-x-plane.

direction_rot_zx = direction_rot([3;1])

## Step 4. Gets the angle between the projected vector and the z-axix, and
## - depending on the situation - take its negative value.

a_y = acos(dot(direction_rot_zx, [1, 0]))


## The following settings are interpreted by EMACS, do not remove them.
## Local Variables:
## mode: octave
## fill-column: 79
## coding: utf-8
## End:
