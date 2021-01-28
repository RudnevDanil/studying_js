/*---------------------------- MAP --------------------------------------------*/

let mapToolBarState = {
    isEditMode: false,
    isWall: false,
    isCamera: false,
    isDoor: false,
    isWindowsill: false,
    isHand: false,
    isRemove: false,
    isDragging: false,
    sliderPosition: [0.0, 0.0, 0.0, 0.0, 0.0],
    draggingI: null,
}

let mapObjTypes = ['wall', 'cam', 'door', 'window'];
let mapObjects = [];
let mapObjectsColours = ['#000000', '#281cab', '#000002', '#000003'];

let actions_map = {

    mapBackgroundIds: [
        "mapScreenEditBackground",
        "mapScreenSaveBackground",
        "mapScreenToolWallBackground",
        "mapScreenToolCamBackground",
        "mapScreenToolDoorBackground",
        "mapScreenToolWindowBackground",
        "mapScreenHandBackground",
        "mapScreenRemoveBackground",
    ],
    mapPageId: "mapPage",
    mapSlidersIds:[
        "wallSliders",
        "cameraSliders",
    ],

    changeCheckState(id,toChecked){document.getElementById(id).classList.replace(!toChecked?'checked':'notChecked', toChecked?'checked':'notChecked');},
    changeOpacity(id,toAllowed){document.getElementById(id).classList.replace(!toAllowed?'allowedToTouch':'notAllowedToTouch', toAllowed?'allowedToTouch':'notAllowedToTouch');},
    changeVisibleType(id, toVisible){document.getElementById(id).classList.replace(!toVisible?'visible':'hidden', toVisible?'visible':'hidden');},
    changeMapPageViewMode(id, toView){document.getElementById(id).classList.replace(!toView?'mapPageViewMode':'mapPageEditingMode', toView?'mapPageViewMode':'mapPageEditingMode');},

    saveClicked()
    {
        if(mapToolBarState.isEditMode)
        {
            // сохранение плана
            // ..
        }
    },

    changeCheckStateArr(arr)
    {
        for(let i = 0; i < arr.length; i++)
        {
            this.changeCheckState(this.mapBackgroundIds[i], arr[i]);
        }
    },

    changeOpacityArr(arr)
    {
        for(let i = 0; i < arr.length; i++)
        {
            this.changeOpacity(this.mapBackgroundIds[i], arr[i]);
        }
    },

    changeMapToolBarStateIs(arr)
    {
        mapToolBarState.isEditMode = arr[0];
        mapToolBarState.isWall =  arr[1];
        mapToolBarState.isCamera =  arr[2];
        mapToolBarState.isDoor =  arr[3];
        mapToolBarState.isWindowsill =  arr[4];
        mapToolBarState.isHand =  arr[5];
        mapToolBarState.isRemove =  arr[6];
    },

    slidersAction(index, isOpen)
    {
        if(isOpen)
        {
            this.changeVisibleType(this.mapSlidersIds[0], index == 1);
            this.changeVisibleType(this.mapSlidersIds[1], index != 1);
            this.changeOpacity(this.mapSlidersIds[0], index == 1);
            this.changeOpacity(this.mapSlidersIds[1], index != 1);
        }
        else
        {
            this.changeVisibleType(this.mapSlidersIds[0], false);
            this.changeVisibleType(this.mapSlidersIds[1], false);
            this.changeOpacity(this.mapSlidersIds[0], false);
            this.changeOpacity(this.mapSlidersIds[1], false);


        }
    },

    wallClicked()
    {
        if(mapToolBarState.isEditMode)
        {
            this.changeMapToolBarStateIs([true, true, false, false, false, false, false]);
            this.changeCheckStateArr([true, false, true, false, false, false, false, false]);
            this.slidersAction(1,true);
        }
    },

    cameraClicked()
    {
        if(mapToolBarState.isEditMode)
        {
            this.changeMapToolBarStateIs([true, false, true, false, false, false, false]);
            this.changeCheckStateArr([true, false, false, true, false, false, false, false]);
            this.slidersAction(2,true);
        }
    },

    doorClicked()
    {
        if(mapToolBarState.isEditMode)
        {
            this.changeMapToolBarStateIs([true, false, false, true, false, false, false]);
            this.changeCheckStateArr([true, false, false, false, true, false, false, false]);
            this.slidersAction(1,true);
        }
    },

    windowsillClicked()
    {
        if(mapToolBarState.isEditMode)
        {
            this.changeMapToolBarStateIs([true, false, false, false, true, false, false]);
            this.changeCheckStateArr([true, false, false, false, false, true, false, false]);
            this.slidersAction(1,true);
        }
    },

    editClicked()
    {
        if(mapToolBarState.isEditMode)
        {
            this.changeMapToolBarStateIs([false, false, false, false, false, false, false]);
            this.changeCheckStateArr([false, false, false, false, false, false, false, false]);
            this.changeOpacityArr([true, false, false, false, false, false, false, false]);
            this.changeMapPageViewMode(this.mapPageId, true);
            this.slidersAction(0,false);
        }
        else
        {
            this.changeMapToolBarStateIs([true, false, false, false, false, false, false]);
            this.changeCheckStateArr([true, false, false, false, false, false, false, false]);
            this.changeOpacityArr([true, true, true, true, true, true, true, false]);
            this.slidersAction(0,false);
            this.changeMapPageViewMode(this.mapPageId, false);

            document.getElementById("map").width = document.getElementById("mapPage").getBoundingClientRect().width;
            document.getElementById("map").height = document.getElementById("mapPage").getBoundingClientRect().height;

            // Активация режима редактирования. Стоп обновления и удаление точек с карты
            // ...
        }
    },

    handClicked()
    {
        if(mapToolBarState.isEditMode)
        {
            mapToolBarState.isWall = false;
            mapToolBarState.isCamera = false;
            mapToolBarState.isDoor = false;
            mapToolBarState.isWindowsill = false;
            mapToolBarState.isHand = true;
            mapToolBarState.isRemove = false;

            this.changeCheckStateArr([true, false, false, false, false, false, true, false]);

            this.changeOpacity(this.mapBackgroundIds[7], false);

            this.changeVisibleType(this.mapSlidersIds[0], false)
            this.changeVisibleType(this.mapSlidersIds[1], false)

            this.changeOpacity(this.mapSlidersIds[0], false);
            this.changeOpacity(this.mapSlidersIds[1], false);
        }
    },

    addMapObject(obj, mapObjType, cnvsW, cnvsH){
        let newVal = {
            x: obj.x / cnvsW,
            y: obj.y / cnvsH,
            w: obj.w / cnvsW,
            h: obj.h / cnvsH,
            type: mapObjType,
        }
        mapObjects.push(newVal);
    },

    reDrawCNVS()
    {
        let cnvs = document.getElementById("map");
        let cnvsW = cnvs.getBoundingClientRect().width;
        let cnvsH = cnvs.getBoundingClientRect().height;

        let ctx = cnvs.getContext('2d');
        ctx.clearRect(0,0, cnvsW, cnvsH)

        for(let i = 0; i < mapObjects.length; i++)
        {
            let newVal = {
                x: mapObjects[i].x * cnvsW,
                y: mapObjects[i].y * cnvsH,
                w: mapObjects[i].w * cnvsW,
                h: mapObjects[i].h * cnvsH,
            }

            if(mapObjects[i].type === mapObjTypes[0])
                actions_map.drawWall(cnvs, newVal);
            else if(mapObjects[i].type === mapObjTypes[1])
                actions_map.drawCamera(cnvs, newVal);
            else if(mapObjects[i].type === mapObjTypes[2])
                actions_map.drawDoor(cnvs, newVal);
            else if(mapObjects[i].type === mapObjTypes[3])
                actions_map.drawWindowsill(cnvs, newVal);

        }
    },

    drawWall(cnvs, newWall)
    {
        let ctx = cnvs.getContext('2d');
        ctx.beginPath();
        ctx.fillStyle = mapObjectsColours[0];
        ctx.fillRect(newWall.x,newWall.y,newWall.w,newWall.h);
    },

    drawCamera(cnvs, newCam)
    {
        let ctx = cnvs.getContext('2d');
        ctx.beginPath();
        ctx.fillStyle = mapObjectsColours[1];
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

    drawDoor(cnvs, newDoor)
    {
        let ctx = cnvs.getContext('2d');
        ctx.beginPath();
        ctx.fillStyle = mapObjectsColours[2];
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
        ctx.fillStyle = mapObjectsColours[3];
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

        cnvs.addEventListener('mousedown', function (e)
        {
            if(mapToolBarState.isEditMode && mapToolBarState.isHand)
            {
                mapToolBarState.isDragging = true;
                mapToolBarState.draggingI = null;
                let cnvsOffsetL = cnvs.getBoundingClientRect().x;
                let cnvsOffsetT = cnvs.getBoundingClientRect().y;
                let cnvsW = cnvs.getBoundingClientRect().width;
                let cnvsH = cnvs.getBoundingClientRect().height;
                let x = (e.pageX - cnvsOffsetL) / cnvsW, y = (e.pageY - cnvsOffsetT) / cnvsH;

                // finding obj
                for(let i = 0; i < mapObjects.length && mapToolBarState.draggingI === null; i++)
                    if(x > mapObjects[i].x && x < (mapObjects[i].x + mapObjects[i].w) && y > mapObjects[i].y && y < (mapObjects[i].y + mapObjects[i].h))
                        mapToolBarState.draggingI = i;


                if(mapToolBarState.draggingI != null)
                {
                    mapObjects.push(mapObjects[mapToolBarState.draggingI]);
                    mapObjects.splice(mapToolBarState.draggingI, 1);
                    mapToolBarState.draggingI = mapObjects.length - 1;
                    actions_map.reDrawCNVS();
                    actions_map.changeOpacity(actions_map.mapBackgroundIds[7], true);
                    let isCam = mapObjects[mapToolBarState.draggingI].type === 'cam';
                    actions_map.slidersAction(isCam ? 2 : 1,true);
                }
                else
                {
                    actions_map.changeOpacity(actions_map.mapBackgroundIds[7], false);
                    actions_map.slidersAction(0,false);
                    mapToolBarState.isDragging = false;
                }
            }
        });

        cnvs.addEventListener('mousemove', function (e)
        {
            if(mapToolBarState.isEditMode && mapToolBarState.isHand && mapToolBarState.isDragging && mapToolBarState.draggingI !== null)
            {
                let cnvsW = cnvs.getBoundingClientRect().width
                let cnvsH = cnvs.getBoundingClientRect().height

                let x = (e.pageX - cnvs.getBoundingClientRect().x) / cnvsW - mapObjects[mapToolBarState.draggingI].w/2;
                let y = (e.pageY - cnvs.getBoundingClientRect().y) / cnvsH - mapObjects[mapToolBarState.draggingI].h/2;

                if(x < 0) x = 0;
                if(y < 0) y = 0;
                if(x + mapObjects[mapToolBarState.draggingI].w > 1)
                    x = 1 - mapObjects[mapToolBarState.draggingI].w;
                if(y + mapObjects[mapToolBarState.draggingI].h > 1)
                    y = 1 - mapObjects[mapToolBarState.draggingI].h;

                mapObjects[mapToolBarState.draggingI].x = x;
                mapObjects[mapToolBarState.draggingI].y = y;
                actions_map.reDrawCNVS();
            }
        });

        cnvs.addEventListener('click', function (e)
        {
            let cnvsOffsetL = cnvs.getBoundingClientRect().x;
            let cnvsOffsetT = cnvs.getBoundingClientRect().y;
            let cnvsW = cnvs.getBoundingClientRect().width;
            let cnvsH = cnvs.getBoundingClientRect().height;
            let start_elem_size = {w: cnvsW/100, h: cnvsH/100};
            let x = e.pageX - cnvsOffsetL, y = e.pageY - cnvsOffsetT;

            // EDITING
            if(mapToolBarState.isEditMode)
            {
                if(mapToolBarState.isWall || mapToolBarState.isCamera || mapToolBarState.isDoor || mapToolBarState.isWindowsill)
                    actions_map.changeOpacity(actions_map.mapBackgroundIds[7], true);

                if(mapToolBarState.isWall)
                {
                    let newWall = {x: x, y: y, w: start_elem_size.w * 10, h: start_elem_size.h}
                    actions_map.setSliderToPosition(1,0.1);
                    actions_map.setSliderToPosition(2,0.01);
                    actions_map.setSliderToPosition(3,0.0);

                    if(newWall.x + newWall.w > cnvsW) newWall.x = cnvsW - newWall.w;
                    if(newWall.y + newWall.h > cnvsH) newWall.y = cnvsH - newWall.h;

                    actions_map.drawWall(cnvs, newWall)
                    actions_map.addMapObject(newWall, mapObjTypes[0], cnvsW, cnvsH)
                }

                if(mapToolBarState.isCamera)
                {
                    let newCam = {x: x, y: y, w: start_elem_size.w * 6, h: start_elem_size.h * 3}
                    actions_map.setSliderToPosition(4,0.06);
                    actions_map.setSliderToPosition(5,0.03);

                    if(newCam.x + newCam.w > cnvsW) newCam.x = cnvsW - newCam.w;
                    if(newCam.y + newCam.h > cnvsH) newCam.y = cnvsH - newCam.h;

                    actions_map.drawCamera(cnvs, newCam)
                    actions_map.addMapObject(newCam, mapObjTypes[1], cnvsW, cnvsH)
                }

                if(mapToolBarState.isDoor)
                {
                    let newDoor = {x: x, y: y, w: start_elem_size.w * 10, h: start_elem_size.h * 2}
                    actions_map.setSliderToPosition(1,0.1);
                    actions_map.setSliderToPosition(2,0.02);
                    actions_map.setSliderToPosition(3,0.0);

                    if(newDoor.x + newDoor.w > cnvsW) newDoor.x = cnvsW - newDoor.w;
                    if(newDoor.y + newDoor.h > cnvsH) newDoor.y = cnvsH - newDoor.h;

                    actions_map.drawDoor(cnvs, newDoor)
                    actions_map.addMapObject(newDoor, mapObjTypes[2], cnvsW, cnvsH)
                }

                if(mapToolBarState.isWindowsill)
                {
                    let newWindow = {x: x, y: y, w: start_elem_size.w * 10, h: start_elem_size.h * 2}
                    actions_map.setSliderToPosition(1,0.1);
                    actions_map.setSliderToPosition(2,0.02);
                    actions_map.setSliderToPosition(3,0.0);

                    if(newWindow.x + newWindow.w > cnvsW) newWindow.x = cnvsW - newWindow.w;
                    if(newWindow.y + newWindow.h > cnvsH) newWindow.y = cnvsH - newWindow.h;

                    actions_map.drawWindowsill(cnvs, newWindow)
                    actions_map.addMapObject(newWindow, mapObjTypes[3], cnvsW, cnvsH)
                }
                if(mapToolBarState.isHand)
                {
                    mapToolBarState.isDragging = false;
                    mapToolBarState.draggingI = null;
                }
            }
        });
    },

    setSliderToPosition(index,position)
    {
        let ball = document.getElementById("ball_" + index);
        let slide = document.getElementById("sliderLine_" + index);
        let maxLeftOffset = slide.getBoundingClientRect().width - ball.getBoundingClientRect().width;
        ball.style.left = "calc(1vmin + "+ position * maxLeftOffset +"px)";
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
            moveAt(e);

            function moveAt(e)
            {
                // 1vmin is a padding of slider
                let value = e.pageX - ball_w/2 - start_x;
                if(value < 0)
                    value = 0;
                if(value > maxLeftOffset)
                    value = maxLeftOffset;

                mapToolBarState.sliderPosition[index-1] = value / maxLeftOffset;

                ball.style.left = "calc(1vmin + "+ value +"px)";

                if(mapObjects.length !== 0)
                {
                    if(index === 1 && mapObjects[mapObjects.length - 1].type !== 'cam')
                        mapObjects[mapObjects.length - 1].w = mapToolBarState.sliderPosition[index-1];
                    if(index === 2 && mapObjects[mapObjects.length - 1].type !== 'cam')
                        mapObjects[mapObjects.length - 1].h = mapToolBarState.sliderPosition[index-1];
                    if(index === 3 || index === 5)
                        mapObjects[mapObjects.length - 1].r = mapToolBarState.sliderPosition[index-1];
                    actions_map.reDrawCNVS();
                }
            }

            document.onmousemove = function(e){moveAt(e);};

            document.onmouseup = function()
            {
                document.onmousemove = null;
                ball.onmouseup = null;
            };
        }

        ball.ondragstart = function(){return false;};
    },
}