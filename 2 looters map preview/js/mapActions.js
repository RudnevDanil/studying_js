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
let mapObjRotationsConst = [6.28/2 , 6.28 , 6.28, 6.28]
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

    elementMoveStartPosition: {x:null, y:null},
    savingInProgress: false,

    changeCheckState(id,toChecked){document.getElementById(id).classList.replace(!toChecked?'checked':'notChecked', toChecked?'checked':'notChecked');},
    changeOpacity(id,toAllowed){document.getElementById(id).classList.replace(!toAllowed?'allowedToTouch':'notAllowedToTouch', toAllowed?'allowedToTouch':'notAllowedToTouch');},
    changeVisibleType(id, toVisible){document.getElementById(id).classList.replace(!toVisible?'visible':'hidden', toVisible?'visible':'hidden');},
    changeMapPageViewMode(id, toView){document.getElementById(id).classList.replace(!toView?'mapPageViewMode':'mapPageEditingMode', toView?'mapPageViewMode':'mapPageEditingMode');},

    loadMap()
    {
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
    },

    saveClicked()
    {
        if(mapToolBarState.isEditMode)
        {
            // сохранение карты
            //let login = document.getElementById(authFunct.ids.login).value.trim();
            //let pass = document.getElementById(authFunct.ids.pass).value.trim();

            let login = 'admin', pass = '111'; // debug

            //#mapScreenSaveBackground
            $('#' + actions_map.mapBackgroundIds[1]).removeClass('butRedBorder').removeClass('butGreenBorder').addClass('butYellowBorder');
            actions_map.changeOpacity(actions_map.mapBackgroundIds[1], false);
            actions_map.savingInProgress = true;
            $.post('php/saveMap.php', {login: login, pass: pass, arr: mapObjects}, function (result)
            {
                if(result !== "")
                {
                    result = $.parseJSON(result);
                    if(result.answer === "saving success")
                        $('#' + actions_map.mapBackgroundIds[1]).removeClass('butRedBorder').removeClass('butYellowBorder').addClass('butGreenBorder');
                    else
                        $('#' + actions_map.mapBackgroundIds[1]).removeClass('butGreenBorder').removeClass('butYellowBorder').addClass('butRedBorder');
                }
                else
                    $('#' + actions_map.mapBackgroundIds[1]).removeClass('butGreenBorder').removeClass('butYellowBorder').addClass('butRedBorder');
                actions_map.changeOpacity(actions_map.mapBackgroundIds[1], true);
                setTimeout(() => {
                    $('#' + actions_map.mapBackgroundIds[1]).removeClass('butGreenBorder').removeClass('butYellowBorder').removeClass('butRedBorder');
                    actions_map.savingInProgress = false;
                }, 3000);
            });
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
            actions_map.setSliderToPosition(1,0.1);
            actions_map.setSliderToPosition(2,0.01);
            actions_map.setSliderToPosition(3,0.0);
        }
    },

    cameraClicked()
    {
        if(mapToolBarState.isEditMode)
        {
            this.changeMapToolBarStateIs([true, false, true, false, false, false, false]);
            this.changeCheckStateArr([true, false, false, true, false, false, false, false]);
            this.slidersAction(2,true);
            actions_map.setSliderToPosition(4,0.00);
            actions_map.setSliderToPosition(5,0.00);
        }
    },

    doorClicked()
    {
        if(mapToolBarState.isEditMode)
        {
            this.changeMapToolBarStateIs([true, false, false, true, false, false, false]);
            this.changeCheckStateArr([true, false, false, false, true, false, false, false]);
            this.slidersAction(1,true);
            actions_map.setSliderToPosition(1,0.1);
            actions_map.setSliderToPosition(2,0.02);
            actions_map.setSliderToPosition(3,0.0);
        }
    },

    windowsillClicked()
    {
        if(mapToolBarState.isEditMode)
        {
            this.changeMapToolBarStateIs([true, false, false, false, true, false, false]);
            this.changeCheckStateArr([true, false, false, false, false, true, false, false]);
            this.slidersAction(1,true);
            actions_map.setSliderToPosition(1,0.1);
            actions_map.setSliderToPosition(2,0.02);
            actions_map.setSliderToPosition(3,0.0);
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
            actions_map.reDrawCNVS();

            // Активация режима редактирования. Стоп обновления и удаление точек с карты
            // ...
        }
    },

    handClicked()
    {
        if(mapToolBarState.isEditMode)
        {
            this.changeMapToolBarStateIs([true, false, false, false, false, true, false]);
            this.changeCheckStateArr([true, false, false, false, false, false, true, false]);
            this.changeOpacityArr([true, true, true, true, true, true, true, false]);
            this.slidersAction(0,false);
        }
    },

    removeClicked()
    {
        if(mapToolBarState.isEditMode)
        {
            mapObjects.splice(mapObjects.length - 1, 1);
            actions_map.reDrawCNVS();
            actions_map.changeOpacity(actions_map.mapBackgroundIds[7], false);
        }
    },

    addMapObject(obj, mapObjType, cnvsW, cnvsH){
        let newVal = {
            x: obj.x / cnvsW,
            y: obj.y / cnvsH,
            w: obj.w / cnvsW,
            h: obj.h / cnvsH,
            r: 0,
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
                r: mapObjects[i].r,
            }

            if(mapObjects[i].type === mapObjTypes[0]) actions_map.drawWall(cnvs, newVal);
            else if(mapObjects[i].type === mapObjTypes[1]) actions_map.drawCamera(cnvs, newVal);
            else if(mapObjects[i].type === mapObjTypes[2]) actions_map.drawDoor(cnvs, newVal);
            else if(mapObjects[i].type === mapObjTypes[3]) actions_map.drawWindowsill(cnvs, newVal);
        }
    },

    rotatePoint(point, angle, offset)
    {
        point = {x: point.x - offset.x, y: point.y - offset.y}
        let b_cos = Math.cos(angle)
        let b_sin = Math.sin(angle)
        return {x: (b_cos) * (- point.x) + (-b_sin) * (- point.y) + offset.x, y: (b_sin) * (- point.x) + (b_cos) * (- point.y) + offset.y}
    },

    rotatePoints(arr, angle, w, h, rotationZero)
    {
        let offset = {x: rotationZero.x + w / 2, y: rotationZero.y + h / 2}
        for(let i = 0; i < arr.length; i++)
        {
            arr[i] = actions_map.rotatePoint(arr[i], angle, offset);
        }
    },

    drawFigure(cnvs, points, isLine, color)
    {
        let ctx = cnvs.getContext('2d');
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.moveTo(points[0].x, points[0].y);
        for(let i = 1; i < points.length; i++)
            ctx.lineTo(points[i].x, points[i].y);
        if(isLine)
        {
            ctx.lineWidth = 5;
            ctx.stroke()
        }
        else
        {
            ctx.lineTo(points[0].x, points[0].y);
            ctx.fill()
        }
    },

    drawWall(cnvs, fig)
    {
        let points = [
            {x: fig.x, y: fig.y},
            {x: fig.x + fig.w, y: fig.y},
            {x: fig.x + fig.w, y: fig.y + fig.h},
            {x: fig.x, y: fig.y + fig.h}
        ];
        actions_map.rotatePoints(points, mapObjRotationsConst[0] * fig.r, fig.w, fig.h, points[0])
        actions_map.drawFigure(cnvs, points, false, mapObjectsColours[0]);
    },

    drawCamera(cnvs, fig)
    {
        let points = [
            {x: fig.x, y: fig.y},
            {x: fig.x + fig.w / 6 * 4, y: fig.y},
            {x: fig.x + fig.w / 6 * 4, y: fig.y + fig.h/ 3},
            {x: fig.x + fig.w , y: fig.y},
            {x: fig.x + fig.w , y: fig.y + fig.h},
            {x: fig.x + fig.w / 6 * 4, y: fig.y + fig.h/ 3*2},
            {x: fig.x + fig.w / 6 * 4, y: fig.y + fig.h},
            {x: fig.x, y: fig.y + fig.h},
        ];
        actions_map.rotatePoints(points, mapObjRotationsConst[1] * fig.r, fig.w, fig.h, points[0])
        actions_map.drawFigure(cnvs, points, false, mapObjectsColours[1]);
    },

    drawDoor(cnvs, fig)
    {
        let points = [
            {x: fig.x, y: fig.y},
            {x: fig.x + fig.w / 5, y: fig.y},
        ];
        let rotationZero = points[0];
        actions_map.rotatePoints(points, mapObjRotationsConst[2] * fig.r, fig.w, fig.h, rotationZero)
        actions_map.drawFigure(cnvs, points, true, mapObjectsColours[2]);

        points = [
            {x: fig.x + fig.w / 5, y: fig.y + fig.h},
            {x: fig.x + fig.w / 5 * 4, y: fig.y},
            {x: fig.x + fig.w, y: fig.y},
        ];
        actions_map.rotatePoints(points, mapObjRotationsConst[2] * fig.r, fig.w, fig.h, rotationZero)
        actions_map.drawFigure(cnvs, points, true, mapObjectsColours[2]);
    },

    drawWindowsill(cnvs, fig)
    {
        let points = [
            {x: fig.x, y: fig.y},
            {x: fig.x + fig.w, y: fig.y},
        ];
        let rotationZero = points[0];
        actions_map.rotatePoints(points, mapObjRotationsConst[3] * fig.r, fig.w, fig.h, rotationZero)
        actions_map.drawFigure(cnvs, points, true, mapObjectsColours[3]);

        points = [

            {x: fig.x + fig.w / 10 * 2, y: fig.y},
            {x: fig.x + fig.w / 10 * 2, y: fig.y + fig.h},
            {x: fig.x + fig.w / 10 * 8, y: fig.y + fig.h},
            {x: fig.x + fig.w / 10 * 8, y: fig.y},
        ];
        actions_map.rotatePoints(points, mapObjRotationsConst[3] * fig.r, fig.w, fig.h, rotationZero)
        actions_map.drawFigure(cnvs, points, false, mapObjectsColours[3]);
    },

    sidePointRelativelyLine(point, a, b)
    {
        return Math.sign(point.x * (a.y - b.y) + point.y * (b.x - a.x) + a.x * b.y - b.x * a.y);
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
                let x = (e.pageX - cnvsOffsetL);
                let y = (e.pageY - cnvsOffsetT);

                // finding obj
                for(let i = mapObjects.length - 1; i >= 0 && mapToolBarState.draggingI === null; i--)
                {
                    let fig = {x: mapObjects[i].x * cnvsW, y: mapObjects[i].y * cnvsH, w: mapObjects[i].w * cnvsW, h: mapObjects[i].h * cnvsH, r: mapObjects[i].r};
                    let points = [{x: fig.x, y: fig.y}, {x: fig.x + fig.w, y: fig.y}, {x: fig.x + fig.w, y: fig.y + fig.h}, {x: fig.x, y: fig.y + fig.h}];
                    let objType = null;
                    for(let j = 0; j < mapObjTypes.length && objType === null; j++)
                        if(mapObjects[i].type === mapObjTypes[j])
                            objType = j;

                    actions_map.rotatePoints(points, mapObjRotationsConst[objType] * fig.r, fig.w, fig.h, points[0])

                    // show bounding boxes
                    //let cnvs = document.getElementById("map");
                    //actions_map.drawFigure(cnvs, points, false, "red");

                    if(actions_map.sidePointRelativelyLine({x:x,y:y}, points[0], points[1]) === actions_map.sidePointRelativelyLine({x:x,y:y}, points[2], points[3])
                    && actions_map.sidePointRelativelyLine({x:x,y:y}, points[1], points[2]) === actions_map.sidePointRelativelyLine({x:x,y:y}, points[3], points[0]))
                    {
                        mapToolBarState.draggingI = i;
                    }
                }

                if(mapToolBarState.draggingI != null)
                {
                    actions_map.elementMoveStartPosition = {x: (e.pageX - cnvsOffsetL) / cnvsW - mapObjects[mapToolBarState.draggingI].x, y: (e.pageY - cnvsOffsetT) / cnvsH - mapObjects[mapToolBarState.draggingI].y};
                    mapObjects.push(mapObjects[mapToolBarState.draggingI]);
                    mapObjects.splice(mapToolBarState.draggingI, 1);
                    mapToolBarState.draggingI = mapObjects.length - 1;
                    actions_map.reDrawCNVS();
                    actions_map.changeOpacity(actions_map.mapBackgroundIds[7], true);
                    let isCam = mapObjects[mapToolBarState.draggingI].type === 'cam';
                    actions_map.slidersAction(isCam ? 2 : 1,true);
                    if(isCam)
                    {
                        actions_map.setSliderToPosition(5, mapObjects[mapToolBarState.draggingI].r)
                    }
                    else
                    {
                        actions_map.setSliderToPosition(1, mapObjects[mapToolBarState.draggingI].w)
                        actions_map.setSliderToPosition(2, mapObjects[mapToolBarState.draggingI].h)
                        actions_map.setSliderToPosition(3, mapObjects[mapToolBarState.draggingI].r)
                    }
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

                let x = (e.pageX - cnvs.getBoundingClientRect().x) / cnvsW - actions_map.elementMoveStartPosition.x;
                let y = (e.pageY - cnvs.getBoundingClientRect().y) / cnvsH - actions_map.elementMoveStartPosition.y;

                if(x < 0) x = 0;
                if(y < 0) y = 0;
                if(x + mapObjects[mapToolBarState.draggingI].w > 1) x = 1 - mapObjects[mapToolBarState.draggingI].w;
                if(y + mapObjects[mapToolBarState.draggingI].h > 1) y = 1 - mapObjects[mapToolBarState.draggingI].h;

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
            let start_elem_size = {w: cnvsW, h: cnvsH};
            let x = e.pageX - cnvsOffsetL, y = e.pageY - cnvsOffsetT;

            // EDITING
            if(mapToolBarState.isEditMode)
            {
                if(mapToolBarState.isWall || mapToolBarState.isCamera || mapToolBarState.isDoor || mapToolBarState.isWindowsill)
                    actions_map.changeOpacity(actions_map.mapBackgroundIds[7], true);

                if(mapToolBarState.isWall)
                {
                    let newWall = {x: x, y: y, w: start_elem_size.w * mapToolBarState.sliderPosition[0], h: start_elem_size.h * mapToolBarState.sliderPosition[1], r: mapToolBarState.sliderPosition[2]}
                    if(newWall.x + newWall.w > cnvsW) newWall.x = cnvsW - newWall.w;
                    if(newWall.y + newWall.h > cnvsH) newWall.y = cnvsH - newWall.h;
                    actions_map.drawWall(cnvs, newWall)
                    actions_map.addMapObject(newWall, mapObjTypes[0], cnvsW, cnvsH)
                }

                if(mapToolBarState.isCamera)
                {
                    let newCam = {x: x, y: y, w: start_elem_size.w * 0.06, h: start_elem_size.h * 0.03, r: mapToolBarState.sliderPosition[4]}
                    if(newCam.x + newCam.w > cnvsW) newCam.x = cnvsW - newCam.w;
                    if(newCam.y + newCam.h > cnvsH) newCam.y = cnvsH - newCam.h;
                    actions_map.drawCamera(cnvs, newCam)
                    actions_map.addMapObject(newCam, mapObjTypes[1], cnvsW, cnvsH)
                }

                if(mapToolBarState.isDoor)
                {
                    let newDoor = {x: x, y: y, w: start_elem_size.w * mapToolBarState.sliderPosition[0], h: start_elem_size.h * mapToolBarState.sliderPosition[1], r: mapToolBarState.sliderPosition[2]}
                    if(newDoor.x + newDoor.w > cnvsW) newDoor.x = cnvsW - newDoor.w;
                    if(newDoor.y + newDoor.h > cnvsH) newDoor.y = cnvsH - newDoor.h;
                    actions_map.drawDoor(cnvs, newDoor)
                    actions_map.addMapObject(newDoor, mapObjTypes[2], cnvsW, cnvsH)
                }

                if(mapToolBarState.isWindowsill)
                {
                    let newWindow = {x: x, y: y, w: start_elem_size.w * mapToolBarState.sliderPosition[0], h: start_elem_size.h * mapToolBarState.sliderPosition[1], r: mapToolBarState.sliderPosition[2]}
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
        mapToolBarState.sliderPosition[index-1] = position;
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
            //let ball_w = ball.getBoundingClientRect().width;
            let mousePosition = e.pageX - ball.getBoundingClientRect().x;
            moveAt(e);

            function moveAt(e)
            {
                // 1vmin is a padding of slider
                let value = e.pageX - start_x - mousePosition;
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
                    if(index == 3 && mapObjects[mapObjects.length - 1].type !=='cam')
                        mapObjects[mapObjects.length - 1].r = mapToolBarState.sliderPosition[index-1];
                    if(index == 5 && mapObjects[mapObjects.length - 1].type ==='cam')
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