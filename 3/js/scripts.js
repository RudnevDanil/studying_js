let settings = {
    imgNames: ["./data/trophy.png", "./data/coins.png", "./data/brilliant.png", "./data/lemon.png", "./data/banana.png", "./data/cherry.png"],
    multiplier: [-1, 100, 10, 5, 3, -2], // -1 is jackpot, -2 is a money back
    boxLineW: 4,
    maxSteps: 8,
    oneElementMovingTime: 500, // ms
}

let state = {
    jackpotValue: 277, // debug. should be 0
    playerCoins: 45, // debug. should be 0
    bet: 15, // debug. should be 0
    inBoxNow: [
        [-1,-1,-1,-1],
        [-1,-1,-1,-1],
        [-1,-1,-1,-1],
    ],
    position: [0, 0, 0],
    steps: [0, 0, 0],
    stepsLeft: [0, 0, 0],
    stepsInStart: [0, 0, 0],
    lastStep: [0, 0, 0],
    isImagesLoaded: false,
    counterLoadedImages: 0,
    animDuration: 2000,
}

let images = [];

function init()
{
    // make right dimension for canvas
    {
        document.getElementById("cnvs").width = document.getElementById("cnvs").getBoundingClientRect().width;
        document.getElementById("cnvs").height = document.getElementById("cnvs").getBoundingClientRect().height;
    }

    for(let i = 0; i < settings.imgNames.length; i++)
    {
        let pic = new Image()
        pic.src = settings.imgNames[i];
        pic.onload = function() {
            images.push(pic);
            state.counterLoadedImages += 1
            if(state.counterLoadedImages === settings.imgNames.length)
            {
                state.isImagesLoaded = true;
                // init cnvs
                for(let i = 0; i < 3; i++)
                {
                    for(let j = 0; j < 4; j++)
                    {
                        state.inBoxNow[i][j] = findNextImg(i)
                    }
                }

                countBoxSizes();
                reDrawCNVS();
            }
        }
    }
}

let ids = {
    go: "goBackground",
}

function goClicked()
{
    if(state.isAnimationStarted)
        return;

    // update  jackpotValue, playerCoins, bet

    state.isAnimationStarted = true;
    $("#" + ids.go).removeClass('goNotBordered').addClass('goBordered');
    for(let i = 0; i < 3; i++)
        state.steps[i] = Math.floor(Math.random() * settings.maxSteps)
    state.animDuration = settings.oneElementMovingTime * Math.max.apply(null, state.steps);
    state.stepsLeft = [0, 0, 0];
    state.lastStep = [0, 0, 0];
    for(let i = 0; i < 3; i++)
        state.stepsInStart[i] = state.steps[i];
    state.animStart = performance.now();
    requestAnimationFrame(function animate(time)
    {
        // timeFraction изменяется от 0 до 1
        let timeFraction = (time - state.animStart) / state.animDuration;
        if (timeFraction > 1) timeFraction = 1;

        if(timeFraction > 0)
        {
            for(let i = 0; i < 3 ; i++)
            {
                let i = 0;
                let fractionsForI = 1 / state.stepsInStart[i];
                if(state.steps[i] > 0)
                {
                    state.position[i] = (timeFraction % fractionsForI) / fractionsForI;
                    if (state.lastStep[i] !== Math.floor(timeFraction / fractionsForI))
                    {
                        state.inBoxNow[i][3] = state.inBoxNow[i][2];
                        state.inBoxNow[i][2] = state.inBoxNow[i][1];
                        state.inBoxNow[i][1] = state.inBoxNow[i][0];
                        state.inBoxNow[i][0] = findNextImg(i);
                        state.steps[i] -= 1;
                        state.stepsLeft[i] += 1;

                    }
                    state.lastStep[i] = Math.floor(timeFraction / fractionsForI);
                }
            }
            reDrawCNVS();
        }
        if (timeFraction < 1)
            requestAnimationFrame(animate);
        else
        {
            state.isAnimationStarted = false;
            $("#" + ids.go).removeClass('goBordered').addClass('goNotBordered');
            // update  jackpotValue, playerCoins, bet
        }
    });

}

let w = null, h = null, boxOffset = null, box = null, strokeBox = null, strokeBoxes = null, boxes = null;

function countBoxSizes()
{
    let cnvs = document.getElementById("cnvs");
    w = cnvs.width;
    h = cnvs.height;
    boxOffset = {x: w * 0.05, y: 0};
    let lw = settings.boxLineW;
    box = {w: w * 0.7 / 3 - lw, h: h - lw};
    strokeBox = {w: w * 0.7 / 3, h: h};
    strokeBoxes = [{x: 2 * boxOffset.x, y: boxOffset.y}, {x: 3 * boxOffset.x + box.w, y: boxOffset.y}, {x: 4 * boxOffset.x + 2 * box.w, y: boxOffset.y}];
    boxes = [{x: 2 * boxOffset.x + lw/2, y: boxOffset.y + lw/2}, {x: 3 * boxOffset.x + box.w + lw/2, y: boxOffset.y + lw/2}, {x: 4 * boxOffset.x + 2 * box.w + lw/2, y: boxOffset.y + lw/2}];

}

function drawLines()
{
    let cnvs = document.getElementById("cnvs");
    let ctx = cnvs.getContext('2d');

    // boxes
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#e2bd4a";
    //ctx.strokeRect(0,0,w,h)
    for(let i = 0; i < boxes.length; i++)
    {
        ctx.strokeRect(strokeBoxes[i].x, strokeBoxes[i].y, strokeBox.w, strokeBox.h);

    }
    ctx.stroke();

    // win box
    ctx.lineWidth = 7;
    ctx.strokeStyle = "black";
    ctx.strokeRect(boxOffset.x, h * 3 / 10, w - 2 * boxOffset.x, h * 4 / 10);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#e2bd4a";
    ctx.strokeRect(boxOffset.x, h * 3 / 10, w - 2 * boxOffset.x, h * 4 / 10);
    ctx.stroke();

    ctx.fillStyle = "rgba(255,255,255,0.6)"
    for(let i = 0; i < boxes.length; i++)
    {
        ctx.fillRect(boxes[i].x, boxes[i].y, box.w, h * 3 / 10 - boxes[i].y - 4);
        ctx.fillRect(boxes[i].x, h * 7 / 10 + 4, box.w, h * 3 / 10 - boxes[i].y - 4);
    }
    ctx.fill();

    // left arrow
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.fillStyle = "#e2bd4a";
    ctx.moveTo(0, h / 2 - boxOffset.y);
    ctx.lineTo(boxOffset.x * 2 / 3, h / 2);
    ctx.lineTo(0, h / 2 + boxOffset.y);
    ctx.lineTo(0, h / 2 - boxOffset.y);
    ctx.fill();
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.moveTo(0, h / 2 - boxOffset.y);
    ctx.lineTo(boxOffset.x * 2 / 3, h / 2);
    ctx.lineTo(0, h / 2 + boxOffset.y);
    ctx.lineTo(0, h / 2 - boxOffset.y);
    ctx.stroke();

    // right arrow
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.fillStyle = "#e2bd4a";
    ctx.moveTo(w, h / 2 - boxOffset.y);
    ctx.lineTo(w - boxOffset.x * 2 / 3, h / 2);
    ctx.lineTo(w, h / 2 + boxOffset.y);
    ctx.lineTo(w, h / 2 - boxOffset.y);
    ctx.fill();
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.moveTo(w, h / 2 - boxOffset.y);
    ctx.lineTo(w - boxOffset.x * 2 / 3, h / 2);
    ctx.lineTo(w, h / 2 + boxOffset.y);
    ctx.lineTo(w, h / 2 - boxOffset.y);
    ctx.stroke();
}

function drawImages()
{
    for(let i = 0; i < 3; i++)
    {
        for(let j = 0; j < 4; j++)
        {
            drawImage(state.inBoxNow[i][j], i, state.position[i] / 3 + (j-1) / 3);
        }
    }
}

function findNextImg(forBoxI)
{
    let byf = [];
    for(let i = 0; i < settings.imgNames.length; i++)
    {
        let flag = true;
        for(let j = 0; j < 4; j++)
        {
            if(flag && i === state.inBoxNow[forBoxI][j])
                flag = false;
        }
        if(flag)
            byf.push(i);
    }
    return  byf[Math.floor(Math.random() * byf.length)];

}

// position is 0..1
function drawImage(imgI, boxI, pos)
{
    let cnvs = document.getElementById("cnvs");
    let ctx = cnvs.getContext('2d');
    if(state.isImagesLoaded)
        ctx.drawImage(images[imgI], boxes[boxI].x + 2, boxes[boxI].y + 2 + pos * box.h, box.w-4, box.h/3-4);
}

function reDrawCNVS()
{
    let cnvs = document.getElementById("cnvs");
    let ctx = cnvs.getContext('2d');
    ctx.clearRect(0,0, w, h)
    drawImages();
    drawLines();
}

/*animate({
    duration: 200,
    timing(timeFraction) {
        return timeFraction;
    },
    drawClosing(progress, i) {
        document.getElementById("card_"+i).style.width = 100 - progress * 100 + "%"; // close
    },
    i,
});

function animate({timing, drawClosing, duration,i})
{

}*/

