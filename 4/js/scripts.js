let settings = {
    imgNames: ["./data/trophy.png", "./data/coins.png", "./data/brilliant.png", "./data/lemon.png", "./data/banana.png", "./data/cherry.png"],
    multiplier: [-1, 100, 10, 5, 3, -2], // -1 is jackpot, -2 is a money back/ . Use same order as imgNames
    leafColors: ["gainsboro","burlywood","lightblue","palegreen","moccasin","plum"],//Use same order as imgNames
    leafOneColorAmount: 3, // same elements

    addMaxRotations: 3, // steps in one rotation = minRotations + rand(0...addMaxRotations)
    minRotations: 3, // minimal steps in one rotation
    speed: 1, // rotation speed. increase if it's too slow
    oneRotationMovingTime: 2000, // ms. One rotation time
    startJackpot: 7777, //start jackpot value
    startPlayerCoins: 100, //start player coins value
    startBet: 10, //start bet value
}

let state = {
    jackpotValue: 1277, // debug. should be 0
    playerCoins: 145, // debug. should be 0
    bet: 115, // debug. should be 0

    rotations: 0, // counter in animation
    isImagesLoaded: false, // before this became true nothing will be painted
    counterLoadedImages: 0, //
    centralFrameColor: "#e2bd4a", // default central box color
    playerCoinsColor: "white", // default player coins color
    jackpotColor: "white", // default jackpot color

    currentPosition: 0.0,
    currentSpeed: 1,
    indexMultiplier: 0,
    leafW: null,
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

    /*countBoxSizes();
    reDrawCNVS();*/

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

    state.rotations = Math.floor(Math.random() * settings.addMaxRotations) + settings.minRotations
    state.animDuration = settings.oneRotationMovingTime * state.rotations / settings.speed;
    state.currentSpeed = settings.speed;
    state.animStart = performance.now();
    let stopTFValue = 0.75 + Math.random() / 10
    requestAnimationFrame(function animate(time)
    {
        let timeFraction = (time - state.animStart) / state.animDuration;
        if (timeFraction > 1) timeFraction = 1;

        if(timeFraction > 0)
        {
            let newTF = 1 - Math.sqrt(timeFraction)

            // ровное вращение
            //state.currentPosition = (timeFraction % (1 / state.rotations)) * state.rotations

            // вращение с замедлением
            state.currentPosition = 1 - (newTF % (1 / state.rotations)) * state.rotations
            reDrawCNVS();
        }
        if (timeFraction < stopTFValue)
            requestAnimationFrame(animate);
        else
            checkResults()
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
        state.bet *= settings.multiplier[state.indexMultiplier];
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

            if(i%2 === 0)
                drawWinPos()
        }, 500 * i);

    setTimeout(function(){moneyOperation(type);},500 * (maxIteration));
    setTimeout(function(){animationEnded();},500 * (maxIteration + 1));
}

function checkResults()
{
    let animationType = 0;
    state.indexMultiplier = (settings.leafColors.length - 1) - Math.floor(((state.currentPosition + (state.currentPosition < 0.25 ? 0.75 : -0.25)) / (1 / 18)) % settings.leafColors.length);
    //console.log(settings.imgNames[state.indexMultiplier])
    let multiplier = settings.multiplier[state.indexMultiplier]
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

let w = null, h = null;

function countBoxSizes()
{
    let cnvs = document.getElementById("cnvs");
    w = cnvs.width;
    h = cnvs.height;

    state.center = {x: Math.floor(w/2), y: Math.floor(h/2)}
    state.ringRO = Math.floor(Math.min(w,h)*4/10);
    state.ringRI = state.ringRO - Math.floor(Math.min(w,h)*3/100);
    //state.ringRC = Math.floor(Math.min(w,h)*5/100);
    state.ringRC = Math.floor(Math.min(w,h)*5/100);
}

function rotatePoint(point, angle, offset)
{
    point = {x: point.x - offset.x, y: point.y - offset.y}
    let b_cos = Math.cos(angle)
    let b_sin = Math.sin(angle)
    return {x: (b_cos) * (- point.x) + (-b_sin) * (- point.y) + offset.x, y: (b_sin) * (- point.x) + (b_cos) * (- point.y) + offset.y}
}

function drawWinPos()
{
    let cnvs = document.getElementById("cnvs");
    let ctx = cnvs.getContext('2d');

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.moveTo(state.center.x, state.center.y)

    let offset = 0
    let amountEl = settings.leafColors.length * settings.leafOneColorAmount
    if(state.currentPosition / (1/amountEl) - Math.floor(state.currentPosition / (1/amountEl)) > 0.5)
        offset -= (1/amountEl - state.currentPosition%(1/amountEl))
    else
        offset += state.currentPosition%(1/amountEl)
    offset *= 2 * Math.PI

    ctx.arc(state.center.x, state.center.y, state.ringRI, -Math.PI / 2 - state.leafW / 2 - offset, -Math.PI / 2 + state.leafW / 2 - offset, true);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
}

function reDrawCNVS()
{
    let cnvs = document.getElementById("cnvs");
    let ctx = cnvs.getContext('2d');
    ctx.clearRect(0,0, w, h)
    let x = state.center.x
    let y = state.center.y

    // Ring
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.arc(x, y, state.ringRO, 0, 2 * Math.PI, false);
    ctx.stroke();
    let gr = ctx.createRadialGradient(x,y,state.ringRI, x,y,state.ringRO);
    gr.addColorStop(1, "#e2bd4a");
    gr.addColorStop(0.5, "white");
    gr.addColorStop(0, "#e2bd4a");
    ctx.fillStyle = gr;
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(x, y, state.ringRI, 0, 2 * Math.PI, false);
    ctx.stroke();
    ctx.closePath();

    // Leaf
    state.leafW = Math.PI * 2 / (settings.leafColors.length * settings.leafOneColorAmount)
    let leafW = state.leafW
    for(let i = 0; i < settings.leafColors.length * settings.leafOneColorAmount; i++)
    {
        let grL = ctx.createRadialGradient(x,y,state.ringRC, x,y,state.ringRI);
        grL.addColorStop(1, settings.leafColors[i % settings.leafColors.length]);
        grL.addColorStop(0, "white");

        ctx.lineWidth = 1;
        let startAngle = -leafW * i - Math.PI * 2 * state.currentPosition
        ctx.beginPath();
        ctx.moveTo(x, y)
        ctx.arc(x, y, state.ringRI, startAngle,startAngle - leafW, true);
        ctx.lineTo(x, y)
        ctx.stroke();
        ctx.fillStyle = grL
        ctx.fill();
        ctx.closePath();

        startAngle *= -1
        // dots
        let dotAmount = 3
        for(let j = 0; j < dotAmount; j++)
        {
            let medR = Math.floor((state.ringRO - state.ringRI) / 2)
            let point = rotatePoint({x: x + state.ringRI + medR, y: y}, Math.PI  - (startAngle + leafW / dotAmount / 2 + leafW / dotAmount * j),{x:x,y:y})
            ctx.beginPath();
            ctx.arc(point.x, point.y, medR / 2 , 0, 2 * Math.PI, false);
            ctx.stroke();
            ctx.fill();
            ctx.closePath();
        }

        // img
        if(state.isImagesLoaded)
        {
            let point = rotatePoint({x: x + state.ringRI * 4 / 5, y: y}, Math.PI  - (startAngle + leafW / 2),{x:x,y:y})
            let imgSize = Math.floor(Math.min(w,h) / 17)

            ctx.save();
            ctx.beginPath();
            ctx.translate(point.x, point.y);
            ctx.rotate(- Math.PI / 2 + Math.PI  - (startAngle + leafW / 2))
            ctx.drawImage(images[i % settings.leafColors.length], -imgSize, -imgSize, imgSize * 2, imgSize * 2);
            ctx.fillStyle = "red"
            ctx.fill();
            ctx.closePath();
            ctx.restore();
        }
    }

    // Center arrow
    ctx.fillStyle = "#e2bd4a"
    ctx.beginPath();
    ctx.arc(x, y, state.ringRC, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.lineWidth = 1;
    let byfVar = state.ringRC * Math.cos(Math.PI / 180 * 45)
    ctx.moveTo(x - byfVar, y - byfVar)
    ctx.lineTo(x, y - 2 * byfVar)
    ctx.lineTo(x + byfVar, y - byfVar)
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}