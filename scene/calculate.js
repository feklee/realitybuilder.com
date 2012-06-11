// JScript for automatically calculating:
//
// * A sequence of configurations. Example:
//
//   ......    +-+...    +-++-+    ......    ...+-+    +-++-+
//   . .. . -> | |  . -> | || | -> . .. . -> . .| | -> | || |
//   ......    +-+...    +-++-+    ......    ...+-+    +-++-+
//
// * The associated list of unique configurations. E.g.:
//
//   ......    +-+...    +-++-+    ...+-+
//   . .. . -> | |  . -> | || | -> . .| |
//   ......    +-+...    +-++-+    ...+-+
//
// * A list mapping source and destination configurations, i.e. transitions, to
//   video clip number indexes.
// 
// To run the script under Windows XP:
//
// 1. If necessary, edit the settings "mySettings" below.
//
// 2. Execute on the command line (substitute "this_file.js" accordingly):
//
//   cscript this_file.js
//
// Windows Script Host for Windows XP or compatible.
//
// Includes Doug Crockford's json2.js.
//
// See also the documentation of the source code for the Reality Builder
// version 1.4 or similar.

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
  regexp: true, plusplus: true, bitwise: true, browser: true */

/*global WScript, ActiveXObject, alert */

/*
    http://www.JSON.org/json2.js
    2011-02-23

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

var JSON;
if (!JSON) {
    JSON = {};
}

(function () {
    "use strict";

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                this.getUTCFullYear()     + '-' +
                f(this.getUTCMonth() + 1) + '-' +
                f(this.getUTCDate())      + 'T' +
                f(this.getUTCHours())     + ':' +
                f(this.getUTCMinutes())   + ':' +
                f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string' ? c :
                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' : gap ?
                    '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                    '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' : gap ?
                '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
                '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());


var myRotatedCollisionOffsetsListsBXY, mySettings, 

// Unique block configurations. Example:
//
// [
//     [[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0]],           // configuration 0
//     [[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0]], // configuration 1
//     ...
// ]
myConfigurations,

// Configuration sequence that can later be stepped through (e.g. in Rhino).
// Example:
//
// [
//     [[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0]],           // configuration 0
//     [[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,0,1,0]], // configuration 1
//     [[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0]],           // configuration 2
//     [[0,0,0,1],[1,0,0,0],[1,1,0,0],[0,2,0,0],[0,1,1,0]], // configuration 3
//     ...
// ]
//
// Note in the example that configurations 0 and 2 are identical. This is
// normal: After all, the transitions from configuration 0 to 1 and from 2 to 3
// are different. However, there are no duplicate transitions!
myConfigurationSequence,

// Maps from indexes in the configuration sequence to unique configurations.
// Example:
//
// [
//     5, // first configuration
//     7, // configuration after the first transition
//     3, // configuration after the second transition
//     ...
// ]
myConfigurationIndexes,

// Maps to the index of a video clip for the transition between a source and a
// destination configuration:
//
// * The index of the video clip is the same as the index of an entry in the
//   configuration sequence "myConfigurationSequence". This entry contains the
//   destination configuration, and the previous entry in the sequence contains
//   the source configuration.
//
// * It is assumed that there are only clips where the destination
//   configuration has exactly one additional block as compared to the source
//   configuration.
//
// * The sequence number 0 is missing: After all, there is no source
//   configuration associated with it.
myClipIndexesList;

// Writes all configurations into one file, in a Python compatible format
// useful for initializing the Google App Engine datastore.
function myWriteConfigurationsPy(fso) {
    var fileName, text, i, file;

    fileName = mySettings.outputDir + '\\configurations.py';

    file = fso.CreateTextFile(fileName, true);

    file.WriteLine('[');
    for (i = 0; i < myConfigurations.length; i += 1) {
        file.Write("'" + JSON.stringify(myConfigurations[i]) + "'");
        if (i < myConfigurations.length - 1) {
            file.WriteLine(',');
        }
    }
    file.WriteLine(']');

    file.Close();
}

// Returns true, iff "x" is an array.
function myIsArray(x) {
    return (typeof x === 'object') && (x instanceof Array);
}

// Returns the array "xs" as a Visual Basic Script string representation.
function myArrayAsVbs(xs) {
    var i, x, s, separator;

    s = 'Array(';
    separator = '';
    for (i = 0; i < xs.length; i += 1) {
        x = xs[i];
        s += separator;
        if (myIsArray(x)) {
            s += myArrayAsVbs(x);
        } else {
            s += x;
        }
        separator = ', ';
    }
    s += ')';

    return s;
}

// Writes the configuration sequence indexes into a JavaScript file.
function myWriteClipIndexesListJs(fso) {
    var fileName, i, file, writeComma, prevConfigurationIndex, clipIndexes;

    fileName = mySettings.outputDir + 
        '\\configuration_clip_indexes_list.js';

    file = fso.CreateTextFile(fileName, true);

    writeComma = false;

    file.WriteLine('{');
    for (prevConfigurationIndex in myClipIndexesList) {
        if (myClipIndexesList.hasOwnProperty(prevConfigurationIndex)) {
            clipIndexes = myClipIndexesList[prevConfigurationIndex];
            if (writeComma) {
                file.WriteLine(',');
            }
            file.Write('"' + prevConfigurationIndex + '":' + 
                       JSON.stringify(clipIndexes));
            writeComma = true;
        }
    }
    file.WriteLine('');
    file.WriteLine('}');

    file.Close();
}

// Writes configuration sequence into one file, in a Visual Basic Script
// compatible format. The configuration sequence is augmented with the indexes
// of the respective configurations in the list of unique configurations.
function myWriteConfigurationSequenceVbs(fso) {
    var fileName, text, i, file, index, configuration;

    fileName = mySettings.outputDir + '\\augmented_configuration_sequence.vbs';

    file = fso.CreateTextFile(fileName, true);

    file.WriteLine('Array( _');
    for (i = 0; i < myConfigurationSequence.length; i += 1) {
        index = myConfigurationIndexes[i];
        configuration = myConfigurationSequence[i];
        file.Write(myArrayAsVbs([index, configuration]));
        if (i < myConfigurationSequence.length - 1) {
            file.WriteLine(', _');
        }
    }
    file.WriteLine(')');

    file.Close();
}

// Writes configurations to files.
function myWrite() {
    var i, fso;

    fso = new ActiveXObject("Scripting.FileSystemObject");

    myWriteConfigurationsPy(fso);
    myWriteConfigurationSequenceVbs(fso);
    myWriteClipIndexesListJs(fso);

    WScript.StdOut.WriteLine('Number of configurations in sequence: ' + 
                             myConfigurationSequence.length);
    WScript.StdOut.WriteLine('Number of unique configurations: ' + 
                             myConfigurations.length);
}

// If possible, returns an array with the block space position and rotation
// angle for a block, that follows the position and rotation angle "positionA".
//
// Format of the array: xB, yB, zB, angle
//
// If no new position or angle is available, returns false.
function myNextPositionBAndAngle(positionBAndAngle) {
    var xB, yB, zB, a, minXB, maxXB, minYB, maxYB, minZB, maxZB;

    xB = positionBAndAngle[0];
    yB = positionBAndAngle[1];
    zB = positionBAndAngle[2];
    a = positionBAndAngle[3];

    minXB = mySettings.buildSpaceMinB[0];
    minYB = mySettings.buildSpaceMinB[1];
    minZB = mySettings.buildSpaceMinB[2];

    maxXB = mySettings.buildSpaceMaxB[0];
    maxYB = mySettings.buildSpaceMaxB[1];
    maxZB = mySettings.buildSpaceMaxB[2];

    // angle must be changed first - otherwise not all configurations will be
    // found:
    a += 1;
    if (a > 1) {
        a = 0;
        xB += 1;
        if (xB > maxXB) {
            xB = minXB;
            yB += 1;
            if (yB > maxYB) {
                yB = minYB;
                zB += 1;
                if (zB > maxZB) {
                    return false;
                }
            }
        }
    }

    return [xB, yB, zB, a];
}

// Returns the list of collision offsets, of block 2 relative to block 1.
function myRotatedCollisionOffsetsBXY(positionBAndAngle1, positionBAndAngle2) {
    var collisionOffsetsListBXY, a1, a2, relativeA;

    a1 = positionBAndAngle1[3];
    a2 = positionBAndAngle2[3];

    collisionOffsetsListBXY = myRotatedCollisionOffsetsListsBXY[a1 % 4];

    relativeA = (2 + a2 - a1) % 2;

    return collisionOffsetsListBXY[relativeA];
}

function myPointsIdenticalB(p1B, p2B) {
    return ((p1B[0] - p2B[0]) === 0 &&
            (p1B[1] - p2B[1]) === 0 &&
            (p1B[2] - p2B[2]) === 0);
}

function myPositionBAndAngleAreIdentical(positionBAndAngle1, 
                                         positionBAndAngle2)
{
    return (myPointsIdenticalB(positionBAndAngle1, positionBAndAngle2) &&
            positionBAndAngle1[3] === positionBAndAngle2[3]);
}

// Returns true, iff the blocks 1 and 2 collide.
function myBlocksCollide(positionBAndAngle1, positionBAndAngle2) {
    var testPositionB, collisionOffsetsBXY, collisionOffsetBXY, i,
    x1B, y1B, z1B;

    collisionOffsetsBXY = myRotatedCollisionOffsetsBXY(positionBAndAngle1, 
                                                       positionBAndAngle2);

    x1B = positionBAndAngle1[0];
    y1B = positionBAndAngle1[1];
    z1B = positionBAndAngle1[2];

    for (i = 0; i < collisionOffsetsBXY.length; i += 1) {
        collisionOffsetBXY = collisionOffsetsBXY[i];
        testPositionB = [x1B + collisionOffsetBXY[0],
                         y1B + collisionOffsetBXY[1],
                         z1B];
        if (myPointsIdenticalB(positionBAndAngle2, testPositionB)) {
            return true;
        }
    }
    
    return false;
}

// Returns true, iff the block with the block space position and angle
// "positionBAndAngle" collides with the configuration "configuration" of
// blocks.
function myCollidesWithConfiguration(positionBAndAngle, configuration) {
    var i;

    for (i = 0; i < configuration.length; i += 1) {
        if (myBlocksCollide(positionBAndAngle, configuration[i])) {
            return true;
        }
    }

    return false;
}

// Returns the block space positions of the top of the two halves of the block
// described by "positionBAndAngle".
//
// +-+-+
// |0|1|
// *-*-+
//
// +-+
// |1|
// *-+
// |0|
// *-+
function myTopPositionsB(positionBAndAngle) {
    var topPositionB1, topPositionB2, xB, yB, zB, a;

    xB = positionBAndAngle[0];
    yB = positionBAndAngle[1];
    zB = positionBAndAngle[2];
    a = positionBAndAngle[3];
    
    if (a === 0) {
        topPositionB1 = [xB, yB, zB];
        topPositionB2 = [xB + 1, yB, zB];
    } else {
        topPositionB1 = [xB, yB, zB];
        topPositionB2 = [xB, yB + 1, zB];
    }

    return [topPositionB1, topPositionB2];
}

// Returns block space positions of the bottom of the two halves of the block
// described by "positionBAndAngle". They are exactly below the positions on
// the top.
function myBottomPositionsB(positionBAndAngle) {
    var topPositionsB;

    topPositionsB = myTopPositionsB(positionBAndAngle);

    return [[topPositionsB[0][0], 
             topPositionsB[0][1], 
             topPositionsB[0][2] - 1],
            [topPositionsB[1][0], 
             topPositionsB[1][1], 
             topPositionsB[1][2] - 1]];
}

// If it exists in the block configuration "configuration", returns the
// position and angle of the block where one half of its top is exactly at the
// position B. If such a block doesn't exist, returns false.
function myPositionBAndAngleOfBlockWithTopAt(positionB, configuration) {
    var i, positionAndAngleB, topPositionsB;

    for (i = 0; i < configuration.length; i += 1) {
        positionAndAngleB = configuration[i];
        topPositionsB = myTopPositionsB(positionAndAngleB);

        if (myPointsIdenticalB(positionB, topPositionsB[0]) ||
            myPointsIdenticalB(positionB, topPositionsB[1])) {
            return positionAndAngleB;
        }
    }

    return false;
}

// Returns true, iff the described blocks are identical.
function myBlocksAreIdentical(positionBAndAngle1, positionBAndAngle2) {
    return (myPointsIdenticalB(positionBAndAngle1, 
                               positionBAndAngle2) &&
            positionBAndAngle1[3] === positionBAndAngle2[3]);
}

// Returns true, iff the block sits on exactly two blocks.
function myAttachesToBlocksBelow(positionBAndAngle, configuration) {
    var bottomPositionsB, xB, yB, zB, a, 
    positionBAndAngle1, positionBAndAngle2;

    bottomPositionsB = myBottomPositionsB(positionBAndAngle);

    positionBAndAngle1 = 
        myPositionBAndAngleOfBlockWithTopAt(bottomPositionsB[0], 
                                            configuration);
    if (positionBAndAngle1 === false) {
        return false;
    } else {
        positionBAndAngle2 = 
            myPositionBAndAngleOfBlockWithTopAt(bottomPositionsB[1],
                                                configuration);
        if (positionBAndAngle2 === false) {
            return false;
        } else {
            return !myBlocksAreIdentical(positionBAndAngle1, 
                                         positionBAndAngle2);
        }
    }
}

// Returns true, iff the block with the block space position and angle
// "positionBAndAngle" attaches to the ground plane.
function myAttachesToGround(positionBAndAngle) {
    return (positionBAndAngle[2] === 0);
}

// Returns true, iff the block with the block space position and angle
// "positionBAndAngle" attaches to the configuration "configuration" of blocks.
//
// Cases where the block attaches to the configuration:
//
// * It attaches to the ground plane.
//
// * The block sits on exactly two blocks.
function myAttachesToConfiguration(positionBAndAngle, configuration) {
    return (myAttachesToGround(positionBAndAngle) ||
            myAttachesToBlocksBelow(positionBAndAngle, configuration));
}

// Returns true, iff the described block is in the configuration
// "configuration".
function myIsInConfiguration(positionBAndAngle, configuration) {
    var i, positionBAndAngle2;

    for (i = 0; i < configuration.length; i += 1) {
        positionBAndAngle2 = configuration[i];
        if (myPositionBAndAngleAreIdentical(positionBAndAngle, 
                                            positionBAndAngle2)) {
            return true;
        }
    }
    return false;
}

// Returns true, iff both configurations are identical.
function myConfigurationsAreIdentical(configuration1, configuration2) {
    var i, positionBAndAngle;

    if (configuration1.length === configuration2.length) {
        for (i = 0; i < configuration1.length; i += 1) {
            positionBAndAngle = configuration1[i];
            if (!myIsInConfiguration(positionBAndAngle, configuration2)) {
                return false;
            }
        }
        return true;
    } else {
        return false;
    }
}

// Returns true, if the block configuration "cnfiguration1" has one block
// added as compared the configuration "configuration2":
function myHasOneBlockAdded(configuration1, configuration2) {
    var i, positionBAndAngle;

    if (configuration1.length + 1 === configuration2.length) {
        for (i = 0; i < configuration1.length; i += 1) {
            positionBAndAngle = configuration1[i];
            if (!myIsInConfiguration(positionBAndAngle, configuration2)) {
                return false;
            }
        }
        return true;
    } else {
        return false;
    }
}

// If the configuration "configuration" is in the array of configurations
// "configurations", then returns its index in that array. Otherwise, returns
// false.
function myIndexInConfigurations(configuration, configurations) {
    var i;

    for (i = 0; i < configurations.length; i += 1) {
        if (myConfigurationsAreIdentical(configuration, configurations[i])) {
            return i;
        }
    }

    return false;
}

// Returns true, iff the configuration "configuration" has already been used as
// the base of more configurations.
function myHasBeenBaseConfiguration(configuration, configurationsSoFar) {
    return myIndexInConfigurations(configuration, 
                                   configurationsSoFar) !== false;
}

// Returns true, iff the block described by "positionBAndAngle" can be added to
// the configuration, i.e. if it is attachable and if it doesn't collide with
// another block.
function myCanBeAddedToConfiguration(positionBAndAngle, configuration) {
    return (!myCollidesWithConfiguration(positionBAndAngle, configuration) &&
            myAttachesToConfiguration(positionBAndAngle, configuration));
}

// Returns the position/angle for the first block in the build space.
function myStartPositionBAndAngle() {
    return [mySettings.buildSpaceMinB[0], 
            mySettings.buildSpaceMinB[1], 
            mySettings.buildSpaceMinB[2], 
            0];
}

// Makes sure that the "configuration" is in the list of unique configurations.
// Returns the index of the configuration in that list.
function myAddToConfigurations(configuration) {
    var i = myIndexInConfigurations(configuration, myConfigurations);

    if (i === false) {
        myConfigurations.push(configuration);
        return myConfigurations.length - 1;
    } else {
        return i;
    }
}

function myAddToClipIndexesList(configurationSequenceIndex,
                                configurationIndex,
                                prevConfigurationIndex)
{
    if (!(prevConfigurationIndex in myClipIndexesList)) {
        myClipIndexesList[prevConfigurationIndex] = {};
    }

    myClipIndexesList[prevConfigurationIndex][configurationIndex] =
        configurationSequenceIndex;
}

function myAddToConfigurationSequence(configurationSequence, configuration) {
    var 
    configurationSequenceIndex, configurationIndex, 
    prevConfiguration, prevConfigurationIndex;

    configurationSequenceIndex = 
        configurationSequence.push(configuration) - 1;
    configurationIndex = myAddToConfigurations(configuration);

    myConfigurationIndexes.push(configurationIndex);

    if (configurationSequenceIndex > 0) {
        prevConfiguration = 
            configurationSequence[configurationSequenceIndex - 1];
        if (myHasOneBlockAdded(prevConfiguration, configuration)) {
            prevConfigurationIndex = 
                myIndexInConfigurations(prevConfiguration, myConfigurations);
            myAddToClipIndexesList(configurationSequenceIndex,
                                   configurationIndex,
                                   prevConfigurationIndex);
        }
    }
}

// Add new configurations to "configurationSequence" and returns the result.
//
// * The new configurations are based on the configuration "baseConfiguration".
//
// * The returned configurations form a sequence which includes all possible
//   transitions between configurations. Therefore individual configurations
//   may appear more than once. Example:
//
//   ......    +-+...    +-++-+    ......    ...+-+    +-++-+
//   . .. . -> | |  . -> | || | -> . .. . -> . .| | -> | || |
//   ......    +-+...    +-++-+    ......    ...+-+    +-++-+
//
// * If the configuration "baseConfiguration" has already been used as a base
//   configuration, then it is not used again as a base configuration.
//   Rationale: Otherwise there would be duplicate sequences.
function myAddConfigurationSequence(baseConfiguration, configurationSequence) {
    var newConfiguration, newConfigurations, positionBAndAngle, i,
    initLength;

    initLength = configurationSequence.length;

    if (!myHasBeenBaseConfiguration(baseConfiguration, 
                                    configurationSequence)) {

        positionBAndAngle = myStartPositionBAndAngle();
        while (positionBAndAngle !== false) {
            if (myCanBeAddedToConfiguration(positionBAndAngle, 
                                            baseConfiguration)) {

                newConfiguration = 
                    baseConfiguration.concat([positionBAndAngle]);

                positionBAndAngle = myNextPositionBAndAngle(positionBAndAngle);

                myAddToConfigurationSequence(configurationSequence,
                                             baseConfiguration);
                configurationSequence = 
                    myAddConfigurationSequence(newConfiguration, 
                                               configurationSequence);
            } else {
                positionBAndAngle = myNextPositionBAndAngle(positionBAndAngle);
            }
        }

        if (initLength === configurationSequence.length) {
            // base configuration not yet added
            myAddToConfigurationSequence(configurationSequence,
                                         baseConfiguration);
        }
    } else {
        myAddToConfigurationSequence(configurationSequence,
                                     baseConfiguration);
    }

    return configurationSequence;
}

// Calculates the configuration sequence, which also updates the list of unique
// configurations.
function myCalculate() {
    myConfigurations = [];
    myConfigurationIndexes = [];
    myClipIndexesList = {};
    myConfigurationSequence = 
        myAddConfigurationSequence(mySettings.baseConfiguration, []);
}

// Two blocks 1 and 2 are defined to collide, iff block 2 is offset against
// block 1 in the block space x-y-plane by any of the following values.
//
// Indexes of the outer array:
//
// * 0: rotation of block 1 by 0°
//
// * 1: rotation of block 1 by 90°
//
// Indexes of the arrays within the outer array:
//
// * 0: rotation of block 2 by 0° relative to block 1
//
// * 1: rotation of block 2 by 90° relative to block 1
myRotatedCollisionOffsetsListsBXY =
    [[[[-1, 0], [0, 0], [1, 0]],
      [[0, 0], [1, 0], [0, -1], [1, -1]]],
     [[[0, -1], [0, 0], [0, 1]], 
      [[-1, 0], [-1, 1], [0, 0], [0, 1]]]];

mySettings = {
    // Directory where output is written:
    outputDir: 'c:\\temp\\calculate',

    // The points define the rectangle which represents the space in which the
    // block may be built. All coordinates in the first point must be equal to
    // or smaller than the corresponding ones in the second point.
    //
    // To keep the combination algorithm simple and fast, the points are the
    // same for both possible rotations of a block. Therefore the build space
    // must be chosen intelligently, and large enough.
    buildSpaceMinB: [0, 0, 1],
    buildSpaceMaxB: [2, 3, 2],

    // Base configuration, to which blocks are added. First index: block id
    // (layer number - 1). Second index: xB, yB, zB, angle/90° (block space
    // coordinates).
    baseConfiguration: [[0, 0, 0, 1],
                        [1, 0, 0, 0],
                        [1, 1, 0, 0],
                        [0, 2, 0, 0]]
};

myCalculate();
myWrite();
