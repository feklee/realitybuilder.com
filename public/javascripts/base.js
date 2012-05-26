// For all pages.

// Copyright 2011 Felix E. Klee <felix.klee@inka.de>
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

/*global realityBuilder, $, YT, alert, Modernizr */

var realityBuilderCom = {};

// Load indicator animation.
realityBuilderCom.loadIndicator = (function () {
    var publicInterface, 
    id = null, 
    shouldBeStarted = false, 
    frameDuration = 150; // ms

    function stop() {
        if (id !== null) {
            clearInterval(id);
            id = null;
        }
    }

    // Starts the load indicator animation. Makes sure that not two animations
    // are running simultaneously.
    function start() {
        var pos = 0;

        stop(); // if already started
        id = setInterval(function () {
            $('#loadIndicator').css({
                'background-position': '-' + (32 * pos) + 'px 0'
            });
            pos = (pos + 1) % 8;
        }, frameDuration);
    }

    publicInterface = {
        // One may consider having the load indicator animation run forever.
        // However, at least on Chrome 13 / WinXP32, the animation sometimes
        // stops when running hidden in the background, and thus needs to be
        // started manually anyhow.
        startAndFadeIn: function (duration) {
            shouldBeStarted = true;
            start();

            $('#loadIndicator').fadeIn(duration);
        },

        fadeOutAndStop: function (duration) {
            var pos = 0;

            shouldBeStarted = false;

            $('#loadIndicator').fadeOut(duration, function () {
                // Check for "shouldBeStarted" is to prevent load indicator
                // from stopping if started *after* the current fadeOut was
                // initiated:
                if (!shouldBeStarted) {
                    stop();
                }
            });
        }
    };

    return publicInterface;
}());

realityBuilderCom.alert = (function () {
    var 
    publicInterface;

    publicInterface = {
        // Flashs up an alert image, i.e. shows it only for a moment. If CSS
        // transformation are supported by the browser, shows animation.
        flashUp: function (type) {
            var node = $('#' + type + 'Alert');

            node.show();

            if (Modernizr.csstransforms) {
                node.
                    css('transform', 'scale(0.7)').
                    stop(). // if an animation is already running
                    animate({
                        transform: 'scale(1)'
                    }, {
                        duration: 1000, 
                        easing: 'easeOutElastic', 
                        complete: function () { 
                            node.hide();
                        }
                    });
            } else {
                setTimeout(function () {
                    node.hide();
                }, 600);
            }
        }
    };

    return publicInterface;
}());

realityBuilderCom.panel = function (type) {
    var publicInterface;

    // If CSS transforms are not supported by the browser, skips the animation.
    function flip(endDisplay, startScaleY, endScaleY, easing, onComplete) {
        var node = $('#' + type + 'Panel');

        if (Modernizr.csstransforms) {
            node.
                css('transform', 'scale(1, ' + startScaleY + ')').
                css('display', 'block').
                animate({
                    transform: 'scale(1, ' + endScaleY + ')'
                }, {
                    duration: 'fast',
                    easing: 'easeOutCirc',
                    complete: function () {
                        node.css('display', endDisplay);
                        onComplete();
                    }
                });
        } else {
            node.css('display', endDisplay);
            onComplete();
        }
    }

    publicInterface = {
        flipIn: function (onComplete) {
            flip('block', 0, 1, 'easeOutCirc', onComplete);
        },

        flipOut: function (onComplete) {
            flip('none', 1, 0, 'easeInCirc', onComplete);
        }
    };

    return publicInterface;
};

realityBuilderCom.controlPanel = (function () {
    var publicInterface,
    coordinateButtonDeltaBs = {
        'incX': [1, 0, 0],
        'decX': [-1, 0, 0],
        'incY': [0, 1, 0],
        'decY': [0, -1, 0],
        'incZ': [0, 0, 1],
        'decZ': [0, 0, -1]
    },
    makeRealButtonIsEnabled = false,

    // If a block was requested to be made real by clicking the make-real
    // button, then this contains the position and angle of that block, but
    // only as long as the panel is frozen (disabled):
    requestedPosBAndA = null,

    isDisabled = true, // entire panel is disabled?

    onMakeRealRequested = null;

    function forEachCoordinateButton(f, panelShouldBeDisabled) {
        $.each(coordinateButtonDeltaBs, function (type, deltaB) {
            f(type, deltaB, panelShouldBeDisabled);
        });
    }

    // Updates the state of a node, i.e. whether it's enabled or disabled.
    function updateNodeState(node, shouldBeEnabled) {
        if (shouldBeEnabled) {
            node.removeClass('disabled');
        } else {
            node.addClass('disabled');
        }
    }

    function controlButtonNode(type) {
        return $('#' + type + 'Button');
    }

    function updateControlButtonState(type, shouldBeEnabled) {
        updateNodeState(controlButtonNode(type), shouldBeEnabled);
    }

    function updateCoordinateButtonState(type, deltaB, 
                                         panelShouldBeDisabled)
    {
        updateControlButtonState(type, 
                                 !panelShouldBeDisabled &&
                                 realityBuilder.newBlock().canBeMoved(deltaB));
    }

    function updateRotate90ButtonState(panelShouldBeDisabled) {
        updateControlButtonState('rotate90', 
                                 !panelShouldBeDisabled &&
                                 realityBuilder.newBlock().canBeRotated90());
    }

    function newBlockOnTopOfBlockOrGround() {
        return !realityBuilder.newBlock().canBeMoved([0, 0, -1]);
    }

    // Unless a transition is in progress, the button should be enabled always
    // when the new block is on top of another block. I.e. not only when it can
    // actually be made real.
    function makeRealButtonShouldBeEnabled(panelShouldBeDisabled) {
        return !panelShouldBeDisabled && newBlockOnTopOfBlockOrGround();
    }

    function updateMakeRealButtonState(panelShouldBeDisabled) {
        makeRealButtonIsEnabled = 
            makeRealButtonShouldBeEnabled(panelShouldBeDisabled);
        updateControlButtonState('requestMakeReal', makeRealButtonIsEnabled);
    }

    function setUpControlButton(type, onClick) {
        controlButtonNode(type).click(onClick);
    }

    function setUpCoordinateButton(type, deltaB) {
        setUpControlButton(type,
                           function () {
                               if (!isDisabled) {
                                   realityBuilder.newBlock().move(deltaB);
                               }
                           });
    }

    function setUpRotate90Button() {
        setUpControlButton('rotate90',
                           function () {
                               if (!isDisabled) {
                                   realityBuilder.newBlock().rotate90();
                               }
                           });
    }

    // Checks if the new block fullfills certain conditions to be made real.
    // If, so tries to make it real. If not, displays an alert.
    function onMakeRealButtonClicked() {
        var newBlock = realityBuilder.newBlock();

        if (!isDisabled && makeRealButtonIsEnabled) {
            if (newBlock.zB() === 3) {
                realityBuilderCom.alert.flashUp('tooHigh');
            } else if (!newBlock.canBeMadeReal()) {
                // rule not obeyed: one block must always sit on exactly two
                // blocks!
                realityBuilderCom.alert.flashUp('oneOnTwo');
            } else {
                requestedPosBAndA = newBlock.posBAndA();
                realityBuilder.newBlock().requestMakeReal();
                onMakeRealRequested();
            }
        }
    }

    function setUpRequestMakeRealButton() {
        setUpControlButton('requestMakeReal', onMakeRealButtonClicked);
    }

    function onReady() {
        forEachCoordinateButton(setUpCoordinateButton);
        setUpRotate90Button();
        setUpRequestMakeRealButton();
    }

    $(onReady);

    publicInterface = $.extend({}, realityBuilderCom.panel('control'), {
        updateState: function (shouldBeDisabled) {
            if (!shouldBeDisabled) {
                if (!realityBuilderCom.base.realityBuilderIsReady() ||
                    realityBuilder.newBlock().isFrozen()) {
                    shouldBeDisabled = true;
                } else {
                    requestedPosBAndA = null;
                }
            }

            forEachCoordinateButton(updateCoordinateButtonState,
                                    shouldBeDisabled);
            updateRotate90ButtonState(shouldBeDisabled);
            updateMakeRealButtonState(shouldBeDisabled);

            updateNodeState($('#controlPanel'), !shouldBeDisabled);

            isDisabled = shouldBeDisabled;
        },

        disable: function () {
            publicInterface.updateState(true);
        },

        enable: function () {
            publicInterface.updateState(false);
        },

        // Returns non-null, iff since the last accepted click on "Make Real",
        // the panel has remained frozen (i.e. disabled).
        requestedPosBAndA: function () {
            return requestedPosBAndA;
        },

        setOnMakeRealRequested: function (x) {
            onMakeRealRequested = x;
        }
    });

    return publicInterface;
}());

realityBuilderCom.annotationPanel = (function () {
    var publicInterface, 
    textareaNode = $('#annotationInputField textarea'),
    maxNChars = 140,
    isDisabled = true,
    onDone; // called when using the annotation panel has been finished

    function annotation() {
        var val, blockLabel, text;

        val = textareaNode.val();
        text = $('#blockLabel').text();

        if (!textareaNode.hasClass('notYetFocused') && val !== '') {
            // text has been entered by the *user*
            text += ' ' + val;
        }

        return text;
    }

    function updateBlockLabel(posBAndA) {
        $('#blockLabel').text('(' + posBAndA.join(', ') + ')');
    }

    function updateRemainingNCharsLabel() {
        $('#remainingNCharsLabel').text(maxNChars - annotation().length);
    }

    // Changes the class and removes preset text.
    function onFirstFocus() {
        if (!isDisabled) {
            textareaNode.val('');
            textareaNode.removeClass('notYetFocused');
            textareaNode.unbind('focus');
        }
    }

    function onSendButtonClicked() {
        var status;

        if (!isDisabled) {
            status = annotation().substring(0, maxNChars);
            $.post('/rpc/twitter', { status: status });
            onDone();
        }
    }

    function setUpSendButton() {
        $('#sendButton').click(onSendButtonClicked);
    }

    function setUpSkipButton() {
        $('#skipButton').click(function () {
            if (!isDisabled) {
                onDone();
            }
        });
    }

    function prepareTextarea() {
        $('#annotationInputField textarea').
            val('annotation for your block').
            addClass('notYetFocused');
        textareaNode.focus(onFirstFocus);
    }

    function onReady() {
        textareaNode.bind("keyup paste change", updateRemainingNCharsLabel);
        updateRemainingNCharsLabel();

        setUpSendButton();
        setUpSkipButton();

        publicInterface.disable(); // to start disabled
    }

    $(onReady);

    publicInterface = $.extend({}, realityBuilderCom.panel('annotation'), {
        // Prepares the panel for annotating the new block.
        prepare: function (posBAndA) {
            prepareTextarea();
            updateBlockLabel(posBAndA);
            updateRemainingNCharsLabel();
            publicInterface.disable();
        },

        disable: function () {
            $('#annotationPanel, #annotationInputField, #sendButton, ' + 
              '#skipButton').addClass('disabled');
            $('#annotationInputField textarea').attr('readonly', 'readonly');
            isDisabled = true;
        },

        enable: function () {
            $('#annotationPanel, #annotationInputField, #sendButton, ' + 
              '#skipButton').removeClass('disabled');
            $('#annotationInputField textarea').removeAttr('readonly');
            isDisabled = false;
        },

        setOnDone: function (x) {
            onDone = x;
        }
    });

    return publicInterface;
}());

realityBuilderCom.base = (function () {
    var publicInterface,
    stillImage = {
        base: '/separate/still_images/',
        url: null,
        blockConfigurationI: null // index of associated block configuration
    },
    video = {
        index: null, // index of current video
        playingEventProcessed: false, // necessary since the playing event is,
                                      // as of August 2011, fired twice, at
                                      // least sometimes

        // Approximate durations by which a transition video is trimmed at the
        // start and at the end. Motivation for trimming at the start is having
        // the user wait less. Motivation for trimming at the end is
        // suppressing for example the play button flashing up on iOS 4.3 at
        // the regular end of the video.
        startTrim: 0.5, // s
        endTrim: 0.5, // s

        timeWhenLastEnded: null,

        // how often to check whether video has been started:
        pollTrimmedStartedInterval: 100, // ms

        // how often to check whether trimmed video has ended:
        pollTrimmedEndedInterval: 100, // ms

        // true while the trimmed video is playing:
        trimmedIsPlaying: false
    },
    stillImageTagIsReady = false, // initially only a placeholder is loaded
    realityBuilderIsReady = false,

    // True also shortly before and after a transition video is shown:
    videoTransitionIsInProgress = false,

    transitionIsAnticipated = false, // true after make-real-btn. clicked
    width = 1024,
    height = 690,
    noBlockConfigurationYetLoaded = true,
    videoPlayer = null,
    videoPlayerInitialized = false,
    videoPlayerLeft = '-128', // px
    videoPlayerTop = '-15', // px
    initializationVideoVisible = false,
    realityBuilderVersion, // version of the Reality Builder being used

    // Indexes of the video clips (= indexes of the configurations in the
    // configuration sequence). Example:
    //
    // {
    //     '1': {      // source configation
    //         '2': 3, // destination configuration: clip showing transition
    //         '15': 4 // destination configuration: clip showing transition
    //     },
    //     '3': {
    //         '5': 8,
    //         '7': 19
    //     },
    //     ...
    // }
    videoIndexesList = {
        '0': {'1': 1, '65': 214, '78': 245, '90': 293, '91': 298, '96': 327},
        '1': {'2': 2, '47': 140, '51': 154, '63': 204},
        '2': {'3': 3, '13': 27, '41': 116, '46': 133},
        '3': {'4': 4, '9': 13, '11': 19, '12': 22},
        '4': {'5': 5, '7': 8, '8': 10},
        '5': {'6': 6},
        '8': {'6': 11},
        '9': {'5': 14, '10': 16},
        '10': {'6': 17},
        '11': {'7': 20},
        '12': {'8': 23, '10': 25},
        '13': {'14': 28, '38': 105, '40': 111},
        '14': {'15': 29, '25': 53, '31': 72, '33': 78, '35': 84, '37': 94},
        '15': {'16': 30, '20': 37, '22': 40, '24': 46},
        '16': {'17': 31, '19': 34},
        '17': {'18': 32},
        '19': {'18': 35},
        '20': {'21': 38},
        '22': {'17': 41, '23': 43},
        '23': {'18': 44},
        '24': {'19': 47, '21': 49, '23': 51},
        '25': {'16': 54, '26': 56, '28': 59, '30': 65},
        '26': {'27': 57},
        '28': {'17': 60, '29': 62},
        '29': {'18': 63},
        '30': {'19': 66, '27': 68, '29': 70},
        '31': {'20': 73, '32': 75},
        '32': {'21': 76},
        '33': {'26': 79, '34': 81},
        '34': {'27': 82},
        '35': {'22': 85, '28': 87, '36': 89},
        '36': {'23': 90, '29': 92},
        '37': {'24': 95, '30': 97, '32': 99, '34': 101, '36': 103},
        '38': {'15': 106, '39': 108},
        '39': {'16': 109},
        '40': {'25': 112, '39': 114},
        '41': {'14': 117, '42': 119, '44': 125, '45': 128},
        '42': {'25': 120, '43': 122},
        '43': {'28': 123},
        '44': {'31': 126},
        '45': {'35': 129, '43': 131},
        '46': {'9': 134, '40': 136, '42': 138},
        '47': {'3': 141, '48': 143, '50': 149},
        '48': {'4': 144, '49': 146},
        '49': {'7': 147},
        '50': {'11': 150, '49': 152},
        '51': {'13': 155, '52': 157, '62': 199},
        '52': {'14': 158, '53': 160, '57': 174, '59': 184, '61': 190},
        '53': {'15': 161, '54': 163, '56': 169},
        '54': {'20': 164, '55': 166},
        '55': {'21': 167},
        '56': {'24': 170, '55': 172},
        '57': {'31': 175, '54': 177, '58': 179},
        '58': {'32': 180, '55': 182},
        '59': {'33': 185, '60': 187},
        '60': {'34': 188},
        '61': {'37': 191, '56': 193, '58': 195, '60': 197},
        '62': {'38': 200, '53': 202},
        '63': {'41': 205, '52': 207, '64': 209},
        '64': {'44': 210, '57': 212},
        '65': {'66': 215, '76': 239},
        '66': {'67': 216, '73': 228, '75': 234},
        '67': {'68': 217, '71': 222, '72': 225},
        '68': {'69': 218, '70': 220},
        '71': {'69': 223},
        '72': {'70': 226},
        '73': {'68': 229, '74': 231},
        '74': {'70': 232},
        '75': {'72': 235, '74': 237},
        '76': {'67': 240, '77': 242},
        '77': {'71': 243},
        '78': {'2': 246, '66': 248, '79': 250, '81': 256, '88': 283},
        '79': {'3': 251, '80': 253},
        '80': {'12': 254},
        '81': {'13': 257, '67': 259, '82': 261},
        '82': {'14': 262, '83': 264, '85': 270, '87': 276},
        '83': {'33': 265, '84': 267},
        '84': {'34': 268},
        '85': {'35': 271, '86': 273},
        '86': {'36': 274},
        '87': {'37': 277, '84': 279, '86': 281},
        '88': {'41': 284, '82': 286, '89': 288},
        '89': {'45': 289, '85': 291},
        '90': {'47': 294, '79': 296},
        '91': {'51': 299, '76': 301, '81': 303, '92': 305},
        '92': {'52': 306, '82': 308, '93': 310, '95': 320},
        '93': {'59': 311, '83': 313, '94': 315},
        '94': {'60': 316, '84': 318},
        '95': {'61': 321, '87': 323, '94': 325},
        '96': {'63': 328, '88': 330, '92': 332}
    },

    // Maps from video clip indexes to YouTube IDs:
    youTubeIds = {
        '1': 'vnK6qPOn5BQ',
        '10': 'hFZUbC0iVZU',
        '101': 'QQC-674emf8',
        '103': '2NIxIwyoWlo',
        '105': 'v7IxRZECAp4',
        '106': '1LMJEMmQRns',
        '108': 'loneWMBPCu8',
        '109': 'a4HXAsbWIXk',
        '11': '23EqgW_GqRo',
        '111': 'a-F0tAoRnZw',
        '112': '_TP_cvi1kyg',
        '114': 'TXa666Wko6c',
        '116': 'ul5feOFrWIs',
        '117': 'FWtqUzfWBEM',
        '119': 'TISHv2FgYEk',
        '120': 'oKqM33sdep8',
        '122': 'zN59I4-MfWo',
        '123': 'ZF0FeJMRPRg',
        '125': '3vGqYII9jDY',
        '126': 'oFnLINAlg-U',
        '128': 'BZKEACyHTp4',
        '129': 'gqWtaY9T5U4',
        '13': '3BIUc5TzfsI',
        '131': 'hmj-8KslY3k',
        '133': '5E2aB2AHfhI',
        '134': 'UYgSr_UxcFM',
        '136': 'O9zkFVYi2b8',
        '138': 'yABmcVeS3v8',
        '14': 'PNLAjIBoH_o',
        '140': 'Rl_xZe-zRiw',
        '141': 'ShwMsg5Q-xI',
        '143': '7QYMcVvYgAs',
        '144': '8BCTpC6KkYQ',
        '146': 'IMuE7hoUvH8',
        '147': 'iNoFu2zaFKY',
        '149': 'k5Ea9ytSkT0',
        '150': '7jRfrwYzSrI',
        '152': '4zB5OBw56QU',
        '154': 'JqzybTdvz5U',
        '155': '2khKnvYxK4k',
        '157': 'wJkqB-juLwU',
        '158': 'XXkcXaKshic',
        '16': 'Z1zcO-BIwKA',
        '160': 'zKM8AGDzpMI',
        '161': 'FnqMLMVOnWY',
        '163': 'EGQxMxZFF8E',
        '164': 'hk2rriAGR-0',
        '166': '6vzLiYbVhp4',
        '167': 'Z0wmRaVrTW0',
        '169': 'RlQcHwbGBP0',
        '17': '9irhpcQA_W8',
        '170': 'yfhEIyJo5A0',
        '172': '0YAyL-vyAZg',
        '174': 'KHOyGymRp60',
        '175': 'gTkLgoMapMM',
        '177': 'D-liSDSaP0Y',
        '179': 'iiYzclgsK-M',
        '180': 'QCKSQc9o_cg',
        '182': 'XF6sPJ1-rg8',
        '184': 'LoX0YkHb0EA',
        '185': 'TZTgg7WvmpU',
        '187': 'jwVuFPAEdGo',
        '188': 'S0CBy86KHvs',
        '19': 'WsLEGMMRGMY',
        '190': 'dc-teOhk9yE',
        '191': '2qPUmkuN2LQ',
        '193': 'KmmdiZnmDB8',
        '195': '9Qd11M96SYA',
        '197': 'Xpzs4ZwRZ5E',
        '199': 'QIBDLyonuSs',
        '2': '_EEQX5eeJ68',
        '20': 'gvhaV6-9BSU',
        '200': 'HouvKvFnvTk',
        '202': 'oSSdVZd4qVA',
        '204': 'SMjwmq3X9lE',
        '205': '5Cer0u5Mpho',
        '207': 'KvjN60ROvOk',
        '209': 'SCXIrM5Hggs',
        '210': 'mQre7YeOv90',
        '212': '8WNEweNqyKs',
        '214': 'HAJZsHUeiac',
        '215': '-Ps5vW4-V2Q',
        '216': 'dL-KaCrORmg',
        '217': 'Cut4vRm9PlI',
        '218': 'RRuz3gZLJbI',
        '22': 'oEi5xIhSq3A',
        '220': 'bNOk7VVLwEg',
        '222': 'gGfcGvQdF1w',
        '223': 'oy3Z7PtaORI',
        '225': 'zzS8vSpPP3M',
        '226': 'QCSvd4NxQvc',
        '228': '8cKOM9fTYKs',
        '229': 'AgOZbRJXU0g',
        '23': '7Fi1cgeZDXc',
        '231': 'pof-K33EfE0',
        '232': 's7f5QpR1hS0',
        '234': 'NoAahW_LGHg',
        '235': 'P-tvHgrQk1s',
        '237': '7nI6WGNiJ9A',
        '239': 'bpP6OYYf0lY',
        '240': 'RF7E7q10VF0',
        '242': 'CuqdddSuU58',
        '243': 'VXPOYn6E_JQ',
        '245': 'DR-wPEwnDjc',
        '246': 'FHgUhThC1lg',
        '248': 'Jfsx2NKPql4',
        '25': 'u53pgfT0vcc',
        '250': '2FpWCRJTaDI',
        '251': '7pMqPOV8QV4',
        '253': 'bEOC48eR6Ro',
        '254': '19OrUtbAi7M',
        '256': 'pB2Ue66OC60',
        '257': 'LcScOEXBO9Q',
        '259': '_6ukoKTxitY',
        '261': '3vJ0hSwgJmk',
        '262': 'RAvJ3xAVh8o',
        '264': 'ZZPQR8LsZ8w',
        '265': 'zJYcwXYWazs',
        '267': 'eG2CWiALTNo',
        '268': 'm6aw9Ou0nuA',
        '27': '5MAcoO5ywFg',
        '270': 'Urtqymahdo4',
        '271': 'sowxY6ZemSA',
        '273': 'AbVDohfbyYE',
        '274': 'uY4OU1t2JWU',
        '276': '0wTDP4sDS_k',
        '277': 'kfmTgAuD1oU',
        '279': 'UqmknImAccY',
        '28': 'qd_H8Mtbp_0',
        '281': 'FpoYgQsdKew',
        '283': '2qmRzx6hv04',
        '284': 'nRNW3YZO3zo',
        '286': 'l3W7sY_oQMY',
        '288': '6oo552RCo60',
        '289': 'PnSZJFOA-_U',
        '29': 'Xy9b6HPJ2gI',
        '291': 'tl7G6duQysQ',
        '293': '9f5JMzaazc8',
        '294': 'nkdhAPekBX4',
        '296': '6BpElTgCFpM',
        '298': '6wh3Z6yGrC8',
        '299': 'BZWwCT9dtiY',
        '3': 'UAmPiBrJetk',
        '30': 'Vu8aaEF4H-c',
        '301': 'PAAS6SNaixM',
        '303': '36YNiyrWcpc',
        '305': 'C54jNFwFdrE',
        '306': '7-dBiMKk-ko',
        '308': 'zVykDsCK3io',
        '31': 'wh824vMFUAo',
        '310': 'qhBMCFQMfng',
        '311': 'Bh_u5AoQQfs',
        '313': 'oS9GUEMD3XE',
        '315': 'ffFN60qQW8k',
        '316': 'uYFa05haq2A',
        '318': '2TYS6AsrQ9E',
        '32': 'XcsnOJ-h1Gk',
        '320': 'Kz9eLPoQEAU',
        '321': 'KS65eqrbPLk',
        '323': 'ak7jrFKodvs',
        '325': 'Ec1ymIJmt54',
        '327': '5_ztJs_MzzQ',
        '328': 'CUUX6kWkQtE',
        '330': 'z3mgEbF23Pk',
        '332': '4BWo528L5MU',
        '34': 'keJyY5_ljOg',
        '35': 'yttclxSccPI',
        '37': 'GPuGZGa9LHU',
        '38': 'HVe4vIdPzqs',
        '4': 'cfOPTjmaNcY',
        '40': 'PnU0Ebo2G84',
        '41': 'XRkF7fyUkfA',
        '43': 'Uw9c2PikXNw',
        '44': 'BaPbKCmIxKI',
        '46': 'FG0WauNzhaw',
        '47': '8uIZPVyviSU',
        '49': 'abGECaX5eQA',
        '5': 'te6tkwsWihA',
        '51': 'icjTuUDAgvA',
        '53': 'ftIR894bSm0',
        '54': 'YxWO28l3mNQ',
        '56': 'UoWBeQWSXrA',
        '57': '4XJmJyJfd7g',
        '59': 'GSdWvj4dDkg',
        '6': 'CArC9FF-vDA',
        '60': '4rRyraBq4R0',
        '62': 'g6X7pmrJe1o',
        '63': 'Fn8fAhvv1Sk',
        '65': 'VqTzBIshd50',
        '66': 'KyneHRVHjok',
        '68': 'IiWGcHXEhl4',
        '70': 'w8Ta5T3DUhs',
        '72': '2zPKO8S0sNo',
        '73': '74uGmJSX9RM',
        '75': 'VSRnmMe4Dqc',
        '76': 'K_gZH_vAnK4',
        '78': 'UQi4xNPwXRc',
        '79': 'evyJba_BOtU',
        '8': 'WNLZYhEwgu0',
        '81': '1pA4PT5uCRI',
        '82': '1NlSopQNvPU',
        '84': 'VylxU1k8PQk',
        '85': 'zBjDnb8-Zto',
        '87': '4cHdscZNTE8',
        '89': 'VpMOtRRCLA8',
        '90': 'HP5iI8MREIM',
        '92': 'TGnkzdr89Og',
        '94': 'CToZ_OZdGEI',
        '95': 'WZuuOeLLbO4',
        '97': 'MNEUcPlU9X8',
        '99': 'wsBrFRKBez4'
    };

    function onBrowserNotSupportedError() {
        // "alert" works also in very old browsers such as Netscape 4.
        alert('Your web browser is not supported.');
    }

    function onServerError() {
        alert('Server error.');
    }

    // Unhides the content.
    function unhideView() {
        $('#startScreen').fadeOut('slow');
        realityBuilderCom.loadIndicator.fadeOutAndStop('slow');
    }

    function updateRealityBuilderVisibility() {
        if (transitionIsAnticipated || videoTransitionIsInProgress) {
            $('#realityBuilder').hide();
        } else {
            $('#realityBuilder').show();
        }
    }

    function controlPanelShouldBeDisabled() {
        return transitionIsAnticipated || videoTransitionIsInProgress;
    }

    function updateControlPanelState() {
        var shouldBeDisabled;

        shouldBeDisabled = controlPanelShouldBeDisabled();
        realityBuilderCom.controlPanel.updateState(shouldBeDisabled);
    }

    // Unhides the view, if the Reality Builder is ready and if the background
    // image is ready, i.e. has been loaded.
    function unhideViewIfAllReady() {
        if (realityBuilderIsReady && stillImageTagIsReady && 
            videoPlayerInitialized) {
            updateControlPanelState();
            unhideView();
        }
    }

    // Returns the URL of the specified image.
    function stillImageUrl(videoIndex, type) {
        return stillImage.base + videoIndex + '_' + type + '.jpg';
    }

    // Returns the URL of the first image of the specified video clip.
    function startStillImageUrl(videoIndex) {
        return stillImageUrl(videoIndex, 'start');
    }

    // Returns the URL of the last image of the specified video clip.
    function endStillImageUrl(videoIndex) {
        return stillImageUrl(videoIndex, 'end');
    }

    // Returns the value of any property of the object "object", or undefined
    // if no propery exists.
    function anyOwnPropertyValue(object) {
        var returnValue;

        $.each(object, function (key, value) {
            returnValue = value;
            return false;
        });

        return returnValue;
    }

    // If existent, returns the index of a video clip that shows a transition
    // to the specified configuration. Otherwise returns false.
    function indexOfVideoWithDestination(configurationIndex) {
        var destinationConfigurationIndex, indexOfVideo = false;

        $.each(videoIndexesList, function (key1, videoIndexes) {
            $.each(videoIndexes, function (key2, videoIndex) {
                destinationConfigurationIndex = parseInt(key2, 10);
                if (destinationConfigurationIndex === 
                    configurationIndex) {

                    indexOfVideo = videoIndex;
                    return false;
                }
            });
            if (indexOfVideo !== false) {
                return false;
            }
        });

        return indexOfVideo;
    }

    // If existent, returns the index of a video clip that shows a transition
    // from the specified configuration. Otherwise returns false.
    function indexOfVideoWithSource(configurationIndex) {
        var sourceConfigurationIndex, indexOfVideo = false;

        $.each(videoIndexesList, function (key, videoIndexes) {
            sourceConfigurationIndex = parseInt(key, 10);
            if (sourceConfigurationIndex === configurationIndex) {
                videoIndexes = videoIndexesList[key]; // non-empty
                indexOfVideo = anyOwnPropertyValue(videoIndexes); // any is OK
                return false;
            }
        });

        return indexOfVideo;
    }

    // Returns the URL of a still image displaying the configuration "i".
    //
    // The still image will be either the first or the last frame of a video
    // clip showing the transition from or to the configuration.
    //
    // Note that the first configuration (= no blocks added) is never the
    // destination of a transition. And therefore it never appears as last
    // frame in a clip. Similarly a last configuration (= all blocks added)
    // never appear as first frame.
    function stillImageOfBlockConfigurationUrl(i) {
        var videoIndex;

        videoIndex = indexOfVideoWithSource(i);
        if (videoIndex !== false) {
            return startStillImageUrl(videoIndex);
        } else {
            videoIndex = indexOfVideoWithDestination(i);
            return endStillImageUrl(videoIndex);
        }
    }

    function renderStillImage() {
        $('#stillImage').attr('src', stillImage.url);

        if (!stillImageTagIsReady) {
            // first image hasn't been loaded yet (only a placeholder)
            $('#stillImage').one('load', function () { 
                stillImageTagIsReady = true;
                unhideViewIfAllReady();
            });
        }
    }

    // Loads the video, and starts playing it, asynchronously.
    function loadTransitionVideo(videoIndex) {
        videoTransitionIsInProgress = true;
        updateRealityBuilderVisibility();
        realityBuilderCom.controlPanel.disable();
        realityBuilderCom.loadIndicator.startAndFadeIn('fast');
        video.index = videoIndex;
        video.playingEventProcessed = false;
        videoPlayer.loadVideoById(youTubeIds[videoIndex], video.startTrim);
    }

    function trimmedVideoHasStarted() {
        // This check is necessary, since as of August 2011, the YouTube API
        // sometimes reports that the video is playing, even though it is only
        // being buffered. See:
        //
        // <url:https://groups.google.com/forum/#!msg/youtube-api-gdata/dBoCDbQ
        // pORM/2XPcaEIwHeAJ>
        return (videoPlayer.getCurrentTime() !== video.timeWhenLastEnded &&
                videoPlayer.getCurrentTime() > video.startTrim);
    }

    // The video player needs to be hidden at least on iOS 4.3: Otherwise,
    // after the first video finished playing, overlayed content won't be
    // clickable anymore. This is true irrespective of the z-index of the
    // overlays and the video player.
    function hideVideoPlayer() {
        // The video is moved out of the way. Using jQuery's "hide()" or
        // "fadeOut" causes problems at least on iOS 4.3: Here the respective
        // functions to unhide the video, "show()" and "fadeIn", cause the 
        // video to be black.
        $('#videoPlayer').
            css('left', width + 'px').
            css('top', height + 'px');
    }

    // Opposite of "hideVideoPlayer()".
    //
    // Note that on iOS 4.3 Safari, the video player will be sensitive to touch
    // events, allowing pausing of the video. Even when disabling touch events
    // for "document", the video player touch events work.
    function showVideoPlayer() {
        $('#videoPlayer').
            css('left', videoPlayerLeft + 'px').
            css('top', videoPlayerTop + 'px');
    }

    // Called when the video should disappear, i.e. at "endTrim" before its
    // actual end.
    function onTrimmedVideoHasEnded() {
        if (video.trimmedIsPlaying) {
            // stops the video, by hiding it:
            $('#stillImage').show();
            hideVideoPlayer();
        }
        video.trimmedIsPlaying = true;
    }

    function trimmedVideoHasEnded() {
        if (video.trimmedIsPlaying) {
            if (videoPlayer.getDuration() === 0) {
                // From YouTube documentation: "Note that getDuration() will
                // return 0 until the video's metadata is loaded, which
                // normally happens just after the video starts playing." That
                // the value is still 0 here should be rare, maybe even
                // impossible.
                return false;
            } else {
                return (videoPlayer.getCurrentTime() >=
                        videoPlayer.getDuration() - video.endTrim);
            }
        } else {
            return true;
        }
    }

    // Shows the still image instead of the video player, once the trimmed
    // video has ended.
    function checkUntilTrimmedVideoHasEnded() {
        if (trimmedVideoHasEnded()) {
            onTrimmedVideoHasEnded();
        } else {
            setTimeout(checkUntilTrimmedVideoHasEnded, 
                       video.pollTrimmedEndedInterval);
        }
    }

    // Once video is playing: First hides the still image. Then updates the
    // hidden image to show the end image of the current video clip.
    function onTrimmedVideoHasStarted() {
        showVideoPlayer();
        realityBuilderCom.loadIndicator.fadeOutAndStop('fast');
        $('#stillImage').hide();
        renderStillImage();
        
        video.trimmedHasStarted = true;
        checkUntilTrimmedVideoHasEnded();
    }

    // Continually polls until the video player is really playing. Because, as
    // of August 2011, the YouTube player API frequently reports that the video
    // player is playing when it is still buffering, at least with the HTML5
    // player.
    function checkUntilTrimmedVideoHasStarted() {
        if (videoTransitionIsInProgress) {
            if (trimmedVideoHasStarted()) {
                onTrimmedVideoHasStarted();
            } else {
                setTimeout(checkUntilTrimmedVideoHasStarted, 
                           video.pollTrimmedStartedInterval);
            }
        }
    }

    // Returns true, iff the current block configuration with the index "i" is
    // full.
    function resetShouldBeScheduled(i) {
        return indexOfVideoWithSource(i) === false;
    }

    function onVideoPlaying() {
        checkUntilTrimmedVideoHasStarted();
    }

    function stillImageNeedsToBeRendered() {
        return $('#stillImage').attr('src') !== stillImage.url;
    }

    // Shows the annotation panel, using a flip animation.
    function showAnnotationPanel() {
        var requestedPosBAndA;

        requestedPosBAndA = realityBuilderCom.controlPanel.requestedPosBAndA();
        realityBuilderCom.annotationPanel.prepare(requestedPosBAndA);
        realityBuilderCom.controlPanel.disable();
        realityBuilderCom.controlPanel.flipOut(function () {
            realityBuilderCom.annotationPanel.flipIn(
                realityBuilderCom.annotationPanel.enable);
        });
    }

    // Hides the annotation panel, using a flip animation.
    function hideAnnotationPanel() {
        realityBuilderCom.annotationPanel.disable();
        realityBuilderCom.annotationPanel.flipOut(function () {
            realityBuilderCom.controlPanel.flipIn(updateControlPanelState);
        });
    }

    // Returns true, iff the block that was requested by the user has been made
    // real. In that case, he should have the option to annotate it.
    function annotationPanelShouldBeShown() {
        var requestedPosBAndA, block, constructionBlocks, prerenderMode,
        posBAndA, blockProperties;

        requestedPosBAndA = realityBuilderCom.controlPanel.requestedPosBAndA();

        if (requestedPosBAndA !== null) {
            constructionBlocks = realityBuilder.constructionBlocks();
            prerenderMode = realityBuilder.prerenderMode();
            blockProperties = realityBuilder.blockProperties();

            posBAndA = prerenderMode.simplifiedPosBAndA(requestedPosBAndA,
                                                        blockProperties);
            block = constructionBlocks.blockAt(posBAndA, posBAndA[3]);

            if (block && block.isReal()) {
                return true; // requested block has been made real
            }
        }
    }

    // Called when the video player finished playing. Marks the end of the
    // transition.
    function onVideoEnded() {
        onTrimmedVideoHasEnded(); // may not have been called yet

        if (stillImageNeedsToBeRendered()) {
            // Will be reached in case the update of the still image didn't
            // happen while the clip was playing, perhaps because of high load
            // or the clip was playing very short - expected to be rare!
            //
            // Will also be reached in case another configuration has been
            // loaded while the transition was in progress.
            renderStillImage();
        }

        videoTransitionIsInProgress = false;

        updateRealityBuilderVisibility();

        if (annotationPanelShouldBeShown()) {
            showAnnotationPanel();
        } else {
            realityBuilderCom.controlPanel.enable();
        }
    }

    // Shows the video player with the initialization video.
    //
    // This video is needed at least on iOS 4.3 Safari: Here a play button will
    // be displayed, that the user has to press, thereby giving his consent to
    // playing video on the site. Otherwise video could not be played back
    // programmatically later. See also:
    //
    //   <url:http://developer.apple.com/library/safari/#documentation/AudioVid
    //   eo/Conceptual/Using_HTML5_Audio_Video/Device-SpecificConsiderations/De
    //   vice-SpecificConsiderations.html#//apple_ref/doc/uid/TP40009523-CH5-SW
    //   1>
    //
    // On many browsers, the video will play back automatically, requiring no
    // user intervention.
    function showInitializationVideo() {
        $('#videoPlayerOverlay').hide();

        initializationVideoVisible = true;
    }

    function onVideoPlayerReady() {
        showInitializationVideo();
    }

    function onInitializationVideoStarted() {
        initializationVideoVisible = false; // done
        hideVideoPlayer();
        $('#videoPlayerOverlay').show();
        videoPlayerInitialized = true;
        unhideViewIfAllReady();
    }

    // Returns true, iff the initialitation video has been triggered, e.g. by
    // the user clicking the video player's play button.
    function initializationVideoStarted(event) {
        var d = event.data;

        return (initializationVideoVisible &&
                (d === YT.PlayerState.BUFFERING || 
                 d === YT.PlayerState.PLAYING ||
                 d === YT.PlayerState.ENDED));
    }

    function onVideoPlayerStateChange(event) {
        if (initializationVideoStarted(event)) {
            onInitializationVideoStarted();
        } else {
            switch (event.data) {
            case YT.PlayerState.PLAYING:
                if (!video.playingEventProcessed) { // PLAYING may fire more
                                                    // than once
                    video.playingEventProcessed = true;
                    onVideoPlaying();
                }
                break;
            case YT.PlayerState.ENDED:
                video.timeWhenLastEnded = videoPlayer.getCurrentTime();
                onVideoEnded();
                break;
            }
        }
    }

    function transitionVideoExists(prevBlockConfigurationI, 
                                   blockConfigurationI)
    {
        var videoIndex, videoIndexes;

        if (prevBlockConfigurationI in videoIndexesList) {
            videoIndexes = videoIndexesList[prevBlockConfigurationI];
            return (blockConfigurationI in videoIndexes);
        } else {
            return false;
        }
    }

    function transitionVideoIndex(prevBlockConfigurationI,
                                  blockConfigurationI)
    {
        var videoIndex, videoIndexes;

        videoIndexes = videoIndexesList[prevBlockConfigurationI];
        return videoIndexes[blockConfigurationI];
    }

    function blockConfigurationHasBeenReset(i) {
        return i === 0 && !noBlockConfigurationYetLoaded;
    }

    function transitionVideoShouldBeShown(prevBlockConfigurationI, 
                                          blockConfigurationI)
    {
        return (stillImageTagIsReady && !videoTransitionIsInProgress &&
                transitionVideoExists(prevBlockConfigurationI, 
                                      blockConfigurationI));
    }

    // Rationale for not rendering while a transition is in progress: Otherwise
    // it may happen that the still image is updated before video playback of
    // that transition starts. In that case the block configuration in the
    // still image would not match the block configuration at the beginning of
    // the video.
    function renderStillImageUnlessTransitionInProgress() {
        if (!videoTransitionIsInProgress) {
            renderStillImage();
        }
    }

    // Called when the block configuration changed to another prerendered one.
    //
    // Called also at the very beginning, i.e. when there has been no previous
    // prerendered block configuration displayed (= image tag not yet ready).
    function onPrerenderedBlockConfigurationChanged() {
        var prevBlockConfigurationI, blockConfigurationI, prerenderMode, 
        videoIndex;

        prerenderMode = realityBuilder.prerenderMode();
        blockConfigurationI = prerenderMode.i();
        prevBlockConfigurationI = prerenderMode.prevI();

        if (transitionVideoShouldBeShown(prevBlockConfigurationI,
                                         blockConfigurationI)) {
            transitionIsAnticipated = false;
            videoIndex = transitionVideoIndex(prevBlockConfigurationI,
                                              blockConfigurationI);
            stillImage.url = endStillImageUrl(videoIndex);
            stillImage.blockConfigurationI = blockConfigurationI;
            loadTransitionVideo(videoIndex);
        } else {
            transitionIsAnticipated = false;
            stillImage.url = 
                stillImageOfBlockConfigurationUrl(blockConfigurationI);
            stillImage.blockConfigurationI = blockConfigurationI;
            renderStillImageUnlessTransitionInProgress();
            updateControlPanelState(); // may be superfluous
            updateRealityBuilderVisibility(); // may be superfluous
        }

        if (blockConfigurationHasBeenReset(blockConfigurationI)) {
            realityBuilderCom.alert.flashUp('reset');
        }

        if (resetShouldBeScheduled(blockConfigurationI)) {
            // May be called also at the very beginning. This makes sense e.g.
            // if when the last transition ended all browser windows have been
            // closed.
            realityBuilder.prerenderMode().scheduleReset();
        }

        noBlockConfigurationYetLoaded = false; // needs to be at the very end!
    }

    // Called when the Reality Builder is ready. Note that the background image
    // is separate and may still be in the process of being loaded.
    function onRealityBuilderReady() {
        realityBuilderIsReady = true;
        unhideViewIfAllReady();
    }

    function onDegreesOfFreedomChanged() {
        updateControlPanelState();
        updateRealityBuilderVisibility();
    }

    realityBuilderCom.annotationPanel.setOnDone(hideAnnotationPanel);
    realityBuilderCom.controlPanel.setOnMakeRealRequested(function () {
        transitionIsAnticipated = true;
    });

    publicInterface = {
        setRealityBuilderVersion: function (x) {
            realityBuilderVersion = x;
        },

        // Returns settings for the Reality Builder.
        settings: function () {
            return {
                width: width,
                height: height,
                namespace: realityBuilderVersion + '_reality_builder_com',
                onReady: onRealityBuilderReady,
                onBrowserNotSupportedError: onBrowserNotSupportedError,
                onPrerenderedBlockConfigurationChanged: 
                onPrerenderedBlockConfigurationChanged,
                onDegreesOfFreedomChanged: onDegreesOfFreedomChanged,
                onServerError: onServerError,
                lineWidthOfBlock: 2
            };
        },

        // Should not be called before the YouTube player API is ready.
        //
        // May cause error messages seen in some browser's JavaScript console:
        //
        // * "Unable to post message to http://www.youtube.com. [...]"
        //
        // * "Unsafe JavaScript attempt to access frame with URL [...]"
        //
        // These error messages can be ignored. See:
        //
        //   <url:http://groups.google.com/group/youtube-api-gdata/browse_threa
        //   d/thread/a9963ea1c2b1501d>
        //
        //   <url:http://groups.google.com/group/youtube-api-gdata/browse_threa
        //   d/thread/3e65249a4778b07b>
        createVideoPlayer: function () {
            videoPlayer = new YT.Player('videoPlayer', {
                width: '' + 1280,
                height: '' + 720,
                videoId: 'zOyaBcUbo94', // placeholder
                playerVars: {
                    controls: 0,
                    wmode: 'opaque', // to make iframe respect z-index
                    autoplay: 1 // skips the initial video on browsers that
                                // don't enforce user interaction with the
                                // player
                },
                events: {
                    'onReady': onVideoPlayerReady,
                    'onStateChange': onVideoPlayerStateChange
                }
            });

            showVideoPlayer();
        },

        realityBuilderIsReady: function () {
            return realityBuilderIsReady;
        }
    };

    return publicInterface;
}());

$(function () {
    realityBuilderCom.loadIndicator.startAndFadeIn(0);
});

// Called when the YouTube player API is loaded and ready.
function onYouTubePlayerAPIReady() {
    realityBuilderCom.base.createVideoPlayer();
}
