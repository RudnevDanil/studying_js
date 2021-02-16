// make text and input straight
// first page
{
    let blocks = document.getElementsByClassName("streamSetPage1Text");
    let page1List = [];
    for (let i = 0; i < blocks.length; i++)
        page1List.push(blocks[i].offsetWidth)
    for (let i = 0; i < blocks.length; i++)
        blocks[i].style.width = Math.max.apply(null, page1List);
}

//second page
{
    let blocks = document.getElementsByClassName("streamSetPage2Text");
    let page2List = [];
    for (let i = 0; i < blocks.length; i++)
        page2List.push(blocks[i].offsetWidth)
    for (let i = 0; i < blocks.length; i++)
        blocks[i].style.width = Math.max.apply(null, page2List);
}

// add faces card template to staff LIST page
{
    let str = "";
    let counter = 0;
    for(let i = 0; i < 4; i++)
    {
        str += "<div class='photoLine'>";
        for(let j = 0; j < 10; j++)
        {
            str += "<div class='photoCard photoCardDescription photoCard" + ""+((counter%10)+1)+"' id='photoCardList_"+counter+"'>";
            str += "<img src='./data/photoPlaceholder.jpg' alt='photo' class='photo_30' id='staffListPhoto_"+counter+"'>";
            str += "<div class='staffPageText' id='staffListPersonName_"+counter+"'>Gates .M</div>";
            str += "<div class='staffPageText' id='staffListPersonPosition_"+counter+"'>SEO</div>";
            str += "</div>";
            str += "<div class='photoCard photoCard"+((counter%10)+1)+" photoCardPlaceHolderList' id='photoCardListPlaceHolder_"+counter+"'></div>";
            counter += 1;
        }
        str += "</div>";
    }
    document.getElementById("staffListPage").innerHTML = str + document.getElementById("staffListPage").innerHTML;
}

// add faces card template to staff ADD page
{
    let str = "";
    let counter = 0;
    for(let i = 0; i < 2; i++)
    {
        str += "<div class='photoLine photoLineWithBut'>";
        for(let j = 0; j < 10; j++)
        {
            str += "<div class='photoCard photoCardBut photoCard"+((counter%10)+1)+"' id='staffAddPhotoBackground_"+counter+"'>";
            str += "<img src='./data/photoPlaceholder.jpg' alt='photo' class='photo_30' id='staffAddPhoto_"+counter+"'>";
            str += "<div class='photoPlusMinus photoPlus'><div class='butBackground butBackgroundSmallSize'><img src='./data/plus.png' alt='plus' class='imgTopLine butImgSmallSize'><input type='file' class='addPhoto' multiple accept='image/png,image/jpeg'></div></div>";
            str += "<div class='photoPlusMinus photoMinus'><div class='butBackground butBackgroundSmallSize'><img src='./data/minus.png' alt='minus' class='imgTopLine butImgSmallSize'></div></div>";
            str += "</div>";
            str += "<div class='photoCard photoCard"+((counter%10)+1)+" photoCardPlaceHolderAdd' id='photoCardAddPlaceHolder_"+counter+"'></div>";
            counter += 1;
        }
        str += "</div>";
    }
    document.getElementById("staffAddPage").innerHTML = str + document.getElementById("staffAddPage").innerHTML;
}

// add faces card template to FACES page
{
    let str = "";
    let counter = 0;
    for(let i = 0; i < 3; i++)
    {
        str += "<div class='photoLine photoLineWithButAndDescription'>";
        for(let j = 0; j < 10; j++)
        {
            str += "<div class='photoCard photoCardButAndDescription photoCard"+((counter%10)+1)+"' id='photoFacesBlock_"+counter+"'>";
            str += "<img src='./data/photoPlaceholder.jpg' alt='photo' class='photo_30' id='facesPhoto_"+counter+"'>";
            str += "<div class='staffPageText' id='facesPersonName_"+counter+"'>Gates .M</div>";
            str += "<div class='staffPageText staffPageTextPosition' id='facesPersonPosition_"+counter+"'>SEO</div>";

            str += "<div class='photoPlusMinus resultClassification'><div class='butBackground butBackgroundSmallSize butResultClassification butResultClassificationOk' id='butResultClassificationBackground_"+counter+"'><img src='./data/checked.png' alt='plus' class='imgTopLine butImgSmallSize' id='butResultClassification_"+counter+"'></div></div>";
            str += "<div class='photoPlusMinus resultClassification'><div class='butBackground butBackgroundSmallSize butResultClassification butResultClassificationWarn' id='butResultClassificationBackground_"+counter+"'><img src='./data/info_2.png' alt='plus' class='imgTopLine butImgSmallSize' id='butResultClassification_"+counter+"'></div></div>";
            str += "<div class='photoPlusMinus resultClassification'><div class='butBackground butBackgroundSmallSize butResultClassification butResultClassificationAlert' id='butResultClassificationBackground_"+counter+"'><img src='./data/poo_surprise.png' alt='plus' class='imgTopLine butImgSmallSize' id='butResultClassification_"+counter+"'></div></div>";
            str += "<div class='photoPlusMinus resultClassification'><div class='butBackground butBackgroundSmallSize butResultClassification butResultClassificationBackground' id='butResultClassificationBackground_"+counter+"'></div></div>";

            str += "</div>";
            str += "<div class='photoCard photoCard"+((counter%10)+1)+" photoCardPlaceHolderFaces' id='photoCardFacesPlaceHolder_"+counter+"'></div>";
            counter += 1;
        }
        str += "</div>";
    }
    document.getElementById("facesPage").innerHTML = str + document.getElementById("facesPage").innerHTML;
}

// add slider action
function addActionsToSlider()
{
    for(let i = 1; i <= 5; i++)
        actions_map.addActionToSlider(i);
}
addActionsToSlider();

// make right dimension for canvas
{
    document.getElementById("map").width = document.getElementById("mapPage").getBoundingClientRect().width;
    document.getElementById("map").height = document.getElementById("mapPage").getBoundingClientRect().height;
}
actions_map.addActionToCanvas();

// in case of changed window size
document.addEventListener("DOMContentLoaded", function(event)
{
    //actions_map.reloadCNVS();
    window.onresize = function()
    {
        document.getElementById("map").width = document.getElementById("mapPage").getBoundingClientRect().width;
        document.getElementById("map").height = document.getElementById("mapPage").getBoundingClientRect().height;
        addActionsToSlider();
        actions_map.reDrawCNVS();
    };
});


// debug show list faces and buttons
{
    let blocks = document.getElementsByClassName("photoCardDescription");
    for (let i = 0; i < blocks.length; i++)
        blocks[i].style.zIndex = "2";

    let blocks_2 = document.getElementsByClassName("photoCardBut");
    for (let i = 0; i < blocks_2.length; i++)
        blocks_2[i].style.zIndex = "2";

    let blocks_3 = document.getElementsByClassName("photoCardButAndDescription");
    for (let i = 0; i < blocks_3.length; i++)
        blocks_3[i].style.zIndex = "2";

    let blocks_4 = document.getElementsByClassName("butResultClassificationOk");
    for (let i = 0; i < blocks_4.length; i+=3)
    {
        blocks_4[i].style.zIndex = "2";
    }

    let blocks_5 = document.getElementsByClassName("butResultClassificationWarn");
    for (let i = 1; i < blocks_5.length; i+=3)
    {
        blocks_5[i].style.zIndex = "2";
    }

    let blocks_6 = document.getElementsByClassName("butResultClassificationAlert");
    for (let i = 2; i < blocks_6.length; i+=3)
    {
        blocks_6[i].style.zIndex = "2";
    }

    document.getElementById("camSetNextButt").style.zIndex = "2";
    document.getElementById("camSetPrevButt").style.zIndex = "2";

    document.getElementById("staffListNextButt").style.zIndex = "2";
    document.getElementById("staffListPrevButt").style.zIndex = "2";

    document.getElementById("staffAddNextButt").style.zIndex = "2";
    document.getElementById("staffAddPrevButt").style.zIndex = "2";
    document.getElementById("staffAddRemoveUserButt").style.zIndex = "2";

    document.getElementById("facesNextButt").style.zIndex = "2";
    document.getElementById("facesPrevButt").style.zIndex = "2";

    //document.getElementById("wallSliders").style.zIndex = "0";
    //document.getElementById("cameraSliders").style.zIndex = "0";

}