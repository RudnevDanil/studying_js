/*---------------------------- MENU --------------------------------------------*/
function initZIndexForDisplay()
{
    document.getElementById("mapScreen").style.zIndex = "1";
    document.getElementById("camerasScreen").style.zIndex = "1";
    document.getElementById("cameraSettingsScreen").style.zIndex = "1";
    document.getElementById("aboutProjectScreen").style.zIndex = "1";
}

function initializeFontColorForDisplay()
{
    document.getElementById("menuMap").style.color = "honeydew";
    document.getElementById("menuCameras").style.color = "honeydew";
    document.getElementById("menuCameraSettings").style.color = "honeydew";
    document.getElementById("menuAboutProject").style.color = "honeydew";
}

function mapClicked()
{
    initZIndexForDisplay()
    document.getElementById("mapScreen").style.zIndex = "2";
    initializeFontColorForDisplay()
    document.getElementById("menuMap").style.color = "black";
}

function camerasClicked()
{
    initZIndexForDisplay()
    document.getElementById("camerasScreen").style.zIndex = "2";
    initializeFontColorForDisplay()
    document.getElementById("menuCameras").style.color = "black";
}

function cameraSettingsClicked()
{
    initZIndexForDisplay()
    document.getElementById("cameraSettingsScreen").style.zIndex = "2";
    initializeFontColorForDisplay()
    document.getElementById("menuCameraSettings").style.color = "black";
}

function aboutProjectClicked()
{
    initZIndexForDisplay()
    document.getElementById("aboutProjectScreen").style.zIndex = "2";
    initializeFontColorForDisplay()
    document.getElementById("menuAboutProject").style.color = "black";
}

/*---------------------------- MAP --------------------------------------------*/

/*---------------------------- CAMERA --------------------------------------------*/
function initCameraBlocks()
{
    for(let i = 1; i <= 4; i++)
    {
        document.getElementById("cameraBlock_" + i).style.w = "0";
        document.getElementById("cameraBlock_" + i).className = "cameraBlock";
        document.getElementById("placeholder_" + i).className = "";
    }
}

function switchDisplayAmountCamerasTo_1()
{
    initCameraBlocks();
    document.getElementById("cameraBlock_1").className += " ";
    document.getElementById("cameraBlock_1").className += "amountCameras_1";
    document.getElementById("placeholder_1").className = "testInside_1";
}

function switchDisplayAmountCamerasTo_2()
{
    initCameraBlocks();
    for(let i = 1; i <= 4; i+=2)
    {
        document.getElementById("cameraBlock_" + i).className += " ";
        document.getElementById("cameraBlock_" + i).className += "amountCameras_2";
        document.getElementById("placeholder_" + i).className = "testInside_2_4";
    }
}

function switchDisplayAmountCamerasTo_4()
{
    initCameraBlocks();
    for(let i = 1; i <= 4; i++)
    {
        document.getElementById("cameraBlock_" + i).className += " ";
        document.getElementById("cameraBlock_" + i).className += "amountCameras_4";
        document.getElementById("placeholder_" + i).className = "testInside_2_4";
    }
}

/*---------------------------- CAMERA SETTINGS --------------------------------------------*/

function switchDisplayToUniSet()
{
    document.getElementById("streamSet").style.zIndex = "0";
    document.getElementById("uniSet").style.zIndex = "2";
}

function switchDisplayToStreamSet()
{
    document.getElementById("uniSet").style.zIndex = "0";
    document.getElementById("streamSet").style.zIndex = "2";
}

function switchDisplaySettingsToNextPage()
{
    document.getElementById("streamSetFirstPage").style.zIndex = "0";
    document.getElementById("streamSetSecondPage").style.zIndex = "2";
}

function switchDisplaySettingsToPrevPage()
{
    document.getElementById("streamSetSecondPage").style.zIndex = "0";
    document.getElementById("streamSetFirstPage").style.zIndex = "2";
}

/*---------------------------- ABOUT PROJECT --------------------------------------------*/