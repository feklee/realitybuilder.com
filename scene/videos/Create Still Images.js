// Creates snapshots at the beginning and end of regions, and saves them to
// disk.
//
// 2011, Felix E. Klee <felix.klee@inka.de>

import System;
import System.IO;
import System.Windows.Forms;
import Sony.Vegas;

function mySettings() {
    return {
        renderQuality: Vegas.Project.Preview.RenderQuality,
        fullSize: Vegas.Project.Preview.FullSize,
        fieldOrder: Vegas.Project.Video.FieldOrder,
        deinterlaceMethod: Vegas.Project.Video.DeinterlaceMethod
    }
}

function mySetSettings(settings) {
    Vegas.Project.Preview.RenderQuality = settings.renderQuality;
    Vegas.Project.Preview.FullSize = settings.fullSize;
    Vegas.Project.Video.FieldOrder = settings.fieldOrder
    Vegas.Project.Video.DeinterlaceMethod = settings.deinterlaceMethod;
}

// Sets settings with which snapshots turn out nice.
function mySetSnapshotSettings() {
    mySetSettings({
        renderQuality: VideoRenderQuality.Best,
        fullSize: true,
        fieldOrder: VideoFieldOrder.ProgressiveScan,
        deinterlaceMethod: VideoDeinterlaceMethod.InterpolateFields
    });
}

function myCreateSnapshot(baseFileName, seekTime) {
    Vegas.SaveSnapshot(baseFileName + '.jpg', ImageFileFormat.JPEG, seekTime);
}

function myCreateStillImagesOfRegion(baseFileName, region) {
    var baseFileName2;

    baseFileName2 = baseFileName + region.Label;

    myCreateSnapshot(baseFileName2 + '_start', region.Position);
    myCreateSnapshot(baseFileName2 + '_end', region.End);
}

function myCreateStillImagesOfRegions(baseFileName) {
    var origSettings, region, regions;

    origSettings = mySettings();
    mySetSnapshotSettings();

    regions = new Enumerator(Vegas.Project.Regions);
    while (!regions.atEnd()) {
        region = Region(regions.item());
        myCreateStillImagesOfRegion(baseFileName, region);
        regions.moveNext();
    }

    mySetSettings(origSettings);
}

// Lets the user select the base file name for saving the snapshots.
// On success, returns the base file name. Otherwise returns null.
function myBaseFileNameDialog() {
    var dialog;

    dialog = new SaveFileDialog(); 
    dialog.Title = "Base file name";
    dialog.CheckPathExists = true;
    dialog.AddExtension = false; 

    if (dialog.ShowDialog() == DialogResult.OK) {
        return Path.GetFullPath(dialog.FileName);
    } else {
        return null;
    }
}

function myCreateStillImages() {
    var baseFileName;

    baseFileName = myBaseFileNameDialog();
    if (baseFileName !== null) {
        myCreateStillImagesOfRegions(baseFileName);
    }
}

try {
    myCreateStillImages();
} catch (e) { 
    MessageBox.Show(e); 
} 
