// For the admin page.

// Copyright 2010, 2011 Felix E. Klee <felix.klee@inka.de>
//
// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

/*jslint white: true, onevar: true, undef: true, newcap: true, nomen: true,
  regexp: true, plusplus: true, bitwise: true, browser: true, nomen: false */

/*global realityBuilderCom, realityBuilder, $, alert */

realityBuilderCom.admin = (function () {
    var publicInterface;

    function updateBlocksVisibilityButton(type, text, blocksAreVisible, 
                                          setVisibility)
    {
        var node = $('#' + type + 'BlocksVisibilityButton');

        node.
            text((blocksAreVisible ? "Hide" : "Show") + " " + text + 
                 " Blocks").
            unbind('click'). // necessary if this code is run several times
            click(function () { 
                node.unbind('click');
                setVisibility(!blocksAreVisible); 
            });
    }

    function updateRealBlocksVisibilityButton() {
        var setVisibility, blocksAreVisible;

        setVisibility = $.proxy(realityBuilder.setRealBlocksVisibility,
                                realityBuilder);
        blocksAreVisible = realityBuilder.realBlocksAreVisible();
        updateBlocksVisibilityButton('real', 'Real', 
                                     blocksAreVisible, setVisibility);
    }

    function updatePendingBlocksVisibilityButton() {
        var setVisibility, blocksAreVisible;

        setVisibility = $.proxy(realityBuilder.setPendingBlocksVisibility,
                                realityBuilder);
        blocksAreVisible = realityBuilder.pendingBlocksAreVisible();
        updateBlocksVisibilityButton('pending', 'Pending', 
                                     blocksAreVisible, setVisibility);
    }

    // Returns data read entered using the camera controls.
    function cameraDataFromControls() {
        return {
            "pos": [parseFloat($('#cameraXTextField').val()) || 0,
                         parseFloat($('#cameraYTextField').val()) || 0,
                         parseFloat($('#cameraZTextField').val()) || 0],
            "aX": parseFloat($('#cameraAXTextField').val()) || 0,
            "aY": parseFloat($('#cameraAYTextField').val()) || 0,
            "aZ": parseFloat($('#cameraAZTextField').val()) || 0,
            "fl": parseFloat($('#cameraFlTextField').val()) || 1,
            "sensorResolution": 
            parseFloat($('#cameraSensorResolutionTextField').val())
                || 100};
    }

    function setUpSaveSettingsButton() {
        $('#saveSettingsButton').click(function () {
            var cameraData = cameraDataFromControls();

            realityBuilder.storeSettingsOnServer({cameraData: cameraData});
            realityBuilder.camera().update(cameraData);
        });
    }

    // Updates the camera, reading data from the camera controls.
    function updateCamera() {
        realityBuilder.camera().update(cameraDataFromControls());
    }

    function setUpPreviewCameraButton() {
        $('#previewCameraButton').click(updateCamera);
    }

    // Updates controls defining the camera "camera".
    function updateCameraControls() {
        var camera, pos;

        camera = realityBuilder.camera();
        pos = camera.pos();
        $('#cameraXTextField').val(pos[0]);
        $('#cameraYTextField').val(pos[1]);
        $('#cameraZTextField').val(pos[2]);
        $('#cameraAXTextField').val(camera.aX());
        $('#cameraAYTextField').val(camera.aY());
        $('#cameraAZTextField').val(camera.aZ());
        $('#cameraFlTextField').val(camera.fl());
        $('#cameraSensorResolutionTextField').val(camera.sensorResolution());
    }

    function updatePrerenderModeControls() {
        var prerenderMode = realityBuilder.prerenderMode();
        if (prerenderMode.isEnabled()) {
            $('#prerenderedBlockConfigurationTextField').
                val(prerenderMode.i());
            $('#prerenderedBlockConfigurations').show();
        } else {
            $('#prerenderedBlockConfigurations').hide();
        }
    }

    function setUpPrerenderModeButtons() {
        var prerenderMode = realityBuilder.prerenderMode();

        $('#setPrerenderedBlockConfigurationButton').click(function () {
            var i = 
                parseInt($('#prerenderedBlockConfigurationTextField').val(),
                         10);
            prerenderMode.loadBlockConfigurationOnServer(i);
        }); 
        $('#prevPrerenderedBlockConfigurationButton').click(function () {
            prerenderMode.loadPrevBlockConfigurationOnServer();
            updatePrerenderModeControls();
        });
        $('#nextPrerenderedBlockConfigurationButton').click(function () {
            prerenderMode.loadNextBlockConfigurationOnServer();
            updatePrerenderModeControls();
        });
    }

    function updatePosAndADisplay() {
        var newBlock = realityBuilder.newBlock();

        $('#newBlockXB').text(newBlock.xB());
        $('#newBlockYB').text(newBlock.yB());
        $('#newBlockZB').text(newBlock.zB());
        $('#newBlockA').text(newBlock.a());
    }

    // Sorting function for sorting blocks for display in the table.
    function sortForTable(x, y) {
        // Sorts first by state (pending < real < deleted), and then by
        // date-time.
        if (x.state() === y.state()) {
            // state the same => sort by date-time
            if (x.timeStamp() > y.timeStamp()) {
                return -1;
            } else if (x.timeStamp() < y.timeStamp()) {
                return 1;
            } else {
                return 0;
            }
        } else if (x.state() === 1) {
            return -1;
        } else if (x.state() === 2) {
            return y.state() === 1 ? 1 : -1;
        } else {
            return 1;
        }
    }

    // Returns the list of all blocks, except the new block, sorted for display
    // in the table.
    function blocksSortedForTable() {
        return realityBuilder.constructionBlocks().blocks().sort(sortForTable);
    }

    // Reads the value of the state selector "selectNode" associated with the
    // block "block" and triggers setting of the state.
    function applyStateFromStateSelector(selectNode, block) {
        realityBuilder.constructionBlocks().
            setBlockStateOnServer(block.posB(), block.a(),
                                  parseInt(selectNode.val(), 10));
    }

    // Returns a node representing a select button for the state of the block
    // "block", with the state of that block preselected.
    function stateSelectorNode(block) {
        var node;

        node = $('<select/>', {size: 1});
        $.each(['Deleted', 'Pending', 'Real'], function (state, stateName) {
            var optionNode = $('<option/>', {
                value: state,
                text: stateName,
                selected: state === block.state()
            });
            node.append(optionNode);
        });

        node.change(function () {
            applyStateFromStateSelector(node, block);
        });

        return node;
    }

    function padded(x) {
        return ((x < 10) ? '0' : '') + x;
    }

    // Returns the date-time (local time) in a readable format.
    function formattedDateTime(timestamp) {
        var date = new Date(timestamp * 1000);

        return (date.getFullYear() + '-' +
                padded((date.getMonth() + 1)) + '-' +
                padded(date.getDate()) + ' ' +
                padded(date.getHours()) + ':' +
                padded(date.getMinutes()) + ':' +
                padded(date.getSeconds()));
    }

    // Creates a row for the blocks table and returns the row node.
    function blocksTableRowNode(block) {
        var node, rowValues, cellNode;

        node = $('<tr/>');
        rowValues = [
            block.xB(), block.yB(), block.zB(), block.a(), 
            formattedDateTime(block.timeStamp()), stateSelectorNode(block)];

        $.each(rowValues, function (i, rowValue) {
            cellNode = $('<td/>');
            if (i < 5) {
                cellNode.text(rowValue);
            } else {
                cellNode.append(rowValue);
            }
            if (i < 4) {
                cellNode.addClass('number');
            }
            node.append(cellNode);
        });

        return node;
    }

    // Refreshes the table displaying the list of blocks.
    function updateBlocksTable() {
        var node = $('#blocksTable tbody');

        node.empty();
        $.each(blocksSortedForTable(), function (i, block) {
            node.append(blocksTableRowNode(block));
        });
    }

    function onJsonpError() {
        alert('JSONP request failed.');
    }

    function onReady() {
        setUpSaveSettingsButton();
        setUpPreviewCameraButton();
        setUpPrerenderModeButtons();
        updateCameraControls();
        updatePrerenderModeControls();

        realityBuilder.setRealBlocksVisibility(true);
        realityBuilder.setPendingBlocksVisibility(true);
        updateRealBlocksVisibilityButton();

        updatePendingBlocksVisibilityButton();
        updatePosAndADisplay();
    }

    publicInterface = {
        settings: function () {
            var settings;

            settings = realityBuilderCom.base.settings();

            return $.extend({}, settings, {
                onReady: function () {
                    settings.onReady();
                    onReady();
                },
                onPrerenderedBlockConfigurationChanged: function () {
                    settings.onPrerenderedBlockConfigurationChanged();
                    updatePrerenderModeControls();
                },
                jsonpTimeout: 20000,
                onJsonpError: onJsonpError,
                onRealBlocksVisibilityChanged: 
                updateRealBlocksVisibilityButton,
                onPendingBlocksVisibilityChanged: 
                updatePendingBlocksVisibilityButton,
                onCameraChanged: updateCameraControls,
                onConstructionBlocksChanged: updateBlocksTable,
                onMovedOrRotated: updatePosAndADisplay
            });
        }
    };

    return publicInterface;
}());

$(function () {
    var settings = realityBuilderCom.admin.settings();
    
    realityBuilder.initialize(settings);
});
