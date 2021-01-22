/*---------------------------- MENU --------------------------------------------*/
let ids = {
    screen: {
        map: "mapScreen",
        cameras: "camerasScreen",
        cameraSettings: "cameraSettingsScreen",
        aboutProject: "aboutProjectScreen",
        faces: "facesScreen",
        staff: "staffScreen",
    },
    menu: {
        map: "menuMap",
        cameras: "menuCameras",
        cameraSettings: "menuCameraSettings",
        aboutProject: "menuAboutProject",
        faces: "menuFaces",
        staff: "menuStaff",
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
}

function initializeFontColorForDisplay()
{
    document.getElementById(ids.menu.map).style.color = "honeydew";
    document.getElementById(ids.menu.cameras).style.color = "honeydew";
    document.getElementById(ids.menu.cameraSettings).style.color = "honeydew";
    document.getElementById(ids.menu.aboutProject).style.color = "honeydew";
    document.getElementById(ids.menu.faces).style.color = "honeydew";
    document.getElementById(ids.menu.staff).style.color = "honeydew";
}

function menuClicked(i)
{
    let screen = "", menu = "";
    switch(i){
        case 1:
            screen = ids.screen.map;
            menu = ids.menu.map;
            break;
        case 2:
            screen = ids.screen.cameras;
            menu = ids.menu.cameras;
            break;
        case 3:
            screen = ids.screen.cameraSettings;
            menu = ids.menu.cameraSettings;
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
    }
    initZIndexForDisplay()
    document.getElementById(screen).style.zIndex = "2";
    initializeFontColorForDisplay()
    document.getElementById(menu).style.color = "black";
}

/*---------------------------- MAP --------------------------------------------*/

let mapToolBarState = {
    isEditMode: false,
    isWall: false,
    isCamera: false,
    isDoor: false,
    isWindowsill: false,
    sliderPosition: [0.0, 0.0, 0.0, 0.0, 0.0]
}

let actions_map = {

    mapBackgroundIds: [
        "mapScreenEditBackground",
        "mapScreenSaveBackground",
        "mapScreenToolWallBackground",
        "mapScreenToolCamBackground",
        "mapScreenToolDoorBackground",
        "mapScreenToolWindowBackground",
        "mapScreenHandBackground",
        "mapScreenSettingsBackground",
    ],

    changeCheckState(id,toChecked){document.getElementById(id).classList.replace(!toChecked?'checked':'notChecked', toChecked?'checked':'notChecked');},
    changeOpacity(id,toAllowed){document.getElementById(id).classList.replace(!toAllowed?'allowedToTouch':'notAllowedToTouch', toAllowed?'allowedToTouch':'notAllowedToTouch');},

    saveClicked()
    {
        if(mapToolBarState.isEditMode)
        {
            // сохранение плана
            // ..
        }
    },

    wallClicked()
    {
        if(mapToolBarState.isEditMode)
        {
            mapToolBarState.isWall = true;
            mapToolBarState.isCamera = false;
            mapToolBarState.isDoor = false;
            mapToolBarState.isWindowsill = false;

            this.changeCheckState(this.mapBackgroundIds[2], true);
            this.changeOpacity(this.mapBackgroundIds[2], true);
            this.changeCheckState(this.mapBackgroundIds[3], false);
            this.changeOpacity(this.mapBackgroundIds[3], false);
            this.changeCheckState(this.mapBackgroundIds[4], false);
            this.changeOpacity(this.mapBackgroundIds[4], false);
            this.changeCheckState(this.mapBackgroundIds[5], false);
            this.changeOpacity(this.mapBackgroundIds[5], false);
        }
    },

    cameraClicked()
    {
        if(mapToolBarState.isEditMode)
        {
            mapToolBarState.isWall = false;
            mapToolBarState.isCamera = true;
            mapToolBarState.isDoor = false;
            mapToolBarState.isWindowsill = false;

            this.changeCheckState(this.mapBackgroundIds[2], false);
            this.changeOpacity(this.mapBackgroundIds[2], false);
            this.changeCheckState(this.mapBackgroundIds[3], true);
            this.changeOpacity(this.mapBackgroundIds[3], true);
            this.changeCheckState(this.mapBackgroundIds[4], false);
            this.changeOpacity(this.mapBackgroundIds[4], false);
            this.changeCheckState(this.mapBackgroundIds[5], false);
            this.changeOpacity(this.mapBackgroundIds[5], false);
        }
    },

    doorClicked()
    {
        if(mapToolBarState.isEditMode)
        {
            mapToolBarState.isWall = false;
            mapToolBarState.isCamera = false;
            mapToolBarState.isDoor = true;
            mapToolBarState.isWindowsill = false;

            this.changeCheckState(this.mapBackgroundIds[2], false);
            this.changeOpacity(this.mapBackgroundIds[2], false);
            this.changeCheckState(this.mapBackgroundIds[3], false);
            this.changeOpacity(this.mapBackgroundIds[3], false);
            this.changeCheckState(this.mapBackgroundIds[4], true);
            this.changeOpacity(this.mapBackgroundIds[4], true);
            this.changeCheckState(this.mapBackgroundIds[5], false);
            this.changeOpacity(this.mapBackgroundIds[5], false);
        }
    },

    windowsillClicked()
    {
        if(mapToolBarState.isEditMode)
        {
            mapToolBarState.isWall = false;
            mapToolBarState.isCamera = false;
            mapToolBarState.isDoor = false;
            mapToolBarState.isWindowsill = true;

            this.changeCheckState(this.mapBackgroundIds[2], false);
            this.changeOpacity(this.mapBackgroundIds[2], false);
            this.changeCheckState(this.mapBackgroundIds[3], false);
            this.changeOpacity(this.mapBackgroundIds[3], false);
            this.changeCheckState(this.mapBackgroundIds[4], false);
            this.changeOpacity(this.mapBackgroundIds[4], false);
            this.changeCheckState(this.mapBackgroundIds[5], true);
            this.changeOpacity(this.mapBackgroundIds[5], true);
        }
    },

    editClicked()
    {
        if(mapToolBarState.isEditMode)
        {
            mapToolBarState.isEditMode = false;

            this.changeCheckState(this.mapBackgroundIds[0], false);
            for(let i = 1; i < this.mapBackgroundIds.length; i++)
            {
                this.changeCheckState(this.mapBackgroundIds[i], false);
                this.changeOpacity(this.mapBackgroundIds[i], false);
            }

        }
        else
        {
            this.changeOpacity(this.mapBackgroundIds[1], true);
            this.changeOpacity(this.mapBackgroundIds[2], true);
            this.changeOpacity(this.mapBackgroundIds[3], true);
            this.changeOpacity(this.mapBackgroundIds[4], true);
            this.changeOpacity(this.mapBackgroundIds[5], true);
            this.changeOpacity(this.mapBackgroundIds[6], true);

            mapToolBarState.isEditMode = true;

            this.changeCheckState("mapScreenEditBackground", true);

            // Активация режима редактирования. Стоп обновления и удаление точек с карты
            // ...
        }
    },

    drawWall(cnvs, newWall){
        let ctx = cnvs.getContext('2d');
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.fillRect(newWall.x,newWall.y,newWall.w,newWall.h);
    },

    drawCamera(cnvs, newCam){
        let ctx = cnvs.getContext('2d');
        ctx.beginPath();
        ctx.fillStyle = "blue";
        ctx.moveTo(newCam.x,newCam.y);
        ctx.lineTo(newCam.x + newCam.w / 6 * 4 ,newCam.y);
        ctx.lineTo(newCam.x + newCam.w / 6 * 4 ,newCam.y + newCam.h / 3);
        ctx.lineTo(newCam.x + newCam.w ,newCam.y);
        ctx.lineTo(newCam.x + newCam.w ,newCam.y + newCam.h);
        ctx.lineTo(newCam.x + newCam.w / 6 * 4 ,newCam.y + newCam.h / 3 * 2);
        ctx.lineTo(newCam.x + newCam.w / 6 * 4 ,newCam.y + newCam.h);
        ctx.lineTo(newCam.x,newCam.y + newCam.h );
        ctx.lineTo(newCam.x,newCam.y);
        ctx.fill();
    },

    drawDoor(cnvs, newDoor){
        let ctx = cnvs.getContext('2d');
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.lineWidth = 5;
        ctx.moveTo(newDoor.x,newDoor.y);
        ctx.lineTo(newDoor.x + newDoor.w / 5 ,newDoor.y);
        ctx.stroke();

        ctx.moveTo(newDoor.x + newDoor.w / 5,newDoor.y + newDoor.h);
        ctx.lineTo(newDoor.x + newDoor.w / 5 * 4,newDoor.y);
        ctx.lineTo(newDoor.x + newDoor.w ,newDoor.y);
        ctx.stroke();
    },

    drawWindowsill(cnvs, newWindow)
    {
        let ctx = cnvs.getContext('2d');
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.lineWidth = 5;
        ctx.moveTo(newWindow.x,newWindow.y);
        ctx.lineTo(newWindow.x + newWindow.w ,newWindow.y);
        ctx.stroke();

        ctx.moveTo(newWindow.x + newWindow.w / 10 * 2,newWindow.y);
        ctx.lineTo(newWindow.x + newWindow.w / 10 * 2,newWindow.y + newWindow.h);
        ctx.lineTo(newWindow.x + newWindow.w / 10 * 8,newWindow.y + newWindow.h);
        ctx.lineTo(newWindow.x + newWindow.w / 10 * 8,newWindow.y);
        ctx.stroke();

    },

    addActionToCanvas()
    {
        let cnvs = document.getElementById("map");
        let cnvsOffsetL = cnvs.getBoundingClientRect().x;
        let cnvsOffsetT = cnvs.getBoundingClientRect().y;

        let cnvsW = cnvs.getBoundingClientRect().width;
        let cnvsH = cnvs.getBoundingClientRect().height;

        let start_elem_size = {w: cnvsW/100, h: cnvsH/100};

        cnvs.addEventListener('click', function (e)
        {
            let x = e.pageX - cnvsOffsetL, y = e.pageY - cnvsOffsetT;

            //console.log(x,y)

            // EDITING
            if(mapToolBarState.isEditMode)
            {
                if(mapToolBarState.isWall)
                {
                    let newWall = {x: x, y: y, w: start_elem_size.w * 10, h: start_elem_size.h}

                    if(newWall.x + newWall.w > cnvsW)
                        newWall.x = cnvsW - newWall.w;
                    if(newWall.y + newWall.h > cnvsH)
                        newWall.y = cnvsH - newWall.h;

                    actions_map.drawWall(cnvs, newWall)
                }

                if(mapToolBarState.isCamera)
                {
                    let newCam = {x: x, y: y, w: start_elem_size.w * 6, h: start_elem_size.h * 3}

                    if(newCam.x + newCam.w > cnvsW)
                        newCam.x = cnvsW - newCam.w;
                    if(newCam.y + newCam.h > cnvsH)
                        newCam.y = cnvsH - newCam.h;

                    actions_map.drawCamera(cnvs, newCam)
                }

                if(mapToolBarState.isDoor)
                {
                    let newDoor = {x: x, y: y, w: start_elem_size.w * 10, h: start_elem_size.h * 2}

                    if(newDoor.x + newDoor.w > cnvsW)
                        newDoor.x = cnvsW - newDoor.w;
                    if(newDoor.y + newDoor.h > cnvsH)
                        newDoor.y = cnvsH - newDoor.h;

                    actions_map.drawDoor(cnvs, newDoor)
                }

                if(mapToolBarState.isWindowsill)
                {
                    let newWindow = {x: x, y: y, w: start_elem_size.w * 10, h: start_elem_size.h * 2}

                    if(newWindow.x + newWindow.w > cnvsW)
                        newWindow.x = cnvsW - newWindow.w;
                    if(newWindow.y + newWindow.h > cnvsH)
                        newWindow.y = cnvsH - newWindow.h;

                    actions_map.drawWindowsill(cnvs, newWindow)
                }
            }






        });

    },

    addActionToSlider(index)
    {
        let ball = document.getElementById("ball_" + index);
        let slide = document.getElementById("sliderLine_" + index);
        let start_x = slide.getBoundingClientRect().x;
        let maxLeftOffset = slide.getBoundingClientRect().width - ball.getBoundingClientRect().width;

        // init ball position
        let currentPosition = mapToolBarState.sliderPosition[index-1] * maxLeftOffset;
        // 1vmin is a padding of slider
        ball.style.left = "calc(1vmin + "+ currentPosition +"px)";

        ball.onmousedown = function(e)
        {
            let ball_w = ball.getBoundingClientRect().width;
            let ball_x = ball.getBoundingClientRect().x;

            moveAt(e);

            function moveAt(e) {
                // 1vmin is a padding of slider
                let value = e.pageX - ball_x - ball_w/2 + ball_x-start_x;
                if(value < 0)
                    value = 0;
                if(value > maxLeftOffset)
                    value = maxLeftOffset;

                mapToolBarState.sliderPosition[index-1] = value / maxLeftOffset;

                ball.style.left = "calc(1vmin + "+ value +"px)";
            }

            document.onmousemove = function(e)
            {
                moveAt(e);
            };

            document.onmouseup = function()
            {
                document.onmousemove = null;
                ball.onmouseup = null;
            };

        }

        ball.ondragstart = function()
        {
            return false;
        };
    },
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


