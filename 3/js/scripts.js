let settings = {
    imgNames: ["./data/trophy.png", "./data/coins.png", "./data/brilliant.png", "./data/lemon.png", "./data/banana.png", "./data/cherry.png"],
    multiplier: [-1, 100, 10, 5, 3, -2], // -1 is jackpot, -2 is a money back
    boxLineW: 4,
    addMaxSteps: 10,
    minSteps: 10,
    speed: 5,
    oneElementMovingTime: 500, // ms

    startJackpot: 7777,
    startPlayerCoins: 100,
    startBet: 10,
}

let state = {
    jackpotValue: 1277, // debug. should be 0
    playerCoins: 145, // debug. should be 0
    bet: 115, // debug. should be 0
    inBoxNow: [ // store current images
        [-1,-1,-1,-1],
        [-1,-1,-1,-1],
        [-1,-1,-1,-1],
    ],
    position: [0, 0, 0], // position in animation
    steps: [0, 0, 0], // counter in animation
    stepsLeft: [0, 0, 0], // counter in animation
    stepsInStart: [0, 0, 0], // counter in animation
    lastStep: [0, 0, 0], // counter in animation
    isImagesLoaded: false, // before this became true nothing will be painted
    counterLoadedImages: 0, //
    animDuration: 2000, // changes in depend of steps

    centralFrameColor: "#e2bd4a",
    playerCoinsColor: "white",
    jackpotColor: "white",
}

let ids = {
    go: "goBackground",
    jackpotValue: "jackpotValueLine",
    playerCoins: "creditValue",
    bet: "betValue",
}

let images = [];

function init()
{
    // make right dimension for canvas
    {
        document.getElementById("cnvs").width = document.getElementById("cnvs").getBoundingClientRect().width;
        document.getElementById("cnvs").height = document.getElementById("cnvs").getBoundingClientRect().height;
    }

    $("#" + ids.jackpotValue).text(settings.startJackpot);
    $("#" + ids.playerCoins).text(settings.startPlayerCoins);
    $("#" + ids.bet).text(settings.startBet);

    state.jackpotValue = settings.startJackpot;
    state.playerCoins = settings.startPlayerCoins;
    state.bet = settings.startBet;

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

function betPlusClicked()
{
    let tryBetValue = parseInt($("#" + ids.bet).text());
    let playerCoins = parseInt($("#" + ids.playerCoins).text());
    if(tryBetValue + 1 > playerCoins)
    {
        // blink coins red / white
        for(let i = 0; i < 2; i++)
            setTimeout(function(){
                $("#" + ids.playerCoins).css({'color': (i % 2 === 0 ? 'red': 'white')})
                }, 500 * i);
    }
    else
    {
        $("#" + ids.bet).text(tryBetValue + 1);
        state.bet = tryBetValue + 1;
    }
}

function betMinusClicked()
{
    let tryBetValue = parseInt($("#" + ids.bet).text());
    if(tryBetValue - 1 < 0)
    {
        // blink coins red / white
        for(let i = 0; i < 2; i++)
            setTimeout(function(){
                $("#" + ids.bet).css({'color': (i % 2 === 0 ? 'red': 'white')})
            }, 500 * i);
    }
    else
    {
        $("#" + ids.bet).text(tryBetValue - 1);
        state.bet = tryBetValue - 1;
    }
}

function goClicked()
{
    if(state.isAnimationStarted)
        return;

    state.jackpotValue = parseInt($("#" + ids.jackpotValue).text());
    state.playerCoins = parseInt($("#" + ids.playerCoins).text());
    state.bet = parseInt($("#" + ids.bet).text());
    $("#" + ids.playerCoins).text(state.playerCoins - state.bet);
    state.playerCoins = parseInt($("#" + ids.playerCoins).text());

    if(state.bet === 0)
    {
        // blink bet red / white
        for (let i = 0; i < 2; i++)
            setTimeout(function () {
                $("#" + ids.bet).css({'color': (i % 2 === 0 ? 'red' : 'white')})
            }, 500 * i);
        return;
    }

    state.isAnimationStarted = true;
    $("#" + ids.go).removeClass('goNotBordered').addClass('goBordered');
    for(let i = 0; i < 3; i++)
        state.steps[i] = Math.floor(Math.random() * settings.addMaxSteps) + settings.minSteps
    state.animDuration = settings.oneElementMovingTime * Math.max.apply(null, state.steps) / settings.speed;
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
            for(let i = 0; i < 3 ; i++)
            {
                if(state.position[i] > 0.5)
                {
                    console.log("+++")
                    state.inBoxNow[i][3] = state.inBoxNow[i][2];
                    state.inBoxNow[i][2] = state.inBoxNow[i][1];
                    state.inBoxNow[i][1] = state.inBoxNow[i][0];
                    state.inBoxNow[i][0] = findNextImg(i);

                    state.position[i] = 0;
                }
            }
            checkResults()
        }
    });

}

/*  animationType description
    0 - blink 3 times red / gold central frame
    1 - blink 3 times green / gold central frame
    2 - blink 3 times green / gold central frame and player coins green / white
    3 - blink 5 times green / gold central frame and player coins green / white and green / white jackpot value
 */
function winAnimation(type)
{
    if(type === 1)
    {
        state.bet *= settings.multiplier[state.inBoxNow[0][2]];
        $("#" + ids.bet).text(state.bet);
    }

    let baseFrameColor = state.centralFrameColor;
    let addFrameColor = type === 0 ? "red" : "green";

    let doBlinkJackpot = type === 3;
    let doBlinkCoins = type === 2 || type === 3;
    let doBlinkBet = type === 1 || type === 3;

    let maxIteration = (type === 3 ? 12 : 6)
    for(let i = 0; i < maxIteration; i++)
        setTimeout(function(){
            state.centralFrameColor = i % 2 === 0 ? addFrameColor : baseFrameColor;
            reDrawCNVS();

            if(doBlinkJackpot)
                $("#" + ids.jackpotValue).css({'color': (i % 2 === 0 ? 'green': 'white')});

            if(doBlinkCoins)
                $("#" + ids.playerCoins).css({'color': (i % 2 === 0 ? 'green': 'white')});

            if(doBlinkBet)
                $("#" + ids.bet).css({'color': (i % 2 === 0 ? 'green': 'white')});


        }, 500 * i);

    setTimeout(function(){moneyOperation(type);},500 * (maxIteration));
    setTimeout(function(){animationEnded();},500 * (maxIteration + 1));
}

function checkResults()
{
    let animationType = 0;
    if(state.inBoxNow[0][2] === state.inBoxNow[1][2] && state.inBoxNow[0][2] === state.inBoxNow[2][2])
    {
        let multiplier = settings.multiplier[state.inBoxNow[0][2]]
        if(multiplier == -1) // jackpot
        {
            animationType = 3;
        }
        else if(multiplier == -2) // money back
        {
            animationType = 2;
        }
        else
        {
            // it will be better count multiplier effect here, but it's happening in winAnimation(...) for more common tests
            animationType = 1;
        }
    }
    winAnimation(animationType)
}

function moneyOperation(type)
{
    if(type === 0 || type === 1)
        state.jackpotValue += state.bet;
    else if(type === 2)
        state.playerCoins += state.bet;
    else if(type === 3)
    {
        state.playerCoins += state.jackpotValue + state.bet;
        state.jackpotValue = 0;
    }

    state.bet = state.playerCoins >= settings.startBet ? settings.startBet : state.playerCoins;
    $("#" + ids.jackpotValue).text(state.jackpotValue);
    $("#" + ids.playerCoins).text(state.playerCoins);
    $("#" + ids.bet).text(state.bet);
}

function animationEnded()
{
    // call me when all spin actions are done.
    state.isAnimationStarted = false;
    $("#" + ids.go).removeClass('goBordered').addClass('goNotBordered');
}

let w = null, h = null, boxOffset = null, box = null, strokeBox = null, strokeBoxes = null, boxes = null, arrowOffsets = null;

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
    arrowOffsets = {x: w / 20, y: h / 15}
}

function drawLines()
{
    let cnvs = document.getElementById("cnvs");
    let ctx = cnvs.getContext('2d');

    // boxes
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#e2bd4a";
    for(let i = 0; i < boxes.length; i++)
        ctx.strokeRect(strokeBoxes[i].x, strokeBoxes[i].y, strokeBox.w, strokeBox.h);
    ctx.stroke();

    // win box
    ctx.beginPath();
    ctx.lineWidth = 7;
    ctx.strokeStyle = "black";
    ctx.strokeRect(boxOffset.x, h * 3 / 10, w - 2 * boxOffset.x, h * 4 / 10);
    ctx.lineWidth = 5;
    ctx.strokeStyle = state.centralFrameColor;//"#e2bd4a";
    ctx.strokeRect(boxOffset.x, h * 3 / 10, w - 2 * boxOffset.x, h * 4 / 10);
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = "rgba(255,255,255,0.6)"
    for(let i = 0; i < boxes.length; i++)
    {
        ctx.fillRect(boxes[i].x, boxes[i].y, box.w, h * 3 / 10 - boxes[i].y - 4);
        ctx.fillRect(boxes[i].x, h * 7 / 10 + 4, box.w, h * 3 / 10 - boxes[i].y - 4);
    }
    ctx.fill();

    // left arrow
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.fillStyle = state.centralFrameColor;//"#e2bd4a";
    ctx.moveTo(0, h / 2 - arrowOffsets.y);
    ctx.lineTo(arrowOffsets.x * 2 / 3, h / 2);
    ctx.lineTo(0, h / 2 + arrowOffsets.y);
    ctx.lineTo(0, h / 2 - arrowOffsets.y);
    ctx.fill();
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.moveTo(0, h / 2 - arrowOffsets.y);
    ctx.lineTo(arrowOffsets.x * 2 / 3, h / 2);
    ctx.lineTo(0, h / 2 + arrowOffsets.y);
    ctx.lineTo(0, h / 2 - arrowOffsets.y);
    ctx.stroke();

    // right arrow
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.fillStyle = state.centralFrameColor;//"#e2bd4a";
    ctx.moveTo(w, h / 2 - arrowOffsets.y);
    ctx.lineTo(w - arrowOffsets.x * 2 / 3, h / 2);
    ctx.lineTo(w, h / 2 + arrowOffsets.y);
    ctx.lineTo(w, h / 2 - arrowOffsets.y);
    ctx.fill();
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.moveTo(w, h / 2 - arrowOffsets.y);
    ctx.lineTo(w - arrowOffsets.x * 2 / 3, h / 2);
    ctx.lineTo(w, h / 2 + arrowOffsets.y);
    ctx.lineTo(w, h / 2 - arrowOffsets.y);
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

