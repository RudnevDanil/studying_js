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
    currentPage: 0,
    arr: [],
    loadingWait: 0,
    savingInProgress: false,
    loadingInProgress: false,
}

function clearStuffAdd(isClearArray = true, isDrawImages = true)
{
    if(isClearArray)
    {
        staffState.currentPage = 0;
        staffState.arr = [];
        document.getElementById(staffIds.fullName).value = "";
        document.getElementById(staffIds.position).value = "";
    }

    for(let i = 0; i <  staffSettings.lines; i++)
        for(let j = 0; j < staffSettings.elInLine; j++)
            $("#" + staffIds.background + (i*staffSettings.elInLine + j)).css('z-index', 0)

    if(isDrawImages)
        showAddStuffImages(staffState.currentPage)
}

function saveNewPerson()
{
    if(!staffState.savingInProgress && !staffState.loadingInProgress)
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
                result = $.parseJSON(result);
                if(result.answer === "saving success")
                {
                    $(butId).removeClass('butRedBorder').removeClass('butYellowBorder').addClass('butGreenBorder');
                    clearStuffAdd()
                    loadStaffList();
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
                staffState.savingInProgress = false;
            }, 3000);
        });
    }
}

$("#" + ids.staffList).change(function()
{
    let val = $(this).val()
    if(val === "" || val === "loading ...") return false;

    actions_staff.addShow();
    staffState.loadingInProgress = true;
    document.getElementById(staffIds.fullName).value = "loading ...";
    document.getElementById(staffIds.position).value = "loading ...";

    $.get('php/loadStaffCard.php', {login: login, pass: pass, full_name: val}, function (result)
    {
        result = $.parseJSON(result);
        if(result.answer === "done")
        {
            for(val in result.arr)
                staffState.arr.push(result.arr[val][0])
            showAddStuffImages(staffState.currentPage)
            document.getElementById(staffIds.fullName).value = result.full_name;
            document.getElementById(staffIds.position).value = result.position;
        }
        else
            console.log("Loading staff card error")
        staffState.loadingInProgress = false;
    });
});

function loadStaffList()
{
    $.get('php/loadStaffList.php', {login: login, pass: pass}, function (result) {
        result = $.parseJSON(result);
        if(result.answer === "done")
        {
            let listId = "#" + ids.staffList;
            $(listId).empty();

            let keys = [];
            let optgroups = [];
            for(let j = 0; j < result.arr.length; j++)
            {
                let index = keys.indexOf(result.arr[j][1], 0);
                if(index === -1)
                {
                    keys.push(result.arr[j][1])
                    optgroups.push([]);
                    index = keys.indexOf(result.arr[j][1], 0);
                }
                optgroups[index].push(result.arr[j][0])
            }
            $(listId).append("<option></option>");
            for(let key of keys.values())
            {
                let str = "<optgroup label='" + key + "'>";
                let index = keys.indexOf(key, 0);
                for(let val of optgroups[index].values())
                    str += "<option>" + val + "</option>";
                str += "</optgroup>";
                $(listId).append(str);
            }
        }
        else
            console.log("Loading staff list error")
    });
}

function removeImg(i,j)
{
    if(staffState.arr.length !== 0)
    {
        staffState.arr.splice(staffSettings.elInLine * staffSettings.lines * staffState.currentPage + i * staffSettings.elInLine + j, 1)
        if(staffState.currentPage * staffSettings.elInLine * staffSettings.lines === staffState.arr.length && staffState.arr.length !== 0)
            staffState.currentPage -= 1;
        showAddStuffImages(staffState.currentPage)
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
    if(staffState.arr.length === 0)
    {
        $("#staffAddPhoto_0").attr('src', './data/photoPlaceholder.jpg');
        $("#" + staffIds.background + (0)).css('z-index', 2)
        return
    }

    clearStuffAdd(false,false)

    let els = staffSettings.lines * staffSettings.elInLine

    if (page === 0)
        $("#"+staffIds.leftArrow).css('z-index', 0)
    else
        $("#"+staffIds.leftArrow).css('z-index', 2)

    if ((page + 1) * els >= staffState.arr.length)
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
            staffState.loadingWait -= 1
            staffState.arr.push(fr.result)
            if(staffState.loadingWait === 0)
                showAddStuffImages(staffState.currentPage)
        }, false);
        fr.readAsDataURL(this.files[i]);
    }
});