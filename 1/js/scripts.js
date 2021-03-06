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

function animate({timing, drawClosing, drawOpening, duration,i ,j})
{

    let start = performance.now();
    let animState = 0;

    requestAnimationFrame(function animate(time)
    {
        // timeFraction изменяется от 0 до 1
        let timeFraction = (time - start) / duration;
        if (timeFraction > 1) timeFraction = 1;

        // вычисление текущего состояния анимации
        let progress = timing(timeFraction);

        // отрисовать её
        animState == 0 ? drawClosing(progress, i, j) : drawOpening(progress, i, j);

        if (timeFraction < 1)
        {
            requestAnimationFrame(animate);
        }
        else if (animState == 0)
        {
            start = time;
            animState = 1;
            let isBackFirst = state.isBackSideArr[i][j];
            state.isBackSideArr[i][j] = !state.isBackSideArr[i][j];
            document.getElementById((isBackFirst?"cardBack_":"cardFront_") + i + "_" + j).style.zIndex = "1";
            document.getElementById((!isBackFirst?"cardBack_":"cardFront_") + i + "_" + j).style.zIndex = "2";

            requestAnimationFrame(animate);
        }
        else
        {
            state.isAnimationStarted = false;
        }
    });
}

function flip2(i ,j)
{
    animate({
        duration: 200,
        timing(timeFraction) {
            return timeFraction;
        },
        drawClosing(progress, i, j) {
            document.getElementById("card_"+i+"_"+j).style.width = 100 - progress * 100 + "%"; // close
        },
        drawOpening(progress, i, j) {
            document.getElementById("card_"+i+"_"+j).style.width = progress * 100 + "%"; // open
        },
        i,
        j
    });

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
    let table = "";
    for(let i = 0; i < settings.blocks.h; i++)
    {
        state.cardMatrix.push([])
        state.fixed.push([])
        let newStr = "";
        for(let j = 0; j < settings.blocks.w; j++)
        {
            state.cardMatrix[i].push(cardRandList.pop())
            state.fixed[i].push(false)
            newStr += "" +
                "<div class = 'card'>" +
                "<div class = 'card_c' id='card_"+i+"_"+j+"'>" +
                "<img class='cardBack' src=" + settings.cardFolders + settings.cardBackName + " alt='back' id='cardBack_"+i+"_"+j+"'>" +
                "<img class='cardFront' src=" + settings.cardFolders + settings.cardNames[state.cardMatrix[i][j]] + " alt='front'  id='cardFront_"+i+"_"+j+"'>" +
                "</div>" +
                "</div>"
        }
        table += newStr;
    }
    let blackboard = document.getElementById("blackboard");
    blackboard.innerHTML = table;

    for(let i = 0; i < settings.blocks.h; i++)
    {
        state.isBackSideArr.push([])
        for(let j = 0; j < settings.blocks.w; j++)
        {
            state.isBackSideArr[i].push(true)
            document.getElementById("card_"+i+"_"+j).addEventListener("click", function()
            {
                cardClicked(i,j);
            });
        }
    }

    let elements = document.querySelectorAll('.card');
    for(let i = 0; i < elements.length; i++)
    {
        let valW = (80 / settings.blocks.w);
        elements[i].style.width =  valW * 0.8 + "vw";

        let valH = (70 / settings.blocks.h)
        elements[i].style.height = valH * 0.8 + "vh";

        valW *= 0.1;
        valH *= 0.1;

        elements[i].style.margin = valH + "vh " + valW + "vw";
    }

}

function cardClicked(i, j)
{
    // if in list of fixed or currentCard or animation do not do anything
    if(state.fixed[i][j] || (state.currentCard.i == i && state.currentCard.j == j) || state.isAnimationStarted)
        return

    state.isAnimationStarted = true;
    flip2(i,j);
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
                            flip2(fi,fj)
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
                flip2(i, j)
                flip2(state.currentCard.i, state.currentCard.j)
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
                                flip2(fi,fj)
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


