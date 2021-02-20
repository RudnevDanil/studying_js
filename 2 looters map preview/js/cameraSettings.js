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

function loadCameraSettings()
{
    $.get('php/loadCamSettings.php', {login: login, pass: pass}, function (result) {
        result = $.parseJSON(result);
        if(result.answer === "done")
        {
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
        }
        else
            console.log("Loading camera settings error")
        actions_map.reDrawCNVS();
    });
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
    //let login = document.getElementById(authFunct.ids.login).value.trim();
    //let pass = document.getElementById(authFunct.ids.pass).value.trim();
    let login = 'admin', pass = '111'; // debug

    $(butId).removeClass('butNoFrame').addClass('butFrame');
    $(imgId).removeClass('imgNoFrame').addClass('imgFrame');
    $(butId).removeClass('butRedBorder').removeClass('butGreenBorder').addClass('butYellowBorder');
    $(butId).removeClass('allowedToTouch').addClass('notAllowedToTouch');
    camSetData.savingInProgress = true;

    $.post('php/saveCamSettings.php', {login: login, pass: pass, arr: camSetData.arr}, function (result)
    {
        console.log(result)
        if(result !== "")
        {
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