let settings = {
    imgNames: ["./data/trophy.png", "./data/coins.png", "./data/brilliant.png", "./data/lemon.png", "./data/banana.png", "./data/cherry.png"],
    timeOneImgSwap: 300, // ms between image swap. like a speed
    countImagesInSpin: 5, // left will change this amount of images
    winColor: "green",
    losingColor: "red",
    defaultColor: "white",
    blinkTimeout: 500,
    blinkTimes: 6,
}

let state = {
    isImagesLoaded: false, // before this became true nothing will be painted
    counterLoadedImages: 0, // store count of loaded imgs
    currentImgI: [0,0,0], // array for image indexes for right now
    isSpin: false, // is spin now
    backgroundColor: "white",
    blinkMoreTimes: 0,
}

let ids = {
    spinButton: "btn",
}

let images = [];

function init()
{
    // make right dimension for canvas
    {
        document.getElementById("cnvs").width = document.getElementById("cnvs").getBoundingClientRect().width;
        document.getElementById("cnvs").height = document.getElementById("cnvs").getBoundingClientRect().height;
    }

    // load imgs
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
                reDrawCNVS();
            }
        }
    }
}

function spinClicked()
{
    if(!state.isSpin)
    {
        state.isSpin = true;
        document.getElementById(ids.spinButton).style.opacity = "0.5";
        spinning([1,2,3].map(x=> x * settings.countImagesInSpin))
    }
}

function compareWithZeroArr(arr) {
    for(let i = 0; i < arr.length; i++)
        if(arr[i] !== 0)
            return false
    return true
}

function spinning(status)
{
    console.log(status, compareWithZeroArr(status))
    if(compareWithZeroArr(status)) // spin ends
    {
        checkResults()
        return;
    }

    for(let i = 0; i < status.length; i++)
        if(status[i] !== 0)
        {
            let newVal = Math.floor(Math.random() * images.length);
            while(newVal === state.currentImgI[i])
                newVal = Math.floor(Math.random() * images.length)
            state.currentImgI[i] = newVal
            status[i]--
        }
    console.log(status)
    setTimeout(function(){
        reDrawCNVS()
        spinning(status)
    }, settings.timeOneImgSwap)
}

function checkResults()
{
    let result = true;
    for(let i = 0; i < state.currentImgI.length - 1 && result; i++)
    {
        if(state.currentImgI[i] !== state.currentImgI[i+1])
            result = false;
    }
    if(result)
        state.blinkColor = settings.winColor
    else
        state.blinkColor = settings.losingColor

    state.blinkMoreTimes = settings.blinkTimes
    blink()
}

function blink()
{
    if(state.blinkMoreTimes === 0)
    {
        state.backgroundColor = settings.defaultColor
        state.isSpin = false
        document.getElementById(ids.spinButton).style.opacity = "1";
        return
    }

    state.backgroundColor = (state.backgroundColor === settings.defaultColor) ? state.blinkColor : settings.defaultColor
    state.blinkMoreTimes--;
    reDrawCNVS();
    setTimeout(blink, settings.blinkTimeout)
}

function reDrawCNVS()
{
    if(!state.isImagesLoaded)
        return;

    let cnvs = document.getElementById("cnvs");
    let ctx = cnvs.getContext('2d');

    let w = cnvs.width, h = cnvs.height;

    ctx.clearRect(0, 0, w, h)

    //background
    ctx.beginPath();
    ctx.fillStyle = state.backgroundColor
    ctx.fillRect(0, 0, w, h);
    ctx.fill();

    // img
    if(state.isImagesLoaded)
    {
        for(let i = 0; i < state.currentImgI.length; i++)
        {
            ctx.save();
            ctx.beginPath();
            ctx.drawImage(images[state.currentImgI[i]], w*(0.31+0.035)*i + w*0.31*0.2, h*0.2, w*0.31*0.6, h*0.6);
            ctx.closePath();
            ctx.restore();
        }
    }

    ctx.beginPath();
    ctx.fillStyle = "black"
    for(let i = 0; i < 2; i++)
        ctx.fillRect(((i+1)*0.31 + i*0.035)*w, 0, w*0.035, h);
    ctx.fill();
}