// Enlarges regions using a specified amount of padding before and after.
//
// Edit "mySettings" below as needed.
//
// 2011, Felix E. Klee <felix.klee@inka.de>

import System;
import System.IO;
import System.Windows.Forms;
import Sony.Vegas;

var mySettings = {
    // padding to be inserted before and after an existing region:
    padding: 2000 // ms
};

function myPadRegion(region) {
    var startPosition, endPosition, length, padding;

    padding = Timecode.FromMilliseconds(mySettings.padding);

    region.Position = region.Position - padding;
    region.Length = region.Length + padding + padding;
}

function myPadRegions() {
    var region, regions;

    regions = new Enumerator(Vegas.Project.Regions);
    while (!regions.atEnd()) {
        region = Region(regions.item());
        myPadRegion(region);
        regions.moveNext();
    }
}

try {
    myPadRegions();
} catch (e) {
    MessageBox.Show(e);
}
