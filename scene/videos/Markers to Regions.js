// Creates regions based on markers, labeled "start", "end". And deletes the
// markers.
//
// 2011, Felix E. Klee <felix.klee@inka.de>

import System;
import System.IO;
import System.Windows.Forms;
import Sony.Vegas;

var mySettings = {
    // padding before and after markers, to make regions longer:
    padding: 2000 // ms
};

function myDeleteAllMarkers() {
    Vegas.Project.Markers.Clear();
}

function myDeleteAllRegions() {
    Vegas.Project.Regions.Clear();
}

function myCreateRegion(startMarker, endMarker) {
    var region, startPosition, endPosition, length;

    startPosition = startMarker.Position;
    endPosition = endMarker.Position;
    length = endPosition - startPosition;

    region = new Region(startPosition, length);

    Vegas.Project.Regions.Add(region);
}

function myCreateRegions() {
    var marker, markers, lastStartMarker;

    myDeleteAllRegions();
    
    markers = new Enumerator(Vegas.Project.Markers);
    lastStartMarker = null;
    while (!markers.atEnd()) {
        marker = Marker(markers.item());
        if (marker.Label === 'end') {
            if (lastStartMarker !== null) {
                myCreateRegion(lastStartMarker, marker);
            }
        } else if (marker.Label === 'start') {
            lastStartMarker = marker;
        } else {
            throw "unknown label";
        }
        markers.moveNext();
    }

    myDeleteAllMarkers();
}

try {
    myCreateRegions();
} catch (e) {
    MessageBox.Show(e);
}
