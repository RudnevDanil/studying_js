let settings = {
    blocks:{
        w:6,
        h:3,
    },
    cardFolders: "data/",
    cardNames:[
        "coin_10.png",
        "coin_20.png",
        "flower.png",
        "mushroom.png",
        "star.png",
        "treasure_10up.png",
    ],
    cardBackName: "back.png",
}

let state = {
    isBackSideArr: [],
    isAnimationStarted: false,
    cardMatrix: [],
    fixed: [],
    currentCard: {i: -1, j: -1},
    turns: 2,
    attempts: 0,
    wins: 0,
}

function flip(i, j)
{
    let isBackFirst = state.isBackSideArr[i][j];
    state.isBackSideArr[i][j] = !state.isBackSideArr[i][j];

    document.getElementById("card_" + i + "_" + j).style.animation = "flipClose 0.2s 1 linear";

    setTimeout(function()
    {
        document.getElementById((isBackFirst?"cardBack_":"cardFront_") + i + "_" + j).style.zIndex = "1";
        document.getElementById((!isBackFirst?"cardBack_":"cardFront_") + i + "_" + j).style.zIndex = "2";

        setTimeout(function()
        {
            document.getElementById("card_" + i + "_" + j).style.animation = "flipOpen 0.2s 1 linear";
            setTimeout(function()
            {
                state.isAnimationStarted = false;
            }, 200); // animation time
        }, 0); // timeout between opening
    },200); // animation time
}

function init()
{
    state.isBackSideArr = [];
    state.isAnimationStarted = false;
    state.cardMatrix = [];
    state.fixed = [];
    state.currentCard = {i: -1, j: -1};
    document.getElementById("turnsVal").innerHTML = state.turns;
    document.getElementById("attemptsVal").innerHTML = state.attempts;
    document.getElementById("winsVal").innerHTML = state.wins;

    // Make names array
    let cardRandList = [];
    for(let i = 0; i < settings.blocks.w * settings.blocks.h / 2; i++)
    {
        let index = i % settings.cardNames.length;
        cardRandList.push(index);
        cardRandList.push(index);
    }

    // Fisher–Yates shuffle
    for(let i = cardRandList.length - 1; i > 0; i--)
    {
        let j = Math.floor(Math.random()*(i + 1));
        let temp = cardRandList[j];
        cardRandList[j] = cardRandList[i];
        cardRandList[i] = temp;
    }

    // Make table
    state.cardMatrix = [];
    state.fixed = [];
    let table = "<table id='cardsTable'>";
    for(let i = 0; i < settings.blocks.h; i++)
    {
        state.cardMatrix.push([])
        state.fixed.push([])
        let newStr = "<tr id='tr_" + i + "'>";
        for(let j = 0; j < settings.blocks.w; j++)
        {
            state.cardMatrix[i].push(cardRandList.pop())
            state.fixed[i].push(false)
            newStr += "<th id='th_" + i + "_" + j + "'> " +
                "<div class = 'card'>" +
                "<div class = 'card_c' id='card_"+i+"_"+j+"'>" +
                "<div class='cardBack' id='cardBack_"+i+"_"+j+"'>" +
                "<img src=" + settings.cardFolders + settings.cardBackName + " alt='back'>" +
                "</div>" +
                "<div class='cardFront' id='cardFront_"+i+"_"+j+"'>" +
                "<img src=" + settings.cardFolders + settings.cardNames[state.cardMatrix[i][j]] + " alt='front'>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</th>"
        }
        newStr += "</tr>";
        table += newStr;
    }
    table += "</table>";
    let blackboard = document.getElementById("blackboard");
    blackboard.innerHTML = table;

    for(let i = 0; i < settings.blocks.h; i++)
    {
        state.isBackSideArr.push([])
        for(let j = 0; j < settings.blocks.w; j++)
        {
            state.isBackSideArr[i].push(true)
            document.getElementById("card_"+i+"_"+j).addEventListener("click", function(){cardClicked(i,j);})
        }
    }
}

function cardClicked(i, j)
{
    // if in list of fixed or currentCard or animation do not do anything
    if(state.fixed[i][j] || (state.currentCard.i == i && state.currentCard.j == j) || state.isAnimationStarted)
        return

    state.isAnimationStarted = true;
    flip(i,j);
    state.isAnimationStarted = true;
    setTimeout(function()
    {
        // if no current
        if(state.currentCard.i == -1 && state.currentCard.j == -1)
        {
            // take current
            state.currentCard = {i: i, j: j};
            state.isAnimationStarted = false;
        }
        else
        {
            if(state.cardMatrix[i][j] == state.cardMatrix[state.currentCard.i][state.currentCard.j])
            {
                // fix both
                state.fixed[i][j] = true;
                state.fixed[state.currentCard.i][state.currentCard.j] = true;

                // checking win
                for(let i = 0; i < settings.blocks.h; i++)
                    for(let j = 0; j < settings.blocks.w; j++)
                        if(!state.fixed[i][j])
                        {
                            state.currentCard = {i: -1, j: -1};
                            state.isAnimationStarted = false;
                            return
                        }

                // in case if all fixed
                state.wins += 1
                for(let fi = 0; fi < settings.blocks.h; fi++)
                {
                    for(let fj = 0; fj < settings.blocks.w; fj++)
                    {
                        if(state.fixed[fi][fj])
                            flip(fi,fj)
                        state.fixed[fi][fj] = false;
                    }
                }
                setTimeout(function()
                {
                    init()
                }, 430);
                state.isAnimationStarted = false;
            }
            else
            {
                flip(i, j)
                flip(state.currentCard.i, state.currentCard.j)
                if(state.turns == 0)
                {
                    state.turns = 2;
                    document.getElementById("turnsVal").style.color = "#DBB6AB";
                    state.attempts += 1;
                    document.getElementById("attemptsVal").innerHTML = state.attempts;

                    for(let fi = 0; fi < settings.blocks.h; fi++)
                    {
                        for(let fj = 0; fj < settings.blocks.w; fj++)
                        {
                            if(state.fixed[fi][fj])
                                flip(fi,fj)
                        }
                    }
                    for(let fi = 0; fi < settings.blocks.h; fi++)
                        for(let fj = 0; fj < settings.blocks.w; fj++)
                            state.fixed[fi][fj] = false;
                }
                else
                {
                    state.turns -= 1;
                    if(state.turns == 0)
                        document.getElementById("turnsVal").style.color = "red";
                }
                document.getElementById("turnsVal").innerHTML = state.turns;
            }

            state.currentCard = {i: -1, j: -1};
        }
    }, 420);
}


