/*---------------------------- MENU --------------------------------------------*/
let ids = {
    screen: {
        map: "mapScreen",
        cameras: "camerasScreen",
        cameraSettings: "cameraSettingsScreen",
        aboutProject: "aboutProjectScreen",
        faces: "facesScreen",
        staff: "staffScreen",
        auth: "authScreen",
    },
    menu: {
        map: "menuMap",
        cameras: "menuCameras",
        cameraSettings: "menuCameraSettings",
        aboutProject: "menuAboutProject",
        faces: "menuFaces",
        staff: "menuStaff",
        auth: "menuAuth",
    },
}

function initZIndexForDisplay()
{
    document.getElementById(ids.screen.map).style.zIndex = "1";
    document.getElementById(ids.screen.cameras).style.zIndex = "1";
    document.getElementById(ids.screen.cameraSettings).style.zIndex = "1";
    document.getElementById(ids.screen.aboutProject).style.zIndex = "1";
    document.getElementById(ids.screen.faces).style.zIndex = "1";
    document.getElementById(ids.screen.staff).style.zIndex = "1";
    document.getElementById(ids.screen.auth).style.zIndex = "1";
}

function initializeFontColorForDisplay()
{
    document.getElementById(ids.menu.map).style.color = "honeydew";
    document.getElementById(ids.menu.cameras).style.color = "honeydew";
    document.getElementById(ids.menu.cameraSettings).style.color = "honeydew";
    document.getElementById(ids.menu.aboutProject).style.color = "honeydew";
    document.getElementById(ids.menu.faces).style.color = "honeydew";
    document.getElementById(ids.menu.staff).style.color = "honeydew";
    document.getElementById(ids.menu.auth).style.color = "honeydew";
}

function menuClicked(i)
{
    if(!authFunct.isAuthorized)
        return;
    let screen = "", menu = "";

    let login = 'admin', pass = '111'; // debug

    switch(i){
        case 1:
            screen = ids.screen.map;
            menu = ids.menu.map;

            // loading objects if it's not loaded before
            //...
            mapObjects = [];

            $.get('php/loadMap.php', {login: login, pass: pass}, function (result) {
                result = $.parseJSON(result);
                if(result.answer === "done")
                {
                    for(let k = 0; k < result.arr.length; k++)
                    {
                        mapObjects.push({
                            x: result.arr[k][1],
                            y: result.arr[k][2],
                            w: result.arr[k][3],
                            h: result.arr[k][4],
                            r: result.arr[k][5],
                            //d: result.arr[k][6],
                            type: mapObjTypes[result.arr[k][0]],
                        });
                    }
                }
                else
                    console.log("Loading map error")
                actions_map.reDrawCNVS();
            });
            break;
        case 2:
            screen = ids.screen.cameras;
            menu = ids.menu.cameras;
            break;
        case 3:
            screen = ids.screen.cameraSettings;
            menu = ids.menu.cameraSettings;

            console.log("----")
            $.get('php/loadCamSettings.php', {login: login, pass: pass}, function (result) {
                result = $.parseJSON(result);
                if(result.answer === "done")
                {
                    console.log(result.arr)

                    let amountCam = result.arr.length
                    $("#" + camSetIds.data.uni[0]).val(amountCam)
                    camSetData.arr = [];
                    let listId = "#" + camSetIds.data.stream[0];
                    $(listId).empty();
                    if(amountCam > 0)
                    {
                        for(let i = 0; i < amountCam; i++)
                        {
                           let arr = [];
                            arr.push(parseInt(result.arr[i][0]))
                            arr.push(result.arr[i][1])
                            arr.push(result.arr[i][2])
                            for(let k = 3; k <= 6; k++)
                                arr.push(parseInt(result.arr[i][k]))
                            arr.push(parseFloat(result.arr[i][7]))
                            camSetData.arr.push(arr)

                            // сделать список для выбора камеры по cam_code
                            $(listId).append('<option value="'+(i+1)+'">'+(i+1)+'</option>');
                        }

                        // вызов функции заполнения полей по первой камере
                        fillCamSetFields(camSetData.arr[0])
                    }
                    /*
                    camSetData.arr = [];
                    let listId = "#" + camSetIds.data.stream[0];
                    $(listId).empty();

                    if(amountCam > 0)
                    {
                        for(let i = 0; i < amountCam; i++)
                        {
                            camSetData.arr.push([i, "", "", 0, 0, 25, 25000, 1.0])

                            // сделать список для выбора камеры по i
                            $(listId).append('<option value="'+(i+1)+'">'+(i+1)+'</option>');
                        }

                        // вызов функции заполнения полей по первой камере
                        fillCamSetFields(camSetData.arr[0])
                    }
                    * */







                }
                else
                    console.log("Loading camera settings error")
                actions_map.reDrawCNVS();
            });

            break;
        case 4:
            screen = ids.screen.aboutProject;
            menu = ids.menu.aboutProject;
            break;
        case 5:
            screen = ids.screen.faces;
            menu = ids.menu.faces;
            break;
        case 6:
            screen = ids.screen.staff;
            menu = ids.menu.staff;
            break;
        case 7:
            screen = ids.screen.auth;
            menu = ids.menu.auth;
            break;
    }
    initZIndexForDisplay()
    document.getElementById(screen).style.zIndex = "2";
    initializeFontColorForDisplay()
    document.getElementById(menu).style.color = "black";
}

/*---------------------------- AUTH --------------------------------------------*/

function newUserClicked()
{
    if(!document.getElementById("authNewUserButt").classList.replace('notChecked', 'checked'))
        document.getElementById("authNewUserButt").classList.replace('checked', 'notChecked')
}

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

let camSetIds =
{
    uniSetBut: "CamSetUniSetBut",
    uniSetImg: "CamSetUniSetImg",
    streamSetBut: "CamSetStreamSetBut",
    streamSetImg: "CamSetStreamSetImg",
    saveBut: "CamSetSaveBut",
    saveImg: "CamSetSaveImg",
    data: {
        uni: [
            "uniSetAmountOfCam",
        ],
        stream: [
            "streamSetCamNumb",
            "streamSetDescription",
            "streamSetConnectingLine",
            "streamSetSavingSkipFrames",
            "streamSetClassificationSkipFrames",
            "streamSetFPS",
            "streamSetFramesInOneVideo",
            "streamSetScaling",
        ],
    },
}

let camSetData =
{
    savingInProgress: false,
    arr: [],
}

function fillCamSetFields(arr /*[camN, description, connLine, savingSkipFr, classSkipFr, camFPS, frInOneAvi, scaling]*/)
{
    $("#" + camSetIds.data.stream[0] + " option[value="+camSetIds.data.stream[0]+"]").attr("selected", "selected");
    for(let i = 1; i < camSetIds.data.stream.length; i++)
    {
        $("#" + camSetIds.data.stream[i]).val(arr[i]);
    }
}

function amountOfCamChanged()
{
    let amountCam = $("#" + camSetIds.data.uni[0]).val();

    amountCam = parseInt(amountCam);
    if(isNaN(amountCam)) return;
    camSetData.arr = [];
    let listId = "#" + camSetIds.data.stream[0];
    $(listId).empty();

    if(amountCam > 0)
    {
        for(let i = 0; i < amountCam; i++)
        {
            camSetData.arr.push([i, "", "", 0, 0, 25, 25000, 1.0])

            // сделать список для выбора камеры по i
            $(listId).append('<option value="'+(i+1)+'">'+(i+1)+'</option>');
        }

        // вызов функции заполнения полей по первой камере
        fillCamSetFields(camSetData.arr[0])
    }
}

function camSettingsStreamChanged(i)
{
    let val = $("#" + camSetIds.data.stream[i]).val();

    let streamNumb = $("#" + camSetIds.data.stream[0]).val() - 1;
    if(i === 0)
    {
        fillCamSetFields(camSetData.arr[streamNumb])
    }
    else if (i <= 2)
    {
        camSetData.arr[streamNumb][i] = val;
    }
    else if (i <= 6)
    {
        if(isNaN(parseInt(val))) return;
        camSetData.arr[streamNumb][i] = parseInt(val);
    }
    else if (i === 7)
    {
        if(isNaN(parseFloat(val))) return;
        camSetData.arr[streamNumb][i] = parseFloat(val);
    }
}

function switchDisplayToUniSet()
{
    document.getElementById("streamSet").style.zIndex = "0";
    document.getElementById("uniSet").style.zIndex = "2";

    $('#' + camSetIds.uniSetBut).removeClass('butNoFrame').addClass('butFrame');
    $('#' + camSetIds.uniSetImg).removeClass('imgNoFrame').addClass('imgFrame');

    $('#' + camSetIds.streamSetBut).removeClass('butFrame').addClass('butNoFrame');
    $('#' + camSetIds.streamSetImg).removeClass('imgFrame').addClass('imgNoFrame');
}

function switchDisplayToStreamSet()
{
    document.getElementById("uniSet").style.zIndex = "0";
    document.getElementById("streamSet").style.zIndex = "2";

    $('#' + camSetIds.uniSetBut).removeClass('butFrame').addClass('butNoFrame');
    $('#' + camSetIds.uniSetImg).removeClass('imgFrame').addClass('imgNoFrame');

    $('#' + camSetIds.streamSetBut).removeClass('butNoFrame').addClass('butFrame');
    $('#' + camSetIds.streamSetImg).removeClass('imgNoFrame').addClass('imgFrame');
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

function saveCamSettings()
{
    let butId = '#' + camSetIds.saveBut;
    let imgId = '#' + camSetIds.saveImg;

    // сохранение настроек камеры
    let login = document.getElementById(authFunct.ids.login).value.trim();
    let pass = document.getElementById(authFunct.ids.pass).value.trim();
    //let login = 'admin', pass = '111'; // debug

    $(butId).removeClass('butNoFrame').addClass('butFrame');
    $(imgId).removeClass('imgNoFrame').addClass('imgFrame');
    $(butId).removeClass('butRedBorder').removeClass('butGreenBorder').addClass('butYellowBorder');
    $(butId).removeClass('allowedToTouch').addClass('notAllowedToTouch');
    camSetData.savingInProgress = true;

    $.post('php/saveCamSettings.php', {login: login, pass: pass, arr: camSetData.arr}, function (result)
    {
        if(result !== "")
        {
            console.log(result)
            result = $.parseJSON(result);
            if(result.answer === "saving success")
                $(butId).removeClass('butRedBorder').removeClass('butYellowBorder').addClass('butGreenBorder');
            else
                $(butId).removeClass('butGreenBorder').removeClass('butYellowBorder').addClass('butRedBorder');
        }
        else
            $(butId).removeClass('butGreenBorder').removeClass('butYellowBorder').addClass('butRedBorder');
        $(butId).removeClass('notAllowedToTouch').addClass('allowedToTouch');
        setTimeout(() => {
            $(butId).removeClass('butFrame').addClass('butNoFrame');
            $(imgId).removeClass('imgFrame').addClass('imgNoFrame');
            $(butId).removeClass('butGreenBorder').removeClass('butYellowBorder').removeClass('butRedBorder');
            camSetData.savingInProgress = false;
        }, 3000);
    });
}

/*---------------------------- ABOUT PROJECT --------------------------------------------*/

/*---------------------------- FACES --------------------------------------------*/

/*---------------------------- STAFF --------------------------------------------*/

let actions_staff = {
    addShow()
    {
        document.getElementById("staffListPage").style.zIndex = "0";
        document.getElementById("staffAddPage").style.zIndex = "2";
    },

    listShow()
    {
        document.getElementById("staffAddPage").style.zIndex = "0";
        document.getElementById("staffListPage").style.zIndex = "2";
    },

    nextListShow() {document.getElementById("staffListNextButt").style.zIndex = "2";},
    nextListHide() {document.getElementById("staffListNextButt").style.zIndex = "0";},
    prevListShow() {document.getElementById("staffListPrevButt").style.zIndex = "2";},
    prevListHide() {document.getElementById("staffListPrevButt").style.zIndex = "0";},

    nextAddShow() {document.getElementById("staffAddNextButt").style.zIndex = "2";},
    nextAddHide() {document.getElementById("staffAddNextButt").style.zIndex = "0";},
    prevAddShow() {document.getElementById("staffAddPrevButt").style.zIndex = "2";},
    prevAddHide() {document.getElementById("staffAddPrevButt").style.zIndex = "0";},

    removeAddShow() {document.getElementById("staffAddRemoveUserButt").style.zIndex = "2";},
    removeAddHide() {document.getElementById("staffAddRemoveUserButt").style.zIndex = "0";},


}


