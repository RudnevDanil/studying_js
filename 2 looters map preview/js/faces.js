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
    dateS: "facesDateSortS",
    dateE: "facesDateSortE",
}

facesState = {
    currentPage: 0,
    startId: 0,
    facesIdArray: [],
    checked: [],
    color: [],
    isRemovingInProgress: false,
    dateS: "",
    dateE: "",
}

function loadFaces(page = 1)
{
    if(facesState.isRemovingInProgress)
        return

    loadStaffList()
    facesState.facesIdArray = [];
    facesState.checked = [];
    facesState.color = [];

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

        if(staffState.dateS == undefined)
            staffState.dateS = "";
        if(staffState.dateE == undefined)
            staffState.dateE = "";

        $.get('php/loadFacesList.php', {login: login, pass: pass, page: page, startId: facesState.startId, pageSize: pageSize, dateS: facesState.dateS, dateE: facesState.dateE}, function (result) {
            result = $.parseJSON(result);
            if(result.answer === "done")
            {
                facesState.facesIdArray = [];
                facesState.checked = [];
                facesState.color = [];
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
                    if(result.arr[counterFaces][1] === "-1") {
                        $("#" + facesIds.resultYellow + (counterFaces)).css('z-index', 2)
                        facesState.color.push('y')
                    }
                    else
                    {
                        if(result.arr[i][5] === "1") {
                            $("#" + facesIds.resultRed + (counterFaces)).css('z-index', 2)
                            facesState.color.push('r')
                        }
                        else {
                            $("#" + facesIds.resultGreen + (counterFaces)).css('z-index', 2)
                            facesState.color.push('g')
                        }
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

        facesShowActions(0);
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
    $("#" + facesIds.butArrowOutR).removeClass('notAllowedToTouch').addClass('allowedToTouch');
    $("#" + facesIds.butPoo).removeClass('notAllowedToTouch').addClass('allowedToTouch');
    if(zIndex === 0 && !dontTouchList)
        facesShowStaffList(0)
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
    if(facesState.checked[i] === false) {
        if(facesState.color[i] === 'g' || facesState.color[i] === 'r') {
            $("#" + facesIds.butArrowOutR).removeClass('allowedToTouch').addClass('notAllowedToTouch');
            $("#" + facesIds.butPoo).removeClass('allowedToTouch').addClass('notAllowedToTouch');
        }
    }
    else
    {
        $("#" + facesIds.butArrowOutR).removeClass('notAllowedToTouch').addClass('allowedToTouch');
        $("#" + facesIds.butPoo).removeClass('notAllowedToTouch').addClass('allowedToTouch');
    }
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
    if(facesState.isRemovingInProgress)
        return

    facesShowStaffList(2)
    facesShowActions(0,true)
}

function facesAddToBannedClicked()
{
    if(facesState.isRemovingInProgress)
        return

    menuClicked(6);
    actions_staff.addShow()
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

        $.post('php/deleteCurrentFaces.php', {login: login, pass: pass, arr: arr}, function (result)
        {
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
                facesState.checked = [];
                facesRefreshClicked()
            }, 1000);
        });
    }
}

$("#" + facesIds.staffListSelect).change(function() {
    menuClicked(6);
    openStaffCard($(this).val())
});

function facesDateSortClicked()
{
    if(facesState.isRemovingInProgress)
        return

    facesState.dateS = $('#' + facesIds.dateS).val()
    if(facesState.dateS == NaN || facesState.dateS === "")
        facesState.dateS = "";
    else
    {
        facesState.dateE = $('#' + facesIds.dateE).val()
        if(facesState.dateE == NaN || facesState.dateE === "")
        {
            facesState.dateS = "";
            facesState.dateE = "";
        }
        else
        {
            facesState.dateS += " 00:00:00"
            facesState.dateE += " 00:00:00"
            facesState.currentPage = 0;
            facesState.startId = 0;
            loadFaces();
        }
    }
}