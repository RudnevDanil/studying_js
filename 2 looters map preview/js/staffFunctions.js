staffSettings = {
    lines: 2,
    elInLine: 10,
}

staffIds = {
    photo: "staffAddPhoto_", // + counter
    background: "staffAddPhotoBackground_", // + counter
    leftArrow: "staffAddPrevButt",
    rightArrow: "staffAddNextButt",
    fullName: "staffAddPageName",
    position: "staffAddPagePosition",
}

staffState = {
    amountImages: 0,
    currentPage: 0,
    arr: [],
    loadingWait: 0,
    savingInProgress: false,
}

/*
    $('#' + camSetIds.uniSetBut).removeClass('butNoFrame').addClass('butFrame');
    $('#' + camSetIds.uniSetImg).removeClass('imgNoFrame').addClass('imgFrame');

    $('#' + camSetIds.streamSetBut).removeClass('butFrame').addClass('butNoFrame');
    $('#' + camSetIds.streamSetImg).removeClass('imgFrame').addClass('imgNoFrame');
*/

function saveNewPerson()
{
    if(!staffState.savingInProgress)
    {
        //let login = document.getElementById(authFunct.ids.login).value.trim();
        //let pass = document.getElementById(authFunct.ids.pass).value.trim();
        let login = 'admin', pass = '111'; // debug

        let fullName = document.getElementById(staffIds.fullName).value.trim();
        let position = document.getElementById(staffIds.position).value.trim();

        if(fullName === "" || position === "") {
            // обработать, поморгать надписью !!!
            return // debug
        }

        let butId = '#butSaveNewPerson'
        let imgId = '#imgSaveNewPerson'
        $(butId).removeClass('butNoFrame').addClass('butFrame');
        $(imgId).removeClass('imgNoFrame').addClass('imgFrame');
        $(butId).removeClass('butRedBorder').removeClass('butGreenBorder').addClass('butYellowBorder');
        $(butId).removeClass('allowedToTouch').addClass('notAllowedToTouch');
        staffState.savingInProgress = true;

        $.post('php/saveNewStaff.php', {login: login, pass: pass, fullName: fullName, position: position, arr: staffState.arr}, function (result)
        {
            if(result !== "")
            {
                console.log(result)
                result = $.parseJSON(result);
                if(result.answer === "saving success")
                    $(butId).removeClass('butRedBorder').removeClass('butYellowBorder').addClass('butGreenBorder');
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
                staffState.savingInProgress = false;
            }, 3000);
        });

    }
}

function staffAddNextPage()
{
    showAddStuffImages(staffState.currentPage + 1)
}

function staffAddPrevPage()
{
    showAddStuffImages(staffState.currentPage - 1 )
}

function showAddStuffImages(page)
{
    if(staffState.amountImages === 0)
        return

    for(let i = 0; i <  staffSettings.lines; i++)
        for(let j = 0; j < staffSettings.elInLine; j++)
            $("#" + staffIds.background + (i*staffSettings.elInLine + j)).css('z-index', 0)

    let els = staffSettings.lines * staffSettings.elInLine

    if (page === 0)
        $("#"+staffIds.leftArrow).css('z-index', 0)
    else
        $("#"+staffIds.leftArrow).css('z-index', 2)

    if ((page + 1) * els >= staffState.amountImages)
        $("#"+staffIds.rightArrow).css('z-index', 0)
    else
        $("#"+staffIds.rightArrow).css('z-index', 2)

    staffState.currentPage = page

    for(let i = 0; i <  staffSettings.lines; i++)
    {
        for(let j = 0; j < staffSettings.elInLine; j++)
        {
            let counter = i*staffSettings.elInLine + j
            let k = counter + page * els
            if(k < staffState.arr.length)
            {
                $("#staffAddPhoto_" + counter).attr('src', staffState.arr[k]);
                $("#" + staffIds.background + (counter)).css('z-index', 2)
            }
        }
    }
}

$(".addPhoto").bind('change', function()
{
    console.log("opened " + this.files.length)
    staffState.loadingWait = this.files.length
    for(let i = 0; i < this.files.length; i++)
    {
        let fr = new FileReader();
        fr.addEventListener("load", function () {
            //$('#staffAddPhoto_0').attr('src', fr.result);
            staffState.amountImages += 1
            staffState.loadingWait -= 1
            staffState.arr.push(fr.result)
            if(staffState.loadingWait === 0)
                showAddStuffImages(staffState.currentPage)
        }, false);
        fr.readAsDataURL(this.files[i]);
    }
});