facesSettings = {
    widthElements: 10,
    heightElements: 3,
}

facesIds = {
    img: "facesPhoto_",
    fullName: "facesPersonName_",
    position: "facesPersonPosition_",
    background: "photoFacesBlock_",
    leftArrow: "facesPrevButt",
    rightArrow: "facesNextButt",
    loading: "facesLoading",
    resultGreen: "butResultClassificationGreen_",
    resultYellow: "butResultClassificationYellow_",
    resultRed: "butResultClassificationRed_",
    butArrowOutR: "facesScreenArrowOutR",
    butPoo: "facesScreenPoo",
    butRemove: "facesScreenRemove",
    staffList: "facesScreenChoiceVal",
    staffListSelect: "choiceValFacesScreen",
    butBorderRemove: "butFacesRemove",
    imgBorderRemove: "imgFacesRemove",
}

facesState = {
    currentPage: 0,
    startId: 0,
    facesIdArray: [],
    checked: [],
    isRemovingInProgress: false,
}

function loadFaces(page = 1)
{
    if(facesState.isRemovingInProgress)
        return

    if(true)//!staffState.savingInProgress && !staffState.loadingInProgress && !staffState.removingInProgress && !loupeState.loadingInProgress)
    {
        //let login = document.getElementById(authFunct.ids.login).value.trim();
        //let pass = document.getElementById(authFunct.ids.pass).value.trim();
        let login = 'admin', pass = '111'; // debug

        let pageSize = facesSettings.heightElements * facesSettings.widthElements;
        //let pageSize = 3; // debug

        for(let i = 0; i <  facesSettings.widthElements; i++)
            for(let j = 0; j < facesSettings.heightElements; j++)
            {
                let ind = i*facesSettings.heightElements + j
                $("#" + facesIds.background + (ind)).css('z-index', 0)
                $("#" + facesIds.resultGreen + (ind)).css('z-index', 0)
                $("#" + facesIds.resultYellow + (ind)).css('z-index', 0)
                $("#" + facesIds.resultRed + (ind)).css('z-index', 0)
            }
        $("#"+facesIds.leftArrow).css('z-index', 0)
        $("#"+facesIds.rightArrow).css('z-index', 0)
        $("#"+facesIds.loading).css('z-index', 2)

        $.get('php/loadFacesList.php', {login: login, pass: pass, page: page, startId: facesState.startId, pageSize: pageSize}, function (result) {
            result = $.parseJSON(result);
            if(result.answer === "done")
            {
                facesState.facesIdArray = [];
                facesState.checked = [];
                facesState.currentPage = page;
                if(page === 1)
                {
                    if(result.arr.length > 0)
                        facesState.startId = parseInt(result.arr[0][0])
                    else
                        facesState.startId = 0;
                }
                if(page > 1)
                    $("#"+facesIds.leftArrow).css('z-index', 2)
                if(page * pageSize  < result.count)
                    $("#"+facesIds.rightArrow).css('z-index', 2)
                let counterFaces = 0;
                for(let i in result.arr)
                {
                    // data from result.arr[counterFaces][1] also has id_stuff if recognized correctly. that info isn't use right now
                    if(result.arr[counterFaces][1] === "-1")
                        $("#" + facesIds.resultYellow + (counterFaces)).css('z-index', 2)
                    else
                    {
                        if(result.arr[i][5] === "1")
                            $("#" + facesIds.resultRed + (counterFaces)).css('z-index', 2)
                        else
                            $("#" + facesIds.resultGreen + (counterFaces)).css('z-index', 2)
                    }

                    facesState.facesIdArray.push(result.arr[counterFaces][0])
                    facesState.checked.push(false)
                    $("#" + facesIds.fullName + counterFaces).text(result.arr[i][2])
                    $("#" + facesIds.position + counterFaces).text(result.arr[i][3])
                    $("#" + facesIds.img  + counterFaces).attr('src', result.arr[i][4])
                    $("#" + facesIds.background + (counterFaces)).css('z-index', 2)
                    counterFaces += 1;
                }
                facesSetAllCardsOpacity(1)
            }
            else
                console.log("Loading staff list error")
            $("#"+facesIds.loading).css('z-index', 0)
        });
    }
}

function facesSetAllCardsOpacity(op)
{
    for(let i = 0; i < facesState.checked.length; i++)
        facesSetCardOpacity(op, i)
}

function facesSetCardOpacity(op, i)
{
    $("#" + facesIds.img + i).css('opacity', op);
    $("#" + facesIds.fullName + i).css('opacity', op);
    $("#" + facesIds.position + i).css('opacity', op);
    $("#" + facesIds.resultGreen + i).css('opacity', op);
    $("#" + facesIds.resultYellow + i).css('opacity', op);
    $("#" + facesIds.resultRed + i).css('opacity', op);
}

function facesRefreshClicked()
{
    if(facesState.isRemovingInProgress)
        return

    facesState.currentPage = 0;
    facesState.startId = 0;
    loadFaces();
}

function facesShowActions(zIndex, dontTouchList = false)
{
    $("#" + facesIds.butArrowOutR).css('z-index', zIndex);
    $("#" + facesIds.butPoo).css('z-index', zIndex);
    $("#" + facesIds.butRemove).css('z-index', zIndex);
    if(zIndex === 0 && !dontTouchList)
        facesShowStaffList(0)
}


function facesShowStaffList(zIndex)
{
    // ..
}

function facesShowStaffList(zIndex)
{
    $("#" + facesIds.staffList).css('z-index', zIndex);
}

function facesCardClicked(i)
{
    if(facesState.isRemovingInProgress)
        return

    if(facesState.checked.every(elem => elem === false))
    {
        facesSetAllCardsOpacity(0.5)
        facesShowActions(2)
    }

    facesSetCardOpacity(facesState.checked[i] === false ? 1 : 0.5, i)
    facesState.checked[i] = !facesState.checked[i];


    if(facesState.checked.every(elem => elem === false))
    {
        facesSetAllCardsOpacity(1)
        facesShowActions(0)
    }
}

function facesPrevPage()
{
    if(facesState.currentPage > 1)
    {
        facesState.currentPage -= 1;
        loadFaces(facesState.currentPage)
    }
}

function facesNextPage()
{
    facesState.currentPage += 1;
    loadFaces(facesState.currentPage)
}

function facesAddToStaffClicked()
{
    facesShowStaffList(2)
    facesShowActions(0,true)
}

function facesAddToBannedClicked()
{

}

function facesRemoveClicked()
{
    if(!facesState.isRemovingInProgress)
    {
        facesState.isRemovingInProgress = true;
        let butId = "#"+facesIds.butBorderRemove
        let imgId = "#"+facesIds.imgBorderRemove
        $(butId).removeClass("butNoFrame").addClass("butFrame");
        $(imgId).removeClass("imgNoFrame").addClass("imgFrame");
        $(butId).removeClass('butRedBorder').removeClass('butGreenBorder').addClass('butYellowBorder');
        $(butId).removeClass('allowedToTouch').addClass('notAllowedToTouch');

        let arr = []
        for(let i = 0; i < facesState.checked.length; i++)
            if(facesState.checked[i])
                arr.push(facesState.facesIdArray[i]);

        console.log(arr)

        $.post('php/deleteCurrentFaces.php', {login: login, pass: pass, arr: arr}, function (result)
        {
            console.log(result)
            if(result !== "")
            {
                result = $.parseJSON(result);
                if(result.answer === "done")
                {
                    $(butId).removeClass('butRedBorder').removeClass('butYellowBorder').addClass('butGreenBorder');
                }
                else
                    $(butId).removeClass('butGreenBorder').removeClass('butYellowBorder').addClass('butRedBorder');
            }
            else
                $(butId).removeClass('butGreenBorder').removeClass('butYellowBorder').addClass('butRedBorder');
            $(butId).removeClass('notAllowedToTouch').addClass('allowedToTouch');
            setTimeout(() => {
                $(butId).removeClass('butFrame').addClass('butNoFrame');
                $(imgId).removeClass('imgFrame').addClass('imgNoFrame');
                $(butId).removeClass('butGreenBorder').removeClass('butYellowBorder').removeClass('butRedBorder');
                facesState.isRemovingInProgress = false;
                facesRefreshClicked()
            }, 1000);
        });
    }
}
